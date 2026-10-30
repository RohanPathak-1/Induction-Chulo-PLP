"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveOrderConfirmation } from "@/lib/order-confirmation";
import { provinceOptions } from "@/lib/i18n";
import { DELIVERY_FEES, formatNpr, PRODUCT, type DeliveryZone } from "@/lib/product";
import { Check, Shield, Truck } from "./Icons";
import { useLanguage } from "./LanguageProvider";

const valleyDistrict = /(kathmandu|काठमाडौं|lalitpur|ललितपुर|bhaktapur|भक्तपुर)/i;

export function OrderForm({ initialQuantity = 1, compact = false }: { initialQuantity?: number; compact?: boolean }) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(Math.max(1, Math.min(10, initialQuantity)));
  const [zone, setZone] = useState<DeliveryZone>("inside");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submissionKey = useRef<string | null>(null);
  const deliveryFee = DELIVERY_FEES[zone];
  const total = useMemo(() => PRODUCT.unitPrice * quantity + deliveryFee, [quantity, deliveryFee]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setMessage("");
    const form = new FormData(event.currentTarget);
    const required = ["fullName", "phone", "email", "province", "district", "city", "address"];
    if (required.some(name => !String(form.get(name) || "").trim())) return setMessage(t.form.completeRequired);
    const phone = String(form.get("phone") || "").replace(/[\s-]/g, "");
    if (!/^(?:\+977)?9[78]\d{8}$/.test(phone)) return setMessage(t.form.invalidPhone);
    const email = String(form.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage(t.form.invalidEmail);
    const district = String(form.get("district") || "").trim();
    if (zone === "inside" && !valleyDistrict.test(district)) return setMessage(t.form.locationMismatch);
    if (zone === "outside" && valleyDistrict.test(district)) return setMessage(t.form.locationOutsideMismatch);
    const provinceIndex = Number(form.get("province"));
    const province = provinceOptions[language][Number.isInteger(provinceIndex) ? provinceIndex : -1];
    if (!province) return setMessage(t.form.completeRequired);

    const payload = {
      fullName: String(form.get("fullName")).trim(),
      phone,
      email,
      province,
      district,
      city: String(form.get("city")).trim(),
      address: String(form.get("address")).trim(),
      deliveryZone: zone,
      quantity,
      productName: PRODUCT.name,
      paymentMethod: "Cash On Delivery" as const,
      notes: String(form.get("notes") || "").trim(),
      website: "",
    };

    try {
      setSubmitting(true);
      submissionKey.current ||= window.crypto.randomUUID();
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKey.current },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { message?: string; orderId?: string; total?: number; notificationWarning?: boolean };
      if (!response.ok || !result.orderId) throw new Error(result.message || t.form.submitError);

      saveOrderConfirmation({
        orderId: result.orderId,
        customerName: payload.fullName,
        customerEmail: payload.email,
        productName: PRODUCT.shortName,
        quantity,
        subtotal: PRODUCT.unitPrice * quantity,
        deliveryFee,
        total: typeof result.total === "number" ? result.total : total,
        province,
        district,
        city: payload.city,
        address: payload.address,
        notificationWarning: Boolean(result.notificationWarning),
      });
      submissionKey.current = null;
      router.push("/thank-you");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.form.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  const field = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#F97316] focus:ring-4 focus:ring-orange-100";
  return (
    <form onSubmit={submit} className={`rounded-[28px] bg-white ${compact ? "p-5 md:p-7" : "p-6 shadow-soft md:p-9"}`} noValidate>
      <div className="flex items-start justify-between gap-4">
        <div><span className="eyebrow">{t.form.eyebrow}</span><h2 className="mt-3 text-2xl font-black text-[#142D4E] md:text-3xl">{t.form.title}</h2><p className="mt-2 text-sm text-slate-500">{t.form.description}</p></div>
        <span className="hidden rounded-2xl bg-green-50 p-3 text-[#16A34A] sm:block"><Shield/></span>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">{t.form.fullName} *<input name="fullName" minLength={2} className={field} placeholder={t.form.fullNamePlaceholder} autoComplete="name"/></label>
        <label className="text-sm font-bold text-slate-700">{t.form.phone} *<input name="phone" inputMode="tel" pattern="(?:\+977[- ]?)?9[78][0-9]{8}" className={field} placeholder={t.form.phonePlaceholder} autoComplete="tel"/></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">{t.form.email} *<input name="email" type="email" inputMode="email" required className={field} placeholder={t.form.emailPlaceholder} autoComplete="email"/></label>
        <label className="text-sm font-bold text-slate-700">{t.form.province} *<select name="province" className={field} defaultValue=""><option value="" disabled>{t.form.provincePlaceholder}</option>{provinceOptions[language].map((label, index) => <option key={index} value={String(index)}>{label}</option>)}</select></label>
        <label className="text-sm font-bold text-slate-700">{t.form.district} *<input name="district" className={field} placeholder={t.form.districtPlaceholder} autoComplete="address-level2"/></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">{t.form.city} *<input name="city" className={field} placeholder={t.form.cityPlaceholder} autoComplete="address-level1"/></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">{t.form.address} *<textarea name="address" minLength={6} rows={3} className={field} placeholder={t.form.addressPlaceholder} autoComplete="street-address"/></label>
      </div>
      <fieldset className="mt-6"><legend className="text-sm font-bold text-slate-700">{t.form.deliveryZone} *</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{(["inside", "outside"] as DeliveryZone[]).map(value => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${zone === value ? "border-[#F97316] bg-orange-50" : "border-slate-200"}`}><input type="radio" name="deliveryZone" value={value} checked={zone === value} onChange={() => setZone(value)} className="accent-[#F97316]"/><span><b className="block text-sm text-[#142D4E]">{value === "inside" ? t.form.inside : t.form.outside}</b><small className={value === "inside" ? "font-bold text-[#16A34A]" : "text-slate-500"}>{value === "inside" ? t.form.free : t.form.outsideFee}</small></span></label>)}</div></fieldset>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">{t.form.quantity} *<div className="mt-2 flex h-[52px] items-center justify-between rounded-xl border border-slate-300 px-2"><button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="focus-ring grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl font-black" aria-label={t.form.decrease}>−</button><output className="font-black text-[#142D4E]">{quantity}</output><button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="focus-ring grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl font-black" aria-label={t.form.increase}>+</button></div></label>
        <label className="text-sm font-bold text-slate-700">{t.form.payment}<input name="paymentMethod" value={t.form.cod} readOnly className={`${field} bg-slate-50 font-bold text-[#142D4E]`}/></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">{t.form.notes}<textarea name="notes" rows={2} maxLength={300} className={field} placeholder={t.form.notesPlaceholder}/></label>
      </div>
      <div className="mt-7 rounded-2xl bg-[#F3F5F9] p-5">
        <div className="flex justify-between text-sm text-slate-600"><span>{PRODUCT.shortName} × {quantity}</span><b>{formatNpr(PRODUCT.unitPrice * quantity, language)}</b></div>
        <div className="mt-3 flex justify-between text-sm text-slate-600"><span>{t.form.deliveryFee}</span><b className={deliveryFee === 0 ? "text-[#16A34A]" : ""}>{deliveryFee === 0 ? t.form.free : formatNpr(deliveryFee, language)}</b></div>
        <div className="my-4 h-px bg-slate-200"/><div className="flex items-end justify-between gap-4"><span className="font-extrabold text-[#142D4E]">{t.form.total}</span><span className="text-2xl font-black text-[#142D4E]">{formatNpr(total, language)}</span></div>
      </div>
      {message && <div role="alert" className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold leading-6 text-orange-800">{message}</div>}
      <button type="submit" disabled={submitting} className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"><Check className="h-5 w-5"/> {submitting ? t.form.submitting : t.form.submit} — {formatNpr(total, language)}</button>
      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500"><span className="flex items-center gap-1"><Truck className="h-4 w-4"/> {t.form.deliveryByLocation}</span><span className="flex items-center gap-1"><Shield className="h-4 w-4"/> {t.form.cod}</span></div>
    </form>
  );
}
