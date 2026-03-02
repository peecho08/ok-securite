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
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/nda-bg.jpg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <Image
          src="/ok-yellow-white.svg"
          alt="OK Chantier"
          width={160}
          height={40}
          className="mb-6 h-10 w-auto"
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
          className="mt-4 rounded-lg border border-neutral-700 bg-neutral-800/60 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-700/60 hover:text-white"
        >
          {locale === "fr" ? "English" : "Français"}
        </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
