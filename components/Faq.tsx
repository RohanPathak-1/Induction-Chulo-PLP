"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);
  return <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white px-5 shadow-sm md:px-8">{t.faq.items.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="focus-ring flex w-full items-center justify-between gap-5 rounded-lg py-6 text-left font-extrabold text-[#142D4E]" aria-expanded={open === index}><span>{question}</span><span className={`text-2xl text-[#F97316] transition ${open === index ? "rotate-45" : ""}`}>+</span></button>{open === index && <p className="max-w-3xl pb-6 leading-8 text-slate-600">{answer}</p>}</div>)}</div>;
}
