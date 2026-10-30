"use client";

import Link from "next/link";
import { BUSINESS } from "@/lib/i18n";
import { formatNpr, PRODUCT } from "@/lib/product";
import { EverydayUse } from "@/components/EverydayUse";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ArrowRight, Check, Clean, FlameOff, Mail, Pan, Phone, Plug, Ruler, Sparkles, Utensils } from "@/components/Icons";
import { OrderForm } from "@/components/OrderForm";
import { ProductGallery } from "@/components/ProductGallery";
import { ShowcasePurchase } from "@/components/ShowcasePurchase";
import { Testimonials } from "@/components/Testimonials";
import { TrustMarquee } from "@/components/TrustMarquee";
import { useLanguage } from "@/components/LanguageProvider";

const benefitIcons = [Plug, FlameOff, Utensils, Ruler, Clean, Sparkles, Pan];

export default function Home() {
  const { language, t } = useLanguage();
  return <main>
    <Header/>
    <section className="fine-grid relative overflow-hidden bg-[#F8FAFC] pb-20 pt-14 md:pb-28 md:pt-20">
      <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-orange-200/25 blur-3xl"/>
      <div className="container-shell grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-black text-orange-700 shadow-sm"><Sparkles className="h-4 w-4"/> {t.hero.badge}</div>
          <h1 className="display-title mt-6 max-w-3xl text-5xl font-black text-[#142D4E] sm:text-6xl lg:text-[72px]">{t.hero.title}</h1>
          <p className="mt-6 max-w-xl text-xl font-extrabold leading-9 text-[#142D4E]">{t.hero.subtitle}</p>
          <p className="mt-4 max-w-xl leading-7 text-slate-600">{t.hero.description}</p>
          <div className="mt-7 flex flex-wrap items-end gap-4"><span className="text-lg text-slate-400 line-through">{formatNpr(PRODUCT.regularPrice, language)}</span><span className="text-4xl font-black text-[#142D4E]">{formatNpr(PRODUCT.unitPrice, language)}</span><span className="rounded-lg bg-[#142D4E] px-3 py-2 text-xs font-black text-white">{t.hero.save}</span></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/#order" className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-7 py-4 font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-1 hover:bg-orange-600">{t.hero.order} <ArrowRight className="h-5 w-5"/></Link><a href="#benefits" className="focus-ring rounded-xl border-2 border-[#142D4E] px-7 py-4 text-center font-black text-[#142D4E] transition hover:bg-[#142D4E] hover:text-white">{t.hero.benefits}</a></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-600"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A34A]"/> {t.hero.cod}</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A34A]"/> {t.hero.freeDelivery}</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A34A]"/> {t.hero.phoneSupport}</span></div>
        </div>
        <HeroSlideshow/>
      </div>
    </section>

    <TrustMarquee/>

    <section id="benefits" className="section-pad scroll-mt-24 bg-white">
      <div className="container-shell"><div className="max-w-2xl"><span className="eyebrow">{t.benefits.eyebrow}</span><h2 className="display-title mt-4 text-4xl font-black text-[#142D4E] md:text-5xl">{t.benefits.title}</h2><p className="mt-5 leading-8 text-slate-600">{t.benefits.description}</p></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.benefits.cards.map(([title, description], index) => { const Icon = benefitIcons[index]; return <article key={title} className="group rounded-3xl border border-slate-200 bg-white p-6 text-[#142D4E] transition duration-300 hover:-translate-y-1.5 hover:border-[#142D4E] hover:bg-[#142D4E] hover:text-white hover:shadow-xl active:scale-[.99]"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-[#F97316] transition duration-300 group-hover:bg-white/10 group-hover:text-orange-300"><Icon/></span><h3 className="mt-5 font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600 transition duration-300 group-hover:text-slate-200">{description}</p></article>; })}</div>
      </div>
    </section>

    <section id="gallery" className="section-pad scroll-mt-24 bg-[#F3F5F9]"><div className="container-shell grid items-center gap-14 lg:grid-cols-2"><ProductGallery/><ShowcasePurchase/></div><p className="container-shell mt-8 text-center text-xs leading-5 text-slate-500">{t.gallery.modelNote}</p></section>

    <EverydayUse/>
    <Testimonials/>

    <section id="faq" className="section-pad scroll-mt-24 bg-[#F3F5F9]"><div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><span className="eyebrow">{t.faq.eyebrow}</span><h2 className="display-title mt-4 text-4xl font-black text-[#142D4E] md:text-5xl">{t.faq.title}</h2><p className="mt-5 leading-8 text-slate-600">{t.faq.description}</p><div className="mt-7 grid gap-3"><a href={BUSINESS.phoneHref} className="focus-ring inline-flex w-fit items-center gap-2 rounded-md font-black text-[#F97316]"><Phone className="h-5 w-5"/> {BUSINESS.phoneDisplay}</a><a href={BUSINESS.emailHref} className="focus-ring inline-flex w-fit items-center gap-2 rounded-md font-bold text-[#142D4E]"><Mail className="h-5 w-5"/> {BUSINESS.email}</a></div></div><Faq/></div></section>

    <section id="order" className="section-pad scroll-mt-24 bg-white"><div className="container-shell grid items-start gap-12 lg:grid-cols-[.7fr_1.3fr]"><div className="lg:sticky lg:top-28"><span className="eyebrow">{t.orderIntro.eyebrow}</span><h2 className="display-title mt-4 text-4xl font-black text-[#142D4E] md:text-5xl">{t.orderIntro.title}</h2><p className="mt-5 leading-8 text-slate-600">{t.orderIntro.description}</p><div className="mt-7 rounded-3xl bg-[#142D4E] p-6 text-white"><div className="flex justify-between text-sm text-slate-300"><span>{t.orderIntro.regularPrice}</span><span className="line-through">{formatNpr(PRODUCT.regularPrice, language)}</span></div><div className="mt-2 flex items-end justify-between gap-4"><b>{t.orderIntro.todayPrice}</b><b className="text-3xl text-orange-300">{formatNpr(PRODUCT.unitPrice, language)}</b></div></div></div><OrderForm compact/></div></section>

    <section className="bg-[#F97316] py-16 text-white"><div className="container-shell flex flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div><h2 className="text-3xl font-black">{t.support.title}</h2><p className="mt-3 max-w-2xl leading-7 text-orange-50">{t.support.description}</p></div><div className="flex flex-wrap gap-3"><a href={BUSINESS.phoneHref} className="focus-ring flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-[#142D4E]"><Phone className="h-5 w-5"/> {t.support.call}</a><a href={BUSINESS.emailHref} className="focus-ring flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 font-black"><Mail className="h-5 w-5"/> {t.support.email}</a></div></div></section>
    <Footer/>
    <Link href="/#order" className="focus-ring fixed bottom-4 left-4 right-4 z-30 flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-4 font-black text-white shadow-2xl md:hidden">{t.hero.order} <ArrowRight className="h-5 w-5"/></Link>
  </main>;
}
