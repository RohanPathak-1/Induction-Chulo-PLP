"use client";

import { useSearchParams } from "next/navigation";
import { OrderForm } from "./OrderForm";

export function CheckoutClient() {
  const params = useSearchParams();
  const raw = Number(params.get("quantity") || 1);
  const quantity = Number.isInteger(raw) ? Math.max(1, Math.min(10, raw)) : 1;
  return <OrderForm initialQuantity={quantity}/>;
}
