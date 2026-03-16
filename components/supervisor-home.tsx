"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { useClerk } from "@clerk/nextjs";
import { getTeamName, getInviteToken, getWorkerName, setWorkerName, getHistory, getCustomTasks, getSupervisorEmail, setSupervisorEmail, type HistoryEntry } from "@/lib/storage";

import type { Task } from "@/types";
import { TaskIcon } from "@/components/task-icon";
import { Copy, Check, Users, ClipboardList, ExternalLink, Mail, MessageSquare, MapPin, ListChecks, PenLine, LogOut, FileText, ImageIcon, QrCode, ChevronDown, ArrowUpCircle, Download } from "lucide-react";
import { WeeklyRecap } from "@/components/weekly-recap";
import { getDailyFact } from "@/lib/safety-facts";
import { trackEvent } from "@/lib/analytics";
import { InviteQRCode } from "@/components/invite-qr-code";
import { usePlan, invalidatePlanCache } from "@/lib/hooks/use-plan";
import { MusicPlayer } from "@/components/music-player";

export function SupervisorHome() {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();
  const { signOut } = useClerk();
  const [teamName, setTeamName] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [workerName, setWorkerNameState] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [sites, setSites] = useState<{ id: string; name: string; address?: string | null; active: boolean }[]>([]);
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const { plan, loading: planLoading } = usePlan();
  const searchParams = useSearchParams();
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      invalidatePlanCache();
      setShowUpgradeSuccess(true);
      window.history.replaceState({}, "", "/app");
    }
  }, [searchParams]);

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMenu]);

  useEffect(() => {
    setTeamName(getTeamName() || t("supervisor.defaultTeamName"));
    const token = getInviteToken();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setInviteUrl(token ? `${origin}/app/join/${token}` : "");
    setWorkerNameState(getWorkerName());
    fetch("/api/teams/sites")
      .then((r) => r.json())
      .then((data) => setSites(data.sites ?? []))
      .catch(() => {});
    setCustomTasks(getCustomTasks());

    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.recentActivity?.length) {
          setHistory(data.recentActivity.map((e: Record<string, unknown>) => ({
            id: e.id as string,
            taskId: e.taskId as string,
            taskTitle: e.taskTitle as string,
            taskIcon: e.taskIcon as string,
            workerName: e.workerName as string,
            checkedCount: e.checkedCount as number,
            totalCount: e.totalCount as number,
            completedAt: e.completedAt as string,
            siteName: e.siteName as string | undefined,
            notes: (e.notes as string) || undefined,
            imageUrl: (e.imageUrl as string) || undefined,
            pdfUrl: (e.pdfUrl as string) || undefined,
          })));
        } else {
          setHistory(getHistory());
        }
      })
      .catch(() => {
        setHistory(getHistory());
      })
      .finally(() => setLoadingActivity(false));
  }, [t]);

  function handleCopy() {
    if (!inviteUrl) return;
    void navigator.clipboard.writeText(inviteUrl);
    trackEvent("invite_link_copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";

  const uniqueWorkers = new Set(history.map((e) => e.workerName));
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = history.filter((e) => new Date(e.completedAt) >= todayStart).length;

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      {/* Header */}
      <div className="safe-area-header-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Image
            src="/ok-securite.svg"
            alt="OK Sécurité"
            width={140}
            height={36}
            className="h-8 w-auto"
            priority
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMenu((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors active:bg-white/40"
              aria-label={t("nav.menu")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white">{teamName || t("supervisor.myTeam")}</h1>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-sm text-white/70">
            {workerName ? `${workerName} · ${t("menu.supervisor")}` : t("menu.supervisor")}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditName(workerName);
              setEditEmail(getSupervisorEmail());
              setShowEditProfile(true);
            }}
            className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/25 active:bg-white/30"
          >
            <PenLine className="h-3 w-3" />
            {t("menu.editProfile")}
          </button>
          {!planLoading && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              plan === "gold" ? "bg-amber-400/30 text-amber-100" :
              plan === "silver" ? "bg-blue-400/30 text-blue-100" :
              "bg-white/15 text-white/70"
            }`}>
              {plan === "gold" ? t("upgrade.badge.gold") : plan === "silver" ? t("upgrade.badge.silver") : t("upgrade.badge.free")}
            </span>
          )}
        </div>
      </header>

      {/* Profile menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40 animate-fade-in bg-black/30" onClick={() => setShowMenu(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-label={t("a11y.navigationMenu")}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] animate-sheet-up overflow-y-auto rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-neutral-700 dark:bg-neutral-800"
            onKeyDown={(e) => { if (e.key === "Escape") setShowMenu(false); }}
            onTouchStart={(e) => { (e.currentTarget as HTMLElement).dataset.touchY = String(e.touches[0].clientY); }}
            onTouchEnd={(e) => { const dy = e.changedTouches[0].clientY - Number((e.currentTarget as HTMLElement).dataset.touchY ?? 0); if (dy > 60) setShowMenu(false); }}
          >
            <div className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-gray-200" aria-hidden="true" />
            <div className="border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
              <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100">{workerName || t("menu.supervisor")}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 dark:text-neutral-400">{t("menu.supervisor")}</p>
                {!planLoading && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    plan === "gold" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                    plan === "silver" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                    "bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400"
                  }`}>
                    {plan === "gold" ? t("upgrade.badge.gold") : plan === "silver" ? t("upgrade.badge.silver") : t("upgrade.badge.free")}
                  </span>
                )}
              </div>
            </div>
            <div className="py-2 pb-[env(safe-area-inset-bottom)]">
              {!planLoading && plan !== "gold" && (
                <Link
                  href="/plans"
                  onClick={() => setShowMenu(false)}
                  className="mx-3 mb-2 flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 transition-colors active:from-amber-100 active:to-orange-100 dark:border-amber-700/40 dark:from-amber-950/40 dark:to-orange-950/40 dark:active:from-amber-950/60 dark:active:to-orange-950/60"
                >
                  <ArrowUpCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{t("menu.upgrade")}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400/80">{t("menu.upgradeSub")}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-200/80 px-2 py-0.5 text-[11px] font-bold uppercase text-amber-800 dark:bg-amber-800/40 dark:text-amber-300">
                    {plan === "free" ? t("upgrade.badge.free") : t("upgrade.badge.silver")}
                  </span>
                </Link>
              )}
              <Link
                href="/app/my-team"
                onClick={() => setShowMenu(false)}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <Users className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
                {t("team.title")}
              </Link>
              <Link
                href="/app/create-team?edit-tasks"
                onClick={() => setShowMenu(false)}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <ListChecks className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
                {t("menu.manageTasks")}
              </Link>
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
                  <ClipboardList className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
                  {t("menu.preventionProgram")}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-500 dark:text-neutral-400" />
              </button>
              <a
                href="https://www.acq.org/formations/repertoire-des-cours/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMenu(false)}
                className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <span className="flex items-center gap-4">
                  <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t("menu.acqFormations")}
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-500 dark:text-neutral-400" />
              </a>
              <button
                onClick={() => { toggleTheme(); setShowMenu(false); }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                {theme === "dark" ? (
                  <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
                {t("menu.theme")}
              </button>
              <button
                onClick={() => { setLocale(locale === "fr" ? "en" : "fr"); setShowMenu(false); }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <svg className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                {t("menu.language")}
              </button>
              <button
                onClick={() => { setShowMenu(false); signOut({ redirectUrl: "/sign-in" }); }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-red-600 transition-colors active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {t("auth.signOut")}
              </button>
              <div className="mx-4 mt-2 mb-3">
                <MusicPlayer />
              </div>
            </div>
          </div>
        </>
      )}

      {showEditProfile && (
        <>
          <div className="fixed inset-0 z-40 animate-fade-in bg-black/30" onClick={() => setShowEditProfile(false)} aria-hidden="true" />
          <div className="fixed inset-x-0 bottom-0 z-50 animate-sheet-up rounded-t-2xl border-t border-gray-200 bg-white p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:border-neutral-700 dark:bg-neutral-800 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-gray-200" aria-hidden="true" />
            <h2 className="mb-4 font-heading text-lg font-bold text-gray-900 dark:text-neutral-100">{t("menu.editProfile")}</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">{t("createTeam.yourName")}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">{t("createTeam.yourEmail")}</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (editName.trim()) {
                  setWorkerName(editName.trim());
                  setWorkerNameState(editName.trim());
                }
                if (editEmail.trim()) setSupervisorEmail(editEmail.trim());
                setShowEditProfile(false);
              }}
              className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              {t("createTeam.done")}
            </button>
          </div>
        </>
      )}

      <main className="flex-1 px-5 py-5 sm:px-8">
        {showUpgradeSuccess && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
            <span>{t("plans.success")}</span>
            <button type="button" onClick={() => setShowUpgradeSuccess(false)} className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-green-100 dark:hover:bg-green-900/50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Quick links */}
        <section className="mb-5 grid grid-cols-2 gap-3">
          <Link
            href="/app/my-team"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:border-gray-300 active:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <Users className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("supervisor.manageTeam")}</span>
          </Link>
          <Link
            href="/app/dashboard"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:border-gray-300 active:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <ClipboardList className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("menu.dashboard")}</span>
          </Link>
          <Link
            href="/app/my-sites"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:border-gray-300 active:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <MapPin className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
              {t("site.title")}
              {sites.length > 0 && <span className="ml-1 text-xs font-normal text-gray-400 dark:text-neutral-500">({sites.length})</span>}
            </span>
          </Link>
          <Link
            href="/app/my-checklists"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:border-gray-300 active:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <PenLine className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
              {t("supervisor.myChecklists")}
              {customTasks.length > 0 && <span className="ml-1 text-xs font-normal text-gray-400 dark:text-neutral-500">({customTasks.length})</span>}
            </span>
          </Link>
        </section>

        {/* Invite link — quick copy + share */}
        <section className="mb-5">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            {t("supervisor.inviteTitle")}
          </h2>
          {inviteUrl ? (
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
                  <MessageSquare className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                  {t("supervisor.shareText")}
                </a>
                <div className="w-px bg-gray-100 dark:bg-neutral-700" />
                <a
                  href={`mailto:?subject=${encodeURIComponent(t("supervisor.inviteEmailSubject"))}&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
                >
                  <Mail className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                  {t("supervisor.shareEmail")}
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-neutral-600 dark:bg-neutral-800">
              <p className="text-sm text-gray-500 dark:text-neutral-400">{t("supervisor.noInviteYet")}</p>
              <Link
                href="/app/create-team"
                className="mt-3 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                {t("supervisor.generateInvite")}
              </Link>
            </div>
          )}
          {inviteUrl && (
            <>
              <button
                type="button"
                onClick={() => setShowQR((v) => !v)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
              >
                <QrCode className="h-4 w-4" />
                {showQR ? t("qr.hideCode") : t("qr.showCode")}
                <ChevronDown className={`h-4 w-4 transition-transform ${showQR ? "rotate-180" : ""}`} />
              </button>
              {showQR && <InviteQRCode url={inviteUrl} teamName={teamName} />}
            </>
          )}
        </section>

        {/* Weekly recap */}
        <WeeklyRecap
          mode="supervisor"
          serverHistory={history.map((e) => ({
            completedAt: e.completedAt,
            checkedCount: e.checkedCount,
            workerName: e.workerName,
          }))}
        />

        {/* Safety fact of the day */}
        {(() => {
          const fact = getDailyFact();
          return (
            <section className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                {t("safetyFact.title")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-neutral-200">
                {locale === "en" ? fact.en : fact.fr}
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                {t("safetyFact.source")} : {fact.source}
              </p>
            </section>
          );
        })()}

        {/* Recent completions */}
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <ClipboardList className="h-3.5 w-3.5" />
            {t("dashboard.recentActivity")}
          </h2>
          {loadingActivity ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-700" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-3/5 animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
                    <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100 dark:bg-neutral-700/60" />
                  </div>
                  <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-gray-100 dark:bg-neutral-700/60" />
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-gray-500 dark:text-neutral-400">{t("supervisor.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <div
                  key={`${entry.taskId}-${entry.completedAt}-${i}`}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <Link
                    href={entry.id ? `/app/history/${entry.id}` : "/app/history"}
                    className="flex items-center gap-3 px-3.5 py-3 transition-colors active:bg-gray-50 dark:active:bg-neutral-700"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                      <TaskIcon taskId={entry.taskId} className="h-4 w-4" fallback={entry.taskIcon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-semibold leading-tight">{entry.taskTitle}</p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-neutral-400">
                        {entry.workerName || t("menu.supervisor")}
                        <span className="text-gray-400 dark:text-neutral-500">·</span>
                        {new Date(entry.completedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short" })}
                        {(entry.notes || entry.imageUrl) && (
                          <>
                            <span className="text-gray-400 dark:text-neutral-500">·</span>
                            {entry.notes && <FileText className="inline h-3 w-3 text-gray-400 dark:text-neutral-500" />}
                            {entry.imageUrl && <ImageIcon className="inline h-3 w-3 text-gray-400 dark:text-neutral-500" />}
                          </>
                        )}
                      </p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {entry.pdfUrl && (
                    <a
                      href={entry.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border-t border-gray-100 px-3.5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 active:bg-primary/10 dark:border-neutral-700 dark:text-primary"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t("history.detail.downloadPdf")}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
