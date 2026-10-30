"use client";

import Link from "next/link";
import { useState } from "react";
import { BUSINESS } from "@/lib/i18n";
import { BrandLogo } from "./BrandLogo";
import { Menu, Phone, ShoppingCart, X } from "./Icons";
import { useLanguage } from "./LanguageProvider";
import { ScrollProgress } from "./ScrollProgress";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["/#benefits", t.nav.benefits],
    ["/#gallery", t.nav.photos],
    ["/#reviews", t.nav.reviews],
    ["/#faq", t.nav.faq],
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="container-shell flex h-[76px] items-center justify-between gap-3">
        <BrandLogo priority />

        <nav className="hidden items-center gap-5 text-sm font-bold text-slate-600 lg:flex" aria-label="Main navigation">
          {links.map(([href, label]) => <Link key={href} href={href} className="focus-ring rounded-md px-1 py-2 transition hover:text-[#F97316]">{label}</Link>)}
          <a href={BUSINESS.phoneHref} className="focus-ring flex items-center gap-2 rounded-md py-2 text-[#142D4E]"><Phone className="h-4 w-4"/> {BUSINESS.phoneDisplay.replace("+977 ", "")}</a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Language">
            <button type="button" onClick={() => setLanguage("en")} className={`focus-ring rounded-lg px-2.5 py-2 text-xs font-black transition ${language === "en" ? "bg-[#142D4E] text-white shadow-sm" : "text-slate-600 hover:bg-white"}`} aria-pressed={language === "en"}>EN</button>
            <button type="button" onClick={() => setLanguage("ne")} className={`focus-ring rounded-lg px-2.5 py-2 text-xs font-black transition ${language === "ne" ? "bg-[#142D4E] text-white shadow-sm" : "text-slate-600 hover:bg-white"}`} aria-pressed={language === "ne"}>ने</button>
          </div>
          <Link href="/#order" className="focus-ring hidden items-center gap-2 rounded-xl bg-[#F97316] px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 sm:flex"><ShoppingCart className="h-4 w-4"/> {t.nav.order}</Link>
          <button type="button" onClick={() => setMenuOpen(open => !open)} className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-[#142D4E] lg:hidden" aria-label={menuOpen ? t.nav.closeMenu : t.nav.menu} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </div>

      {menuOpen && <nav className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden" aria-label="Mobile navigation"><div className="container-shell !w-full grid gap-1">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="focus-ring rounded-xl px-4 py-3 font-bold text-[#142D4E] hover:bg-orange-50">{label}</Link>)}<a href={BUSINESS.phoneHref} className="focus-ring flex items-center gap-2 rounded-xl px-4 py-3 font-bold text-[#142D4E]"><Phone className="h-4 w-4"/> {BUSINESS.phoneDisplay}</a><Link href="/#order" onClick={() => setMenuOpen(false)} className="focus-ring mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-3 font-black text-white"><ShoppingCart className="h-4 w-4"/> {t.nav.order}</Link></div></nav>}
      <ScrollProgress/>
    </header>
  );
}
