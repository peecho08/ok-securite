"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { getActiveRole, setActiveRole, getWorkerOrgId, setWorkerOrgId, getTeamName } from "@/lib/storage";
import { isSoundEnabled, setSoundEnabled } from "@/lib/sounds";
import { useClerk } from "@clerk/nextjs";
import { ClipboardList, ExternalLink, LogOut, UserPlus, Volume2, VolumeX } from "lucide-react";
import { MusicPlayer } from "@/components/music-player";

interface AppHeaderProps {
  workerName: string;
}

export function AppHeader({ workerName }: AppHeaderProps) {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [hasTeam, setHasTeam] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setHasTeam(!!getWorkerOrgId());
    setSoundOn(isSoundEnabled());
  }, [showMenu]);

  useEffect(() => {
    if (getActiveRole() !== "worker") return;
    if (!getWorkerOrgId()) { setHasTeam(false); return; }
    fetch("/api/profile/team-check")
      .then((r) => r.json())
      .then((data) => {
        if (!data.inTeam) {
          setWorkerOrgId(null);
          setHasTeam(false);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowJoinForm(false);
      setJoinLink("");
      setJoinError("");
      setJoinSuccess(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMenu]);

  async function handleJoinTeam() {
    const token = joinLink.trim().replace(/.*\/(?:app\/)?join\/?/i, "").trim();
    if (!token) {
      setJoinError(t("joinTeam.invalidLink"));
      return;
    }
    setJoinError("");
    setJoinLoading(true);
    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json();
        setJoinError(data.error === "team_full" ? t("upgrade.teamFull") : (data.error || t("joinTeam.invalidLink")));
        return;
      }
      const { org } = await res.json();
      setWorkerOrgId(org.id);
      setJoinSuccess(true);
      setHasTeam(true);
      setTimeout(() => {
        setShowMenu(false);
        window.location.reload();
      }, 1200);
    } catch {
      setJoinError(t("joinTeam.invalidLink"));
    } finally {
      setJoinLoading(false);
    }
  }

  return (
    <>
      <div className="safe-area-header-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/app")}
            className="flex shrink-0 cursor-pointer transition-opacity hover:opacity-80"
            aria-label={t("nav.refresh")}
          >
            <Image
              src="/ok-securite.svg"
              alt="OK Sécurité"
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
                <div className="fixed inset-0 z-40 animate-fade-in bg-black/30" onClick={() => setShowMenu(false)} aria-hidden="true" />
                <div
                  role="dialog"
                  aria-label={t("a11y.navigationMenu")}
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] animate-sheet-up overflow-y-auto rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-neutral-700 dark:bg-neutral-800"
                  onKeyDown={(e) => { if (e.key === "Escape") setShowMenu(false); }}
                  onTouchStart={(e) => {
                    (e.currentTarget as HTMLElement).dataset.touchY = String(e.touches[0].clientY);
                  }}
                  onTouchEnd={(e) => {
                    const startY = Number((e.currentTarget as HTMLElement).dataset.touchY ?? 0);
                    const dy = e.changedTouches[0].clientY - startY;
                    if (dy > 60) setShowMenu(false);
                  }}
                >
                  <div className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-gray-200" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
                    <div className="min-w-0">
                      <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100">{workerName || (getActiveRole() === "supervisor" ? t("menu.supervisor") : t("menu.worker"))}</p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">{getActiveRole() === "supervisor" ? t("menu.supervisor") : (getTeamName() || t("menu.worker"))}</p>
                    </div>
                    {getActiveRole() === "supervisor" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveRole("worker");
                          fetch("/api/profile/role", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ role: "worker" }),
                          });
                          setShowMenu(false);
                          window.location.href = "/app";
                        }}
                        className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                      >
                        {t("menu.switchToWorker")}
                      </button>
                    )}
                  </div>
                  {getActiveRole() === "worker" && !hasTeam && (
                    <div className="border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
                      {joinSuccess ? (
                        <p className="text-center text-sm font-medium text-green-600 dark:text-green-400">
                          {t("menu.joinTeamSuccess")}
                        </p>
                      ) : showJoinForm ? (
                        <div>
                          <p className="mb-2 text-xs text-gray-500 dark:text-neutral-400">{t("menu.joinTeamHint")}</p>
                          <input
                            type="text"
                            value={joinLink}
                            onChange={(e) => { setJoinLink(e.target.value); setJoinError(""); }}
                            placeholder={t("joinTeam.pastePlaceholder")}
                            autoFocus
                            className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:bg-white dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-600 ${joinError ? "border-red-400" : "border-gray-200 focus:border-gray-400 dark:border-neutral-600"}`}
                          />
                          {joinError && <p className="mt-1.5 text-xs text-red-500">{joinError}</p>}
                          <button
                            type="button"
                            onClick={handleJoinTeam}
                            disabled={joinLoading}
                            className="mt-2.5 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
                          >
                            {joinLoading ? t("joinTeam.joining") : t("joinTeam.join")}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowJoinForm(true)}
                          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-left transition-colors active:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-700/50 dark:active:bg-neutral-700"
                        >
                          <UserPlus className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{t("menu.joinTeam")}</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">{t("menu.joinTeamHint")}</p>
                          </div>
                        </button>
                      )}
                    </div>
                  )}
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
                      href="/app/history"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("menu.history")}
                    </Link>
                    <Link
                      href="/app/bien-etre"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t("menu.wellbeing")}
                    </Link>
                    <Link
                      href="/app/dashboard"
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
                      onClick={() => { const next = !soundOn; setSoundEnabled(next); setSoundOn(next); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      {soundOn
                        ? <Volume2 className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" />
                        : <VolumeX className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" />
                      }
                      {t("menu.sounds")}
                      <span className={`ml-auto text-xs font-medium ${soundOn ? "text-primary" : "text-gray-400 dark:text-neutral-500"}`}>
                        {soundOn ? "ON" : "OFF"}
                      </span>
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
                    <Link
                      href="/app/account"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t("account.title")}
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        signOut({ redirectUrl: "/sign-in" });
                      }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-red-600 transition-colors active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/30 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-red-50 dark:sm:hover:bg-red-950/20"
                    >
                      <LogOut className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                      {t("auth.signOut")}
                    </button>
                    <div className="mx-4 mt-2 mb-3">
                      <MusicPlayer />
                    </div>
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
