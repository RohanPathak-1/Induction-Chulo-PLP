"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "./Icons";
import { formatNpr, PRODUCT } from "@/lib/product";
import { useLanguage } from "./LanguageProvider";

export function ShowcasePurchase() {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const total = PRODUCT.unitPrice * quantity;
  return <div>
    <span className="eyebrow">{t.gallery.eyebrow}</span>
    <h2 className="display-title mt-4 text-4xl font-black text-[#142D4E] md:text-5xl">{t.gallery.title}</h2>
    <p className="mt-5 leading-8 text-slate-600">{t.gallery.description}</p>
    <ul className="mt-6 grid gap-3 text-sm font-bold text-slate-700">{t.gallery.features.map(item => <li key={item} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-green-100 text-[#16A34A]"><Check className="h-4 w-4"/></span>{item}</li>)}</ul>
    <div className="mt-8 grid max-w-md gap-2 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm"><span className="text-slate-500">{t.gallery.regularPrice}</span><span className="text-slate-400 line-through">{formatNpr(PRODUCT.regularPrice, language)}</span></div>
      <div className="flex items-end justify-between"><span className="font-bold text-[#142D4E]">{t.gallery.specialPrice}</span><span className="text-4xl font-black text-[#142D4E]">{formatNpr(PRODUCT.unitPrice, language)}</span></div>
      <div className="mt-1 flex items-center justify-between"><p className="text-sm font-bold text-[#F97316]">{t.gallery.saveToday}</p><span className="rounded-full bg-orange-100 px-3 py-2 text-xs font-black text-orange-700">11% OFF</span></div>
    </div>
    <div className="mt-7 flex max-w-md items-center justify-between rounded-2xl border border-slate-200 p-3"><span className="pl-2 text-sm font-bold text-slate-600">{t.gallery.quantity}</span><div className="flex items-center gap-4"><button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl font-black" aria-label={t.form.decrease}>−</button><b>{quantity}</b><button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="focus-ring grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl font-black" aria-label={t.form.increase}>+</button></div></div>
    <div className="mt-4 flex max-w-md justify-between rounded-2xl bg-[#142D4E] p-5 text-white"><span>{t.gallery.productTotal}</span><b className="text-xl">{formatNpr(total, language)}</b></div>
    <Link href={`/#order`} className="focus-ring mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600">{t.gallery.buyNow} <ArrowRight className="h-5 w-5"/></Link>
  </div>;
}
