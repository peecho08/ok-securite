"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { translations } from "@/lib/translations";

function getLocale(): "fr" | "en" {
  try {
    const stored = localStorage.getItem("okchantier:language");
    if (stored === "en") return "en";
  } catch {}
  return "fr";
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = typeof window !== "undefined" ? getLocale() : "fr";
  const t = (key: string) =>
    (translations[locale]?.[key] as string) ?? (translations.fr[key] as string) ?? key;

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-8">
          <p className="text-center font-medium">{t("error.title")}</p>
          <p className="mt-2 text-center text-sm text-gray-500">
            {t("error.subtitle")}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white"
          >
            {t("error.retry")}
          </button>
        </div>
      </body>
    </html>
  );
}
