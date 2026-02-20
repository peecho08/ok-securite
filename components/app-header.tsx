"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";

interface AppHeaderProps {
  workerName: string;
  onEditFavorites: () => void;
  onRestartOnboarding: () => void;
}

export function AppHeader({ workerName, onEditFavorites, onRestartOnboarding }: AppHeaderProps) {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="safe-area-green-cover" />
      <header className="bg-[#118914] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex shrink-0 cursor-pointer transition-opacity hover:opacity-80"
            aria-label={t("nav.refresh")}
          >
            <Image
              src="/logo.svg"
              alt="OK Chantier"
              width={188}
              height={48}
              className="h-[50px] w-auto brightness-0 invert sm:h-10"
              priority
            />
          </button>

          <div className="relative flex shrink-0 items-center gap-4 sm:gap-3">
            <a
              href="https://www.cnesst.gouv.qc.ca/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-end gap-1 transition-opacity hover:opacity-80"
            >
              <span className="text-xs text-white/80 underline decoration-white/40 underline-offset-2">
                {t("nav.poweredBy")}
              </span>
              <Image
                src="/cnesst-logo.svg"
                alt="CNESST"
                width={80}
                height={30}
                className="h-[19px] w-auto brightness-0 invert"
              />
            </a>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors active:bg-white/40 sm:h-9 sm:w-9"
              aria-label={t("nav.menu")}
            >
              <svg className="h-6 w-6 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40 bg-black/30 sm:bg-transparent" onClick={() => setShowMenu(false)} aria-hidden />
                <div
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-neutral-700 dark:bg-neutral-800 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-56 sm:rounded-xl sm:rounded-t-none sm:border sm:border-t-0 sm:shadow-xl"
                  onTouchStart={(e) => {
                    (e.currentTarget as HTMLElement).dataset.touchY = String(e.touches[0].clientY);
                  }}
                  onTouchEnd={(e) => {
                    const startY = Number((e.currentTarget as HTMLElement).dataset.touchY ?? 0);
                    const dy = e.changedTouches[0].clientY - startY;
                    if (dy > 60) setShowMenu(false);
                  }}
                >
                  <div className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-gray-200 sm:hidden" aria-hidden />
                  {workerName && (
                    <div className="border-b border-gray-100 px-5 py-4 dark:border-neutral-700 sm:px-4 sm:py-3">
                      <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100 sm:text-sm">{workerName}</p>
                      <p className="text-sm text-gray-400 sm:text-xs">{t("menu.worker")}</p>
                    </div>
                  )}
                  <div className="py-2 pb-[env(safe-area-inset-bottom)] sm:py-1 sm:pb-0">
                    <Link
                      href="/history"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("menu.history")}
                    </Link>
                    <Link
                      href="/bien-etre"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t("menu.wellbeing")}
                    </Link>
                    <button
                      onClick={() => { setShowMenu(false); onEditFavorites(); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.911c.969 0 1.372 1.24.588 1.81l-3.974 2.888 1.518 4.674c.3.921-.755 1.688-1.539 1.118L12 15.203l-3.974 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674-3.974-2.888c-.783-.57-.38-1.81.588-1.81h4.911l1.518-4.674z" />
                      </svg>
                      {t("menu.editFavorites")}
                    </button>
                    <button
                      onClick={() => { setLocale(locale === "fr" ? "en" : "fr"); setShowMenu(false); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      {t("menu.language")}
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onRestartOnboarding(); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {t("menu.restartOnboarding")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
