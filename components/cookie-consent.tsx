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

function HardHat() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-amber-500"
    >
      <path
        d="M4 16h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M2 16h20M4 16v-3a8 8 0 1 1 16 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4v4M8.5 8.5 12 8M15.5 8.5 12 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (!getCookieConsent()) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
    }
  }, []);

  function accept(value: CookieConsentValue) {
    setEntered(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, value ?? "essential");
      setVisible(false);
      if (value === "all") {
        window.dispatchEvent(new Event("analytics-consent-granted"));
      }
    }, 300);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-4">
      <div
        className={`mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out dark:border-neutral-700 dark:bg-neutral-900/95 ${
          entered
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 hidden sm:block">
            <HardHat />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("cookie.message")}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500 dark:text-neutral-400">
              {t("cookie.analyticsMessage")}{" "}
              <Link
                href="/privacy"
                className="underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-900 hover:decoration-gray-500 dark:decoration-neutral-600 dark:hover:text-white dark:hover:decoration-neutral-400"
              >
                {t("cookie.learnMore")}
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => accept("essential")}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 sm:flex-none dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {t("cookie.essentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => accept("all")}
            className="flex-1 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 sm:flex-none"
          >
            {t("cookie.acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
