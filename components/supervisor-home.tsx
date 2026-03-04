"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { getTeamName, getInviteToken, getWorkerName, setActiveRole, clearWorkerOnboardingDone, getHistory, resetAllForFreshStart, isDemoSeeded, seedDemoData, getSites, addSite, removeSite, type HistoryEntry, type ConstructionSite } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { PlaceAutocomplete } from "@/components/address-autocomplete";
import { Copy, Check, Users, ClipboardList, RotateCcw, ExternalLink, Mail, MessageSquare, MapPin, Plus, Trash2, ListChecks } from "lucide-react";

export function SupervisorHome() {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();
  const [teamName, setTeamName] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [workerName, setWorkerNameState] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [sites, setSites] = useState<ConstructionSite[]>([]);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAddress, setNewSiteAddress] = useState("");
  const [newSiteLat, setNewSiteLat] = useState<number | undefined>();
  const [newSiteLng, setNewSiteLng] = useState<number | undefined>();
  const [showAddSite, setShowAddSite] = useState(false);

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMenu]);

  useEffect(() => {
    if (!isDemoSeeded()) seedDemoData();
    setTeamName(getTeamName() || t("supervisor.defaultTeamName"));
    const token = getInviteToken();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setInviteUrl(token ? `${origin}/join/${token}` : `${origin}/join/demo-invite-abc123`);
    setHistory(getHistory());
    setWorkerNameState(getWorkerName());
    setSites(getSites());
  }, [t]);

  function handleAddSite() {
    const name = newSiteName.trim();
    if (!name) return;
    const site: ConstructionSite = {
      id: Math.random().toString(36).slice(2, 12),
      name,
      address: newSiteAddress.trim() || undefined,
      lat: newSiteLat,
      lng: newSiteLng,
      active: true,
      createdAt: new Date().toISOString(),
    };
    addSite(site);
    setSites(getSites());
    setNewSiteName("");
    setNewSiteAddress("");
    setNewSiteLat(undefined);
    setNewSiteLng(undefined);
    setShowAddSite(false);
  }

  function handleRemoveSite(id: string) {
    removeSite(id);
    setSites(getSites());
  }


  function handleCopy() {
    const url = inviteUrl || (typeof window !== "undefined" ? `${window.location.origin}/join/demo-invite-abc123` : "");
    if (!url) return;
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function switchToWorker() {
    setActiveRole("worker");
    clearWorkerOnboardingDone();
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
      <div className="safe-area-header-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Image
            src="/ok-yellow-white.svg"
            alt="OK Chantier"
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
        {workerName && <p className="mt-0.5 text-sm text-white/70">{workerName} · {t("menu.supervisor")}</p>}
        {!workerName && <p className="mt-0.5 text-sm text-white/70">{t("menu.supervisor")}</p>}
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
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
              <div className="min-w-0">
                <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100">{workerName || t("menu.supervisor")}</p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">{t("menu.supervisor")}</p>
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
              <Link
                href="/my-team"
                onClick={() => setShowMenu(false)}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <Users className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
                {t("team.title")}
              </Link>
              <Link
                href="/create-team?edit-tasks"
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
                onClick={() => { resetAllForFreshStart(); setShowMenu(false); window.location.href = "/"; }}
                className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-500 transition-colors active:bg-gray-100 dark:text-neutral-400 dark:active:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <RotateCcw className="h-5 w-5 shrink-0" />
                {t("menu.freshStart")}
              </button>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 px-5 py-5 sm:px-8">
        {/* Quick links */}
        <section className="mb-5 grid grid-cols-2 gap-3">
          <Link
            href="/my-team"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <Users className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("supervisor.manageTeam")}</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <ClipboardList className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("menu.dashboard")}</span>
          </Link>
        </section>

        {/* Invite link — quick copy + share */}
        <section className="mb-5">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            {t("supervisor.inviteTitle")}
          </h2>
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
        </section>

        {/* ACQ Formations banner */}
        <a
          href="https://www.acq.org/formations/repertoire-des-cours/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 flex items-center gap-3 rounded-xl bg-amber-50 p-4 transition-colors active:bg-amber-100 dark:bg-amber-950/40"
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

        {/* Construction sites */}
        <section className="mb-5">
          
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <MapPin className="h-3.5 w-3.5" />
            {t("site.title")}
          </h2>
          {showAddSite && (
            <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
              <PlaceAutocomplete
                value={newSiteName}
                onChange={setNewSiteName}
                onPlaceSelected={({ name, address, lat, lng }) => {
                  setNewSiteName(name);
                  setNewSiteAddress(address);
                  setNewSiteLat(lat);
                  setNewSiteLng(lng);
                }}
                placeholder={t("site.namePlaceholder")}
                autoFocus
                className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-600"
                onKeyDown={(e) => { if (e.key === "Enter" && newSiteName.trim()) handleAddSite(); }}
              />
              <input
                type="text"
                value={newSiteAddress}
                onChange={(e) => setNewSiteAddress(e.target.value)}
                placeholder={t("site.addressPlaceholder")}
                className="mb-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-600"
                onKeyDown={(e) => { if (e.key === "Enter" && newSiteName.trim()) handleAddSite(); }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddSite(false); setNewSiteName(""); setNewSiteAddress(""); }}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {t("nav.back")}
                </button>
                <button
                  type="button"
                  onClick={handleAddSite}
                  disabled={!newSiteName.trim()}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {t("site.add")}
                </button>
              </div>
            </div>
          )}
          {sites.length > 0 && (
            <div className="space-y-2">
              {sites.map((site) => {
                const active = site.active !== false;
                return (
                  <div
                    key={site.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <Link
                      href={`/sites/${site.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-sm font-semibold leading-tight">{site.name}</p>
                        {site.address && <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">{site.address}</p>}
                      </div>
                    </Link>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" : "bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"}`}>
                      {active ? t("siteDetail.active") : t("siteDetail.inactive")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSite(site.id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                      aria-label={t("site.remove")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          {!showAddSite && (
            <button
              type="button"
              onClick={() => setShowAddSite(true)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300 ${sites.length > 0 ? "mt-2" : ""}`}
            >
              <Plus className="h-4 w-4" />
              {t("site.add")}
            </button>
          )}
        </section>

        {/* Recent completions */}
        <section className="mt-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <ClipboardList className="h-3.5 w-3.5" />
            {t("dashboard.recentActivity")}
          </h2>
          {history.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-gray-500 dark:text-neutral-400">{t("supervisor.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <Link
                  key={`${entry.taskId}-${entry.completedAt}-${i}`}
                  href={entry.id ? `/history/${entry.id}` : "/history"}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition-colors active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:active:bg-neutral-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                    <TaskIcon taskId={entry.taskId} className="h-4 w-4" fallback={entry.taskIcon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-sm font-semibold leading-tight">{entry.taskTitle}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">
                      {entry.workerName || t("menu.supervisor")}
                      <span className="mx-1 text-gray-400 dark:text-neutral-500">·</span>
                      {new Date(entry.completedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
