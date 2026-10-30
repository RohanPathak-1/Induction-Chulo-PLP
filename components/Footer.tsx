"use client";

import Link from "next/link";
import { BUSINESS } from "@/lib/i18n";
import { Mail, Phone } from "./Icons";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0D2037] pb-24 pt-16 text-white md:pb-10">
      <div className="container-shell grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><p className="text-2xl font-black">VoltMart Nepal</p><p className="mt-3 max-w-sm leading-7 text-slate-300">{t.footer.tagline}<br/>{t.footer.localTagline}</p></div>
        <div><p className="font-extrabold">{t.footer.quickLinks}</p><div className="mt-4 grid gap-3 text-sm text-slate-300"><Link href="/#benefits">{t.footer.benefits}</Link><Link href="/#gallery">{t.footer.gallery}</Link><Link href="/#reviews">{t.footer.reviews}</Link><Link href="/#faq">{t.footer.faq}</Link><Link href="/#order">{t.footer.order}</Link></div></div>
        <div><p className="font-extrabold">{t.footer.support}</p><div className="mt-4 grid gap-4 text-sm text-slate-300"><a className="flex items-center gap-2" href={BUSINESS.phoneHref}><Phone className="h-4 w-4"/> {BUSINESS.phoneDisplay}</a><a className="flex items-center gap-2 break-all" href={BUSINESS.emailHref}><Mail className="h-4 w-4"/> {BUSINESS.email}</a></div></div>
      </div>
      <div className="container-shell mt-12 border-t border-white/10 pt-6 text-xs text-slate-400">© {new Date().getFullYear()} VoltMart Nepal. {t.footer.disclaimer}</div>
    </footer>
  );
}
