"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";

const NDA_KEY = "ok-chantier:nda-accepted";

const copy = {
  fr: {
    title: "Avis de confidentialité",
    p1: "Ce prototype, incluant son concept, ses fonctionnalités et son approche, demeure la propriété exclusive de ses créateurs et est présenté à titre strictement confidentiel.",
    p2: "Toute reproduction, utilisation ou divulgation sans autorisation écrite est interdite.",
    p3: "En cliquant sur « J\u2019ai compris », vous reconnaissez le caractère confidentiel de cette présentation et acceptez ces termes.",
    cta: "J\u2019ai compris",
  },
  en: {
    title: "Confidentiality Notice",
    p1: "This prototype, including its concept, features and approach, remains the exclusive property of its creators and is presented on a strictly confidential basis.",
    p2: "Any reproduction, use or disclosure without written authorization is prohibited.",
    p3: "By clicking \u201cI understand\u201d, you acknowledge the confidential nature of this presentation and accept these terms.",
    cta: "I understand",
  },
};

export function NdaGate({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLocale();
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    setAccepted(localStorage.getItem(NDA_KEY) === "1");
  }, []);

  if (accepted === null) return null;

  if (!accepted) {
    const t = copy[locale === "en" ? "en" : "fr"];

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
        <Image
          src="/logo.svg"
          alt="OK Chantier"
          width={120}
          height={30}
          className="mb-6 h-6 w-auto brightness-0 invert opacity-40"
          priority
        />
        <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 text-white shadow-2xl">
          <h2 className="font-heading text-xl font-bold">{t.title}</h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-300">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem(NDA_KEY, "1");
              setAccepted(true);
            }}
            className="mt-6 w-full rounded-xl bg-white py-3.5 font-heading text-base font-bold text-neutral-900 transition-colors hover:bg-neutral-200 active:bg-neutral-300"
          >
            {t.cta}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
          className="mt-4 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-300"
        >
          {locale === "fr" ? "English" : "Français"}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
