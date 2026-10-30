"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readOrderConfirmation, type OrderConfirmation } from "@/lib/order-confirmation";
import { formatNpr } from "@/lib/product";
import { useLanguage } from "./LanguageProvider";

export function ThankYouDetails() {
  const { language, t } = useLanguage();
  const [order, setOrder] = useState<OrderConfirmation | null | undefined>(undefined);

  useEffect(() => setOrder(readOrderConfirmation()), []);

  if (order === undefined) return <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />;

  if (!order) {
    return <><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange-100 text-3xl font-black text-[#F97316]">!</div><p className="mt-7 text-xs font-black uppercase tracking-[.18em] text-[#F97316]">{t.thankYou.unavailableLabel}</p><h1 className="display-title mt-3 text-4xl font-black text-[#142D4E] md:text-5xl">{t.thankYou.unavailableTitle}</h1><p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">{t.thankYou.unavailableMessage}</p><Link href="/checkout" className="focus-ring mt-7 inline-flex rounded-xl bg-[#F97316] px-6 py-3.5 font-black text-white">{t.thankYou.checkout}</Link></>;
  }

  const address = `${order.address}, ${order.city}, ${order.district}, ${order.province}`;
  const row = (label: string, value: React.ReactNode, strong = false) => <div className="grid gap-1 border-t border-slate-200 py-3 text-sm sm:grid-cols-[170px_1fr] sm:gap-4"><span className="text-slate-500">{label}</span><b className={`break-words sm:text-right ${strong ? "text-lg text-[#142D4E]" : "text-slate-800"}`}>{value}</b></div>;

  return <><div className="success-check mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl text-[#16A34A]">✓</div><p className="mt-7 inline-flex rounded-full bg-green-50 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-[#15803D]">{t.thankYou.confirmedLabel}</p><h1 className="display-title mt-5 text-4xl font-black text-[#142D4E] md:text-5xl">{t.thankYou.title}</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">{t.thankYou.message}</p><div className="mt-8 rounded-2xl bg-[#F3F5F9] p-5 text-left"><div className="grid gap-1 py-2 text-sm sm:grid-cols-[170px_1fr] sm:gap-4"><span className="text-slate-500">{t.thankYou.orderId}</span><b className="text-[#142D4E] sm:text-right">{order.orderId}</b></div>{row(t.thankYou.customerName, order.customerName)}{row(t.thankYou.product, order.productName)}{row(t.thankYou.quantity, order.quantity)}{row(t.thankYou.subtotal, formatNpr(order.subtotal, language))}{row(t.thankYou.delivery, order.deliveryFee === 0 ? t.form.free : formatNpr(order.deliveryFee, language))}{row(t.thankYou.total, formatNpr(order.total, language), true)}{row(t.thankYou.deliveryAddress, address)}{row(t.thankYou.payment, t.thankYou.cashOnDelivery)}</div><p className={`mt-5 text-sm ${order.notificationWarning ? "font-semibold text-orange-700" : "text-slate-500"}`}>{order.notificationWarning ? t.thankYou.emailWarning : `${t.thankYou.emailSent} ${order.customerEmail}`}</p><p className="mt-2 text-sm text-slate-500">{t.thankYou.support}</p></>;
}
