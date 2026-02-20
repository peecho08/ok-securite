"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { categoryLabels, categoryLabelsEn, type TaskCategory } from "@/types";
import { useLocale } from "@/lib/i18n";
import { clearProgress, getActiveTaskProgress, getFavorites, getWorkerName, hasFavorites } from "@/lib/storage";
import { checklists } from "@/data/checklists";
import { TaskIcon } from "@/components/task-icon";
import { Onboarding } from "@/components/onboarding";
import { useTheme } from "@/components/theme-provider";

const categoryOrder: TaskCategory[] = [
  "gros-oeuvre",
  "structure",
  "enveloppe",
  "mecanique",
  "finition",
  "equipement",
  "situation",
];

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function HomePage() {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggle: toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingFavorites, setEditingFavorites] = useState(false);
  const [activeProgress, setActiveProgress] = useState<{ taskId: string; checkedIds: string[] }[]>([]);
  const [showTop, setShowTop] = useState(false);
  const [searchPinned, setSearchPinned] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [workerName, setWorkerNameState] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const localTitle = (task: (typeof tasks)[number]) => (locale === "en" && task.titleEn) ? task.titleEn : task.title;
  const localDesc = (task: (typeof tasks)[number]) => (locale === "en" && task.descriptionEn) ? task.descriptionEn : task.description;
  const localCatLabel = (cat: TaskCategory) => locale === "en" ? categoryLabelsEn[cat] : categoryLabels[cat];

  const placeholderExamples = locale === "en" ? [
    "formwork",
    "working at heights",
    "electrical",
    "scaffolding",
    "concrete pour",
    "plumbing",
    "demolition",
    "painting",
    "welding",
    "roofing",
  ] : [
    "coffrage",
    "travaux en hauteur",
    "électricité",
    "échafaudage",
    "coulage béton",
    "plomberie",
    "démolition",
    "peinture",
    "soudage",
    "toiture",
  ];

  useEffect(() => {
    setPlaceholderIdx(0);
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholderExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [locale]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
    setActiveProgress(getActiveTaskProgress());
    setWorkerNameState(getWorkerName());
    if (!hasFavorites()) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400);
      setSearchPinned(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const favoriteTasks = useMemo(
    () => favoriteIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean),
    [favoriteIds],
  );

  const activeTasks = useMemo(() => {
    return activeProgress
      .map(({ taskId, checkedIds }) => {
        const task = tasks.find((t) => t.id === taskId);
        const cl = checklists[taskId];
        if (!task || !cl) return null;
        const total = cl.phases.flatMap((p) => p.items).length;
        return { task, checked: checkedIds.length, total };
      })
      .filter(Boolean) as { task: (typeof tasks)[number]; checked: number; total: number }[];
  }, [activeProgress]);

  const filtered = useMemo(() => {
    if (!query.trim()) return tasks;
    const q = normalize(query);
    return tasks.filter((task) => {
      const haystack = normalize(
        `${task.title} ${task.titleEn ?? ""} ${task.description} ${task.descriptionEn ?? ""} ${localCatLabel(task.category)} ${(task.keywords ?? []).join(" ")}`
      );
      return haystack.includes(q);
    });
  }, [query, locale]);

  const grouped = useMemo(() => {
    const map = new Map<TaskCategory, typeof tasks>();
    for (const task of filtered) {
      const list = map.get(task.category) ?? [];
      list.push(task);
      map.set(task.category, list);
    }
    return categoryOrder
      .filter((cat) => map.has(cat))
      .map((cat) => ({
        category: cat,
        label: localCatLabel(cat),
        tasks: map.get(cat)!.sort((a, b) => localTitle(a).localeCompare(localTitle(b), locale === "en" ? "en" : "fr")),
      }));
  }, [filtered, locale]);

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 5) return "home.greeting.night";
    if (h < 12) return "home.greeting.morning";
    if (h < 17) return "home.greeting.afternoon";
    return "home.greeting.evening";
  });

  const [quoteKey] = useState(() => {
    const keys = Array.from({ length: 11 }, (_, i) => `quote.${i + 1}`);
    return keys[Math.floor(Math.random() * keys.length)];
  });

  const [footerKey] = useState(() => {
    const keys = ["footer.msg1", "footer.msg2", "footer.msg3"];
    return keys[Math.floor(Math.random() * keys.length)];
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-[#118914] px-5 pt-6 pb-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
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
                      onClick={() => { setShowMenu(false); setEditingFavorites(true); setShowOnboarding(true); }}
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
                    {/* Dark mode toggle — hidden for now
                    <button
                      onClick={() => { toggleTheme(); setShowMenu(false); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 dark:text-neutral-200 dark:active:bg-neutral-700 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50 dark:sm:hover:bg-neutral-700"
                    >
                      {theme === "dark" ? (
                        <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                      {theme === "dark" ? "Mode clair" : "Mode sombre"}
                    </button>
                    */}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setEditingFavorites(false);
                        setShowOnboarding(true);
                      }}
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

      <div className={`sticky top-0 z-10 bg-[#118914] px-5 pb-3 sm:px-8 transition-[padding] duration-200 ${searchPinned ? "pt-3" : "pt-1.5"}`}>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-white/30 bg-white/15 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-white/50 focus:bg-white/20"
          />
          {!query && (
            <div className="pointer-events-none absolute inset-0 flex items-center pl-10 pr-4 text-sm text-white/60">
              <span>{t("home.search.try")}&nbsp;</span>
              <span className="inline-flex h-[1.25em] items-center overflow-hidden">
                <span key={placeholderIdx} className="animate-placeholder-rotate block">
                  « {placeholderExamples[placeholderIdx]} »
                </span>
              </span>
            </div>
          )}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              aria-label={t("home.search.clear")}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 px-5 py-4 dark:bg-neutral-900 sm:px-8">
        {/* Motivational empty state */}
        {!query && activeTasks.length === 0 && (
          <section className="mx-auto mb-6 max-w-xs py-6 text-center">
            {workerName && (
              <p className="mb-3 font-heading text-lg font-semibold text-gray-400">
                {t(greeting)}, {workerName}
              </p>
            )}
            <p className="font-heading text-2xl font-bold text-gray-700 dark:text-neutral-200">
              &laquo;&nbsp;{t(quoteKey)}&nbsp;&raquo;
            </p>
            <p className="mt-1.5 text-sm text-gray-400">
              {t("home.chooseTask")}
            </p>
          </section>
        )}

        {/* Active / ongoing tasks */}
        {!query && activeTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
              {t("home.ongoing")}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-3">
              {activeTasks.map(({ task, checked, total }, i) => (
                <div key={task.id} className="animate-slide-in-up relative" style={{ animationDelay: `${i * 80}ms` }}>
                  <Link
                    href={`/tasks/${task.id}?resume=1`}
                    className="flex aspect-[4/3] flex-col justify-between gap-4 rounded-2xl border-2 border-green-200 bg-green-50 p-5 transition-colors hover:border-green-300 active:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:hover:border-green-700"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm dark:bg-green-900 dark:text-green-300">
                        <TaskIcon taskId={task.id} className="h-6 w-6" />
                      </span>
                    </div>
                    <div className="min-w-0 space-y-4">
                      <p className="font-heading text-base font-bold leading-tight text-green-900 dark:text-green-200">
                        {localTitle(task)}
                      </p>
                      <div className="h-2 overflow-hidden rounded-full bg-green-200">
                        <div
                          className="h-full rounded-full bg-green-600 transition-all"
                          style={{ width: `${(checked / total) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium text-green-700">
                        {checked}/{total} {t("home.verifications")}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      if (!confirm(t("home.abandonConfirm"))) return;
                      clearProgress(task.id);
                      setActiveProgress((prev) => prev.filter((p) => p.taskId !== task.id));
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow-sm transition-colors hover:bg-white hover:text-red-500"
                    aria-label={t("home.abandon")}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Favorites */}
        {!query && favoriteTasks.length > 0 && (
          <section className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                {t("home.favorites")}
              </h2>
              <button
                onClick={() => { setEditingFavorites(true); setShowOnboarding(true); }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                {t("home.edit")}
              </button>
            </div>
            <div className="relative">
              <div className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1">
                {favoriteTasks.map((task) => task && (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex min-h-[48px] shrink-0 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                >
                  <TaskIcon taskId={task.id} className="h-5 w-5 text-gray-500" />
                  <span className="font-heading text-sm font-semibold">{localTitle(task)}</span>
                </Link>
              ))}
              </div>
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-white via-white/60 to-transparent dark:from-neutral-900 dark:via-neutral-900/60"
                aria-hidden
              />
            </div>
          </section>
        )}

        {grouped.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-heading text-lg font-semibold text-gray-400">{t("home.noResults")}</p>
            <p className="mt-1 text-sm text-muted">
              {t("home.noResultsHint")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ category, label, tasks: groupTasks }) => (
              <section key={category}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {label}
                </h2>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {groupTasks.map((task) => {
                    const cl = checklists[task.id];
                    const totalPoints = cl ? cl.phases.flatMap((p) => p.items).length : 0;
                    return (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="flex min-h-[56px] items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-750"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                        <TaskIcon taskId={task.id} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-base font-semibold leading-tight">{localTitle(task)}</p>
                        <p className="mt-0.5 text-sm text-muted">{localDesc(task)}</p>
                        {totalPoints > 0 && (
                          <p className="mt-1 text-xs text-gray-400">{totalPoints} {t("home.points")}</p>
                        )}
                      </div>
                      <svg className="ml-auto h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="px-5 py-4 text-center text-xs text-muted dark:bg-neutral-900">
        {t(footerKey)}
      </footer>

      {/* Onboarding overlay */}
      {showOnboarding && (
        <Onboarding
          initial={editingFavorites ? favoriteIds : []}
          skipWelcome={editingFavorites}
          onDone={(ids) => {
            setFavoriteIds(ids);
            setShowOnboarding(false);
            setEditingFavorites(false);
          }}
        />
      )}

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        aria-label="Retour en haut"
        className={`fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-300 hover:bg-gray-800 active:scale-95 ${
          showTop ? "translate-y-0 opacity-100" : "translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
