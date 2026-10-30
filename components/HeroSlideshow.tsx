"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { productImages } from "@/lib/product";
import { useLanguage } from "./LanguageProvider";
import { ChevronLeft, ChevronRight } from "./Icons";

export function HeroSlideshow() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % productImages.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const go = (direction: number) => setActive(index => (index + direction + productImages.length) % productImages.length);

  return <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
    <div className="absolute -inset-3 rotate-3 rounded-[40px] bg-[#142D4E]"/>
    <div className="relative aspect-square overflow-hidden rounded-[36px] bg-white shadow-soft">
      {productImages.map((image, index) => <Image key={image.src} src={image.src} alt={`${t.hero.imageLabel} ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1024px) 90vw, 45vw" className={`object-contain p-8 transition-opacity duration-500 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`}/>) }
      <button type="button" onClick={() => go(-1)} className="focus-ring absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#142D4E] shadow-md transition hover:bg-white" aria-label={t.hero.previousImage}><ChevronLeft className="h-5 w-5"/></button>
      <button type="button" onClick={() => go(1)} className="focus-ring absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#142D4E] shadow-md transition hover:bg-white" aria-label={t.hero.nextImage}><ChevronRight className="h-5 w-5"/></button>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2" role="tablist" aria-label={t.hero.imageLabel}>{productImages.map((image, index) => <button type="button" key={image.src} onClick={() => setActive(index)} className={`focus-ring h-2.5 rounded-full transition-all ${index === active ? "w-7 bg-[#F97316]" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`} aria-label={`${t.hero.imageLabel} ${index + 1}`} aria-selected={index === active} role="tab"/>)}</div>
    </div>
    <div className="absolute -bottom-4 -left-3 rounded-2xl bg-white p-4 shadow-xl"><span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{t.hero.insideValley}</span><b className="mt-1 block text-lg text-[#16A34A]">{t.hero.freeDeliveryShort}</b></div>
  </div>;
}
