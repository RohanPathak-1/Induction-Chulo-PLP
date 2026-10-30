"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Language, type Translation } from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("voltmart-language");
    setLanguageState(saved === "ne" ? "ne" : "en");
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
    if (hydrated) document.documentElement.classList.remove("language-pending");
  }, [hydrated, language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("voltmart-language", next);
  };

  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
