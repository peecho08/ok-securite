"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { getReportCount, getActiveRole, setActiveRole, getSupervisorOrgId } from "@/lib/storage";
import { ClipboardList, ExternalLink } from "lucide-react";

interface AppHeaderProps {
  workerName: string;
  onFreshStart: () => void;
}

export function AppHeader({ workerName, onFreshStart }: AppHeaderProps) {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    setReportCount(getReportCount());
  }, [showMenu]);

  return (
    <>
      <div className="safe-area-header-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex shrink-0 cursor-pointer transition-opacity hover:opacity-80"
            aria-label={t("nav.refresh")}
          >
            <Image
              src="/ok-yellow-white.svg"
              alt="OK Chantier"
              width={188}
              height={48}
              className="h-[40px] w-auto sm:h-8"
              priority
            />
          </button>

          <div className="relative flex shrink-0 items-center gap-4 sm:gap-3">
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
                <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setShowMenu(false)} aria-hidden />
                <div
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-neutral-700 dark:bg-neutral-800"
                  onTouchStart={(e) => {
                    (e.currentTarget as HTMLElement).dataset.touchY = String(e.touches[0].clientY);
                  }}
                  onTouchEnd={(e) => {
                    const startY = Number((e.currentTarget as HTMLElement).dataset.touchY ?? 0);
                    const dy = e.changedTouches[0].clientY - startY;
                    if (dy > 60) setShowMenu(false);
                  }}
                >
                  <div className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-gray-200" aria-hidden />
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
                    <div className="min-w-0">
                      <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100">{workerName || (getActiveRole() === "supervisor" ? t("menu.supervisor") : t("menu.worker"))}</p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">{getActiveRole() === "supervisor" ? t("menu.supervisor") : t("menu.worker")}</p>
                    </div>
                    {getActiveRole() === "supervisor" ? (
                      <button
                        type="button"
                        onClick={() => { setActiveRole("worker"); setShowMenu(false); router.push("/"); }}
                        className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      >
                        {t("menu.switchToWorker")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setActiveRole("supervisor"); setShowMenu(false); window.location.href = "/"; }}
                        className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      >
                        {t("menu.switchToSupervisor")}
                      </button>
                    )}
                  </div>
                  <a
                    href="https://www.acq.org/formations/repertoire-des-cours/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="mx-4 mt-3 mb-2 flex items-center gap-3 rounded-xl bg-amber-50 p-4 transition-colors active:bg-amber-100 dark:bg-amber-950/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-sm font-bold text-amber-900 dark:text-amber-200">{t("menu.acqFormations")}</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">{t("menu.acqFormationsDesc")}</p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <div className="py-2 pb-[env(safe-area-inset-bottom)] sm:py-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        const url = typeof window !== "undefined" ? `${window.location.origin}/acq-programme-prevention.pdf` : "/acq-programme-prevention.pdf";
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <span className="flex items-center gap-4 sm:gap-3">
                        <ClipboardList className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" />
                        {t("menu.preventionProgram")}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-3.5 sm:w-3.5" />
                    </button>
                    <Link
                      href="/history"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("menu.history")}
                    </Link>
                    <Link
                      href="/bien-etre"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t("menu.wellbeing")}
                    </Link>
                    <Link
                      href="/report/coffrage"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <span className="relative">
                        <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {reportCount > 0 && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {reportCount > 9 ? "9+" : reportCount}
                          </span>
                        )}
                      </span>
                      {t("menu.report")}
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {t("menu.dashboard")}
                    </Link>
                    <button
                      onClick={() => { toggleTheme(); setShowMenu(false); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      {theme === "dark" ? (
                        <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                      {t("menu.theme")}
                    </button>
                    <button
                      onClick={() => { setLocale(locale === "fr" ? "en" : "fr"); setShowMenu(false); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      {t("menu.language")}
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onFreshStart(); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {t("menu.freshStart")}
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
