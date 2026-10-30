"use client";

import Link from "next/link";
import { Suspense } from "react";
import { PRODUCT } from "@/lib/product";
import { Check, Shield, Truck } from "./Icons";
import { CheckoutClient } from "./CheckoutClient";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useLanguage } from "./LanguageProvider";

export function CheckoutPageContent() {
  const { t } = useLanguage();
  const trustItems = [
    { Icon: Shield, text: t.form.orderNotice },
    { Icon: Truck, text: t.form.deliveryByLocation },
    { Icon: Check, text: `${t.gallery.specialPrice}: ${PRODUCT.shortName}` },
  ];
  return <main className="min-h-screen bg-[#F3F5F9]"><Header/><div className="container-shell py-12 md:py-20"><Link href="/" className="text-sm font-bold text-slate-500 hover:text-[#F97316]">← VoltMart Nepal</Link><div className="mt-8 grid items-start gap-10 lg:grid-cols-[.72fr_1.28fr]"><aside className="rounded-[28px] bg-[#142D4E] p-7 text-white lg:sticky lg:top-28"><span className="text-xs font-black uppercase tracking-[.16em] text-orange-300">{t.form.cod}</span><h1 className="mt-4 text-3xl font-black">{t.orderIntro.title}</h1><p className="mt-3 leading-7 text-slate-300">{t.form.description}</p><div className="my-7 h-px bg-white/10"/><p className="text-sm text-slate-400">{t.gallery.title}</p><p className="mt-2 font-black">{PRODUCT.name}</p><div className="mt-7 grid gap-4 text-sm">{trustItems.map(({ Icon, text }) => <div key={text} className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-300"/><span>{text}</span></div>)}</div></aside><Suspense fallback={<div className="h-96 animate-pulse rounded-[28px] bg-white"/>}><CheckoutClient/></Suspense></div></div><Footer/></main>;
}
