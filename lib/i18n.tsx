"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getLanguage, setLanguage as persistLanguage } from "./storage";
import { translations } from "./translations";

export type Locale = "fr" | "en";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const saved = getLanguage() as Locale;
    if (saved && saved !== "fr") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    persistLanguage(l);
  }, []);

  const t = useCallback(
    (key: string) => {
      const val = translations[locale]?.[key] ?? translations.fr[key] ?? key;
      if (Array.isArray(val)) return val[Math.floor(Math.random() * val.length)];
      return val;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  return useContext(I18nContext);
}
