"use client";

import { Check, Headphones, Shield, ShoppingCart, Truck, Zap } from "./Icons";
import { useLanguage } from "./LanguageProvider";

const icons = [Shield, Truck, Headphones, ShoppingCart, Check, Zap];

export function TrustMarquee() {
  const { t } = useLanguage();
  const group = (hidden = false) => <div className="marquee-group" aria-hidden={hidden}>{t.marquee.map((label, index) => { const Icon = icons[index]; return <div className="marquee-item" key={`${label}-${index}`} tabIndex={hidden ? -1 : 0}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3F5F9] text-[#142D4E]"><Icon className="h-5 w-5"/></span><b>{label}</b></div>; })}</div>;
  return <section className="marquee-shell border-y border-slate-200 bg-white py-4" aria-label="Shopping benefits"><div className="marquee-track">{group()}{group(true)}</div></section>;
}
