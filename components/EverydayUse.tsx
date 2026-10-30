"use client";

import Image from "next/image";
import { Cup, Droplet, Pan, Utensils } from "./Icons";
import { useLanguage } from "./LanguageProvider";

const icons = [Cup, Droplet, Utensils, Pan];

export function EverydayUse() {
  const { t } = useLanguage();
  return <section className="section-pad overflow-hidden bg-[#142D4E] text-white"><div className="container-shell grid items-center gap-12 lg:grid-cols-2"><div><span className="eyebrow !text-orange-300">{t.everyday.eyebrow}</span><h2 className="display-title mt-4 text-4xl font-black md:text-5xl">{t.everyday.title}</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{t.everyday.description}</p><div className="mt-8 grid grid-cols-2 gap-3" role="list" aria-label={t.everyday.title}>{t.everyday.items.map((label, index) => { const Icon = icons[index]; return <div key={label} role="listitem" className="everyday-card rounded-2xl border p-4 text-left font-bold"><Icon className="mb-3 h-5 w-5 text-[#F97316]"/>{label}</div>; })}</div></div><div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-white"><Image src="/products/induction-lifestyle.jpg" alt={t.everyday.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain"/></div></div></section>;
}
