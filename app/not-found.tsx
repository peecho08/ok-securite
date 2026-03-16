"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations } from "@/lib/translations";

export default function NotFound() {
  const [locale, setLocale] = useState<"fr" | "en">("fr");

  useEffect(() => {
    try {
      if (localStorage.getItem("okchantier:language") === "en") setLocale("en");
    } catch {}
  }, []);

  const t = (key: string) =>
    (translations[locale]?.[key] as string) ?? (translations.fr[key] as string) ?? key;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6 py-8 dark:bg-neutral-900">
      <p className="text-6xl font-bold text-gray-300 dark:text-neutral-700">404</p>
      <p className="mt-4 text-center font-medium text-gray-800 dark:text-neutral-200">
        {t("notFound.title")}
      </p>
      <p className="mt-2 text-center text-sm text-gray-500 dark:text-neutral-400">
        {t("notFound.subtitle")}
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 font-heading text-sm font-bold text-white"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
