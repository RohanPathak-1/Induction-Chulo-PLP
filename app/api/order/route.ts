import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { orderSchema } from "@/lib/order-schema";
import { createStoredOrder, saveOrder, sendOrderEmails } from "@/lib/orders";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt < now) { attempts.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: NextRequest) {
  try {
    const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, "");
    const origin = request.headers.get("origin")?.replace(/\/$/, "");
    if (allowedOrigin && origin && origin !== allowedOrigin) return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
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
