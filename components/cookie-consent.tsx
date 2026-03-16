"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";

export type CookieConsentValue = "all" | "essential" | null;

const STORAGE_KEY = "cookie-consent";

export function getCookieConsent(): CookieConsentValue {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "all" || v === "essential") return v;
  if (v === "accepted") return "all";
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "all";
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (!getCookieConsent()) {
      setVisible(true);
    }
  }, []);

  function accept(value: CookieConsentValue) {
    localStorage.setItem(STORAGE_KEY, value ?? "essential");
    setVisible(false);
    if (value === "all") {
      window.dispatchEvent(new Event("analytics-consent-granted"));
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95">
        <p className="text-sm text-gray-600 dark:text-neutral-300">
          {t("cookie.message")}{" "}
          {t("cookie.analyticsMessage")}{" "}
          <Link href="/privacy" className="underline hover:text-gray-900 dark:hover:text-white">
            {t("cookie.learnMore")}
          </Link>
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => accept("essential")}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {t("cookie.essentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => accept("all")}
            className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {t("cookie.acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
