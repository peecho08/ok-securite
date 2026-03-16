"use client";

import Link from "next/link";
import { translations } from "@/lib/translations";

function getLocale(): "fr" | "en" {
  try {
    const stored = localStorage.getItem("okchantier:language");
    if (stored === "en") return "en";
  } catch {}
  return "fr";
}

export default function NotFound() {
  const locale = typeof window !== "undefined" ? getLocale() : "fr";
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
