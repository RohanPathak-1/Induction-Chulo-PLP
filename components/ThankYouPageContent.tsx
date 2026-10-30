"use client";

import Link from "next/link";
import { Suspense } from "react";
import { BUSINESS } from "@/lib/i18n";
import { Header } from "./Header";
import { Mail, Phone } from "./Icons";
import { useLanguage } from "./LanguageProvider";
import { ThankYouDetails } from "./ThankYouDetails";

export function ThankYouPageContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#F3F5F9]">
      <Header />
      <div className="fine-grid grid min-h-[calc(100vh-76px)] place-items-center px-5 py-12">
        <div className="w-full max-w-2xl rounded-[36px] bg-white p-7 text-center shadow-soft md:p-12">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-slate-100" />}>
            <ThankYouDetails />
          </Suspense>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-[#142D4E]">
            <a href={BUSINESS.phoneHref} className="focus-ring inline-flex items-center gap-2 rounded-md"><Phone className="h-4 w-4" />{BUSINESS.phoneDisplay}</a>
            <a href={BUSINESS.emailHref} className="focus-ring inline-flex items-center gap-2 rounded-md"><Mail className="h-4 w-4" />{BUSINESS.email}</a>
          </div>
          <Link href="/" className="focus-ring mt-8 inline-flex rounded-xl bg-[#142D4E] px-7 py-4 font-black text-white transition hover:bg-[#1d426f]">{t.thankYou.home}</Link>
        </div>
      </div>
    </main>
  );
}
