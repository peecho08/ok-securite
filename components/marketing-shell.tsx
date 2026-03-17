"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { I18nProvider, useLocale } from "@/lib/i18n";
import { APP_URL } from "@/lib/urls";

function MarketingNav() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[var(--color-header)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/ok-securite.svg"
            alt="OK Sécurité"
            width={120}
            height={32}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/comment-ca-marche"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {t("mkt.nav.howItWorks")}
          </Link>
          <Link
            href="/checklists"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {t("mkt.nav.checklists")}
          </Link>
          <Link
            href="/plans"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {t("mkt.nav.plans")}
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="rounded-md px-2 py-1 text-xs font-bold uppercase text-white/60 transition-colors hover:text-white"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a
            href={APP_URL}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {t("mkt.nav.try")}
          </a>
        </div>

        {/* Mobile: lang toggle + CTA + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            className="rounded-md px-2 py-1 text-xs font-bold uppercase text-white/60 transition-colors hover:text-white"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <a
            href={APP_URL}
            className="rounded-lg bg-[var(--color-primary)] px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {t("mkt.nav.try")}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors hover:text-white"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-white/10 bg-[var(--color-header)] px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/comment-ca-marche"
              onClick={close}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("mkt.nav.howItWorks")}
            </Link>
            <Link
              href="/checklists"
              onClick={close}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("mkt.nav.checklists")}
            </Link>
            <Link
              href="/plans"
              onClick={close}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {t("mkt.nav.plans")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function MarketingFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-neutral-400">
            <Link href="/comment-ca-marche" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-200">
              {t("mkt.nav.howItWorks")}
            </Link>
            <Link href="/checklists" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-200">
              {t("mkt.nav.checklists")}
            </Link>
            <Link href="/plans" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-200">
              {t("mkt.nav.plans")}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-200">
              {t("legal.terms")}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-gray-700 dark:hover:text-neutral-200">
              {t("legal.privacy")}
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} OK Sécurité. {t("mkt.footer.rights")}
          </p>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-300 dark:text-neutral-600">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2L9.19 7.53 4.02 7.22 7.09 11.37 5.82 16.4 10.66 14.22 12 19.5 13.34 14.22 18.18 16.4 16.91 11.37 19.98 7.22 14.81 7.53Z" />
            </svg>
            {t("mkt.madeInCanada")}
          </span>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="flex min-h-dvh flex-col">
        <MarketingNav />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </I18nProvider>
  );
}
