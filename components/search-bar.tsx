"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  pinned: boolean;
}

const placeholderExamplesFr = [
  "coffrage",
  "travaux en hauteur",
  "électricité",
  "échafaudage",
  "coulage béton",
  "plomberie",
  "démolition",
  "peinture",
  "soudage",
  "toiture",
];

const placeholderExamplesEn = [
  "formwork",
  "working at heights",
  "electrical",
  "scaffolding",
  "concrete pour",
  "plumbing",
  "demolition",
  "painting",
  "welding",
  "roofing",
];

export function SearchBar({ query, onQueryChange, pinned }: SearchBarProps) {
  const { locale, t } = useLocale();
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const placeholderExamples = locale === "en" ? placeholderExamplesEn : placeholderExamplesFr;

  useEffect(() => {
    setPlaceholderIdx(0);
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholderExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [locale, placeholderExamples.length]);

  return (
    <div className={`sticky top-0 z-10 bg-[var(--color-header)] px-5 pb-3 sm:px-8 transition-[padding] duration-200 ${pinned ? "pt-3" : "pt-1.5"}`} role="search">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label={t("a11y.searchTasks")}
          className="w-full rounded-lg border border-white/30 bg-white/15 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-white/50 focus:bg-white/20"
        />
        {!query && (
          <div className="pointer-events-none absolute inset-0 flex items-center pl-10 pr-4 text-sm text-white/70" aria-hidden="true">
            <span>{t("home.search.try")}&nbsp;</span>
            <span className="inline-flex h-[1.25em] items-center overflow-hidden">
              <span key={placeholderIdx} className="animate-placeholder-rotate block">
                « {placeholderExamples[placeholderIdx]} »
              </span>
            </span>
          </div>
        )}
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label={t("home.search.clear")}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
