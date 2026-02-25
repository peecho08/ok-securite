"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { getTeamName, getInviteToken, getWorkerName, setActiveRole, getHistory, resetAllForFreshStart, type HistoryEntry } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { Copy, Check, Users, ClipboardList, RotateCcw, ExternalLink, Mail, MessageSquare } from "lucide-react";

export function SupervisorHome() {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggle: toggleTheme, acqColors } = useTheme();
  const [teamName, setTeamName] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [workerName, setWorkerNameState] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setTeamName(getTeamName() || t("supervisor.defaultTeamName"));
    const token = getInviteToken();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setInviteUrl(token ? `${origin}/join/${token}` : `${origin}/join/demo-invite-abc123`);
    setHistory(getHistory().slice(0, 15));
    setWorkerNameState(getWorkerName());
  }, [t]);

  function handleCopy() {
    const url = inviteUrl || (typeof window !== "undefined" ? `${window.location.origin}/join/demo-invite-abc123` : "");
    if (!url) return;
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function switchToWorker() {
    setActiveRole("worker");
    window.location.href = "/";
  }

  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";

  const uniqueWorkers = new Set(history.map((e) => e.workerName));
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = history.filter((e) => new Date(e.completedAt) >= todayStart).length;

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      {/* Header */}
      <div className="safe-area-green-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="OK Chantier"
            width={140}
            height={36}
            className="acq-logo h-8 w-auto brightness-0 invert"
            priority
          />
          <button
              type="button"
              onClick={() => setShowMenu((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors active:bg-white/40"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white">{teamName || t("supervisor.myTeam")}</h1>
        {workerName && <p className="mt-0.5 text-sm text-white/70">{workerName} · {t("menu.supervisor")}</p>}
        {!workerName && <p className="mt-0.5 text-sm text-white/70">{t("menu.supervisor")}</p>}
      </header>

      {/* Profile menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setShowMenu(false)} aria-hidden />
          <div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-neutral-700 dark:bg-neutral-800"
            onTouchStart={(e) => { (e.currentTarget as HTMLElement).dataset.touchY = String(e.touches[0].clientY); }}
            onTouchEnd={(e) => { const dy = e.changedTouches[0].clientY - Number((e.currentTarget as HTMLElement).dataset.touchY ?? 0); if (dy > 60) setShowMenu(false); }}
          >
            <div className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-gray-200" aria-hidden />
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
              <div className="min-w-0">
                <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100">{workerName || t("menu.supervisor")}</p>
                <p className="text-sm text-gray-400">{t("menu.supervisor")}</p>
              </div>
              <button
                type="button"
                onClick={() => { switchToWorker(); setShowMenu(false); }}
                className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                {t("menu.switchToWorker")}
              </button>
            </div>
            <div className="py-2 pb-[env(safe-area-inset-bottom)]">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  const url = typeof window !== "undefined" ? `${window.location.origin}/acq-programme-prevention.pdf` : "/acq-programme-prevention.pdf";
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
                className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <span className="flex items-center gap-4">
                  <ClipboardList className="h-5 w-5 shrink-0 text-gray-400" />
                  {t("menu.preventionProgram")}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
              </button>
              <button
                onClick={() => { resetAllForFreshStart(); setShowMenu(false); window.location.href = "/"; }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <RotateCcw className="h-5 w-5 shrink-0 text-gray-400" />
                {t("menu.freshStart")}
              </button>
              <button
                onClick={() => { toggleTheme(); setShowMenu(false); }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                {theme === "dark" ? (
                  <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
                {t("menu.theme")}
              </button>
              <button
                onClick={() => { setLocale(locale === "fr" ? "en" : "fr"); setShowMenu(false); }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                {t("menu.language")}
              </button>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 px-5 py-5 sm:px-8">
        {/* Invite link — quick copy + share */}
        <section className="mb-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2 p-2.5 pl-3">
              <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-neutral-300">{inviteUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t("createTeam.copied") : t("createTeam.copy")}
              </button>
            </div>
            <div className="flex border-t border-gray-100 dark:border-neutral-700">
              <a
                href={`sms:?&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
              >
                <MessageSquare className="h-4 w-4 text-gray-400" />
                {t("supervisor.shareText")}
              </a>
              <div className="w-px bg-gray-100 dark:bg-neutral-700" />
              <a
                href={`mailto:?subject=${encodeURIComponent(t("supervisor.inviteEmailSubject"))}&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
              >
                <Mail className="h-4 w-4 text-gray-400" />
                {t("supervisor.shareEmail")}
              </a>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <p className="font-heading text-2xl font-bold text-green-700 dark:text-green-400">{history.length}</p>
            <p className="mt-0.5 text-xs text-green-600/80 dark:text-green-400/70">{t("dashboard.completedTotal")}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <p className="font-heading text-2xl font-bold text-gray-900 dark:text-neutral-100">{todayCount}</p>
            <p className="mt-0.5 text-xs text-gray-500">{t("supervisor.today")}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <p className="font-heading text-2xl font-bold text-gray-900 dark:text-neutral-100">{uniqueWorkers.size}</p>
            <p className="mt-0.5 text-xs text-gray-500">{t("supervisor.workers")}</p>
          </div>
        </div>

        {/* Recent completions */}
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            <ClipboardList className="h-3.5 w-3.5" />
            {t("dashboard.recentActivity")}
          </h2>
          {history.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-gray-400">{t("supervisor.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <div
                  key={`${entry.taskId}-${entry.completedAt}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                    <TaskIcon taskId={entry.taskId} className="h-5 w-5" fallback={entry.taskIcon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-semibold leading-tight">{entry.taskTitle}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {new Date(entry.completedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {entry.workerName ? ` — ${entry.workerName}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-green-100 px-2 py-0.5 font-heading text-[10px] font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
                    ✓ {entry.checkedCount}/{entry.totalCount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/create-team"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("supervisor.manageTeam")}</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <ClipboardList className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("menu.dashboard")}</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
