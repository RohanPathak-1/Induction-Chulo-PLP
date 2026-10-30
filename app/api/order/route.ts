import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { orderSchema } from "@/lib/order-schema";
import { createStoredOrder, saveOrder, sendOrderEmails } from "@/lib/orders";

export const runtime = "nodejs";
const OFFICIAL_PRODUCTION_ORIGIN = "https://product.rohan-pathak.com.np";
const attempts = new Map<string, { count: number; resetAt: number }>();

function normalizeOrigin(value: string | undefined) {
  if (!value?.trim()) return null;
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

function allowedOrigins() {
  const candidates = [
    OFFICIAL_PRODUCTION_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  if (process.env.NODE_ENV !== "production") {
    candidates.push("http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001");
  }

  return new Set(candidates.map(normalizeOrigin).filter((origin): origin is string => Boolean(origin)));
}

function requestOriginIsAllowed(request: NextRequest) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return true;
  const origin = normalizeOrigin(originHeader);
  return Boolean(origin && allowedOrigins().has(origin));
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt < now) { attempts.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: NextRequest) {
  try {
    if (!requestOriginIsAllowed(request)) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) return NextResponse.json({ message: "धेरै प्रयास भयो। कृपया एक मिनेटपछि फेरि प्रयास गर्नुहोस्।" }, { status: 429 });
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey || !/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return NextResponse.json({ message: "Invalid submission key." }, { status: 400 });
    const input = orderSchema.parse(await request.json());
    if (input.deliveryZone === "inside" && !/(kathmandu|काठमाडौं|lalitpur|ललितपुर|bhaktapur|भक्तपुर)/i.test(input.district)) return NextResponse.json({ message: "काठमाडौं उपत्यकाभित्रको डेलिभरीका लागि जिल्ला Kathmandu, Lalitpur वा Bhaktapur हुनुपर्छ।" }, { status: 400 });
    const order = createStoredOrder(input);
    const stored = await saveOrder(order, idempotencyKey);
    if (stored.duplicate) return NextResponse.json({ success: true, duplicate: true, orderId: stored.orderId, total: order.total }, { status: 200 });
    const email = await sendOrderEmails(order).catch(error => { console.error("Order stored but email setup/send failed", error); return { sent: false, failedCount: 2 }; });
    return NextResponse.json({ success: true, orderId: order.orderId, total: order.total, notificationWarning: !email.sent }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ message: error.issues[0]?.message || "Invalid order details.", issues: error.flatten() }, { status: 400 });
    console.error("Order submission failed", error);
    const message = error instanceof Error && /is not configured/.test(error.message) ? "Order service is not configured yet. Please call +977 9768776740 to order." : "अर्डर सुरक्षित गर्न सकिएन। तपाईंको विवरण सुरक्षित भएको छैन। कृपया फेरि प्रयास गर्नुहोस्।";
    return NextResponse.json({ message }, { status: 503 });
  }
}
