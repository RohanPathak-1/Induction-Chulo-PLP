"use client";

import Image from "next/image";
import { useState } from "react";
import { productImages } from "@/lib/product";
import { useLanguage } from "./LanguageProvider";

export function ProductGallery({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const { t } = useLanguage();
  const image = productImages[active];

  return (
    <div>
      <button type="button" onClick={() => setZoom(true)} className={`focus-ring group relative block w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white ${compact ? "aspect-square" : "aspect-[4/3]"}`} aria-label={t.gallery.enlarge}>
        <Image src={image.src} alt={image.alt} fill priority={active === 0} sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6 transition duration-500 group-hover:scale-[1.03]"/>
        <span className="absolute bottom-4 right-4 rounded-full bg-[#142D4E]/90 px-3 py-2 text-xs font-bold text-white">{t.gallery.enlarge}</span>
      </button>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {productImages.map((item, index) => (
          <button key={item.src} type="button" onClick={() => setActive(index)} className={`focus-ring relative aspect-square overflow-hidden rounded-xl border-2 bg-white ${active === index ? "border-[#F97316]" : "border-slate-200"}`} aria-label={`${t.gallery.viewImage} ${index + 1}`}>
            <Image src={item.src} alt="" fill sizes="100px" className="object-contain p-1.5"/>
          </button>
        ))}
      </div>
      {zoom && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/85 p-5" role="dialog" aria-modal="true" aria-label={t.gallery.enlarge} onClick={() => setZoom(false)}><button type="button" className="focus-ring absolute right-5 top-5 rounded-full bg-white px-4 py-2 font-black text-slate-900">{t.gallery.close} ×</button><div className="relative h-[80vh] w-[min(1000px,95vw)]"><Image src={image.src} alt={image.alt} fill sizes="95vw" className="object-contain"/></div></div>}
    </div>
  );
}
