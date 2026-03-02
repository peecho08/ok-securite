"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { tasks } from "@/data/tasks";
import { type TaskCategory } from "@/types";
import { useLocale } from "@/lib/i18n";
import { localCatLabel, localTitle, normalize } from "@/lib/locale-helpers";
import { clearProgress, getActiveTaskProgress, getTeamTasks, getWorkerName, getActiveRole, getRoleChoiceDone, isDemoSeeded, seedDemoData, resetAllForFreshStart } from "@/lib/storage";
import { checklists } from "@/data/checklists";
import { AppHeader } from "@/components/app-header";
import { SearchBar } from "@/components/search-bar";
import { MusicPlayer } from "@/components/music-player";
import { ActiveTasks } from "@/components/active-tasks";
import { TaskList } from "@/components/task-list";
import { Onboarding } from "@/components/onboarding";
import { SupervisorHome } from "@/components/supervisor-home";

const categoryOrder: TaskCategory[] = [
  "gros-oeuvre",
  "structure",
  "enveloppe",
  "mecanique",
  "finition",
  "equipement",
  "situation",
];

export default function HomePage() {
  const { locale, t } = useLocale();
  const [query, setQuery] = useState("");
  const [teamTaskIds, setTeamTaskIds] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeProgress, setActiveProgress] = useState<{ taskId: string; checkedIds: string[]; naIds: string[] }[]>([]);
  const [showTop, setShowTop] = useState(false);
  const [searchPinned, setSearchPinned] = useState(false);
  const [workerName, setWorkerNameState] = useState("");
  const [ready, setReady] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);

  useEffect(() => {
    if (!isDemoSeeded()) {
      seedDemoData();
    }
    setTeamTaskIds(getTeamTasks());
    setActiveProgress(getActiveTaskProgress());
    setWorkerNameState(getWorkerName());
    const roleDone = getRoleChoiceDone();
    const supervisorMode = getActiveRole() === "supervisor";
    setIsSupervisor(supervisorMode);
    if (!roleDone) setShowOnboarding(true);
    setReady(true);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 1);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    });
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

  const teamTasks = useMemo(
    () => teamTaskIds.map((id) => tasks.find((task) => task.id === id)).filter(Boolean) as (typeof tasks)[number][],
    [teamTaskIds],
  );

  const teamGrouped = useMemo(() => {
    if (teamTasks.length === 0) return [];
    return [{ category: "team", label: t("home.myTasks"), tasks: teamTasks }];
  }, [teamTasks, t]);

  const activeTasks = useMemo(() => {
    return activeProgress
      .map(({ taskId, checkedIds, naIds }) => {
        const task = tasks.find((t) => t.id === taskId);
        const cl = checklists[taskId];
        if (!task || !cl) return null;
        const total = cl.phases.flatMap((p) => p.items).length;
        return { task, checked: checkedIds.length + naIds.length, total };
      })
      .filter(Boolean) as { task: (typeof tasks)[number]; checked: number; total: number }[];
  }, [activeProgress]);

  const filtered = useMemo(() => {
    if (!query.trim()) return tasks;
    const q = normalize(query);
    return tasks.filter((task) => {
      const haystack = normalize(
        `${task.title} ${task.titleEn ?? ""} ${task.description} ${task.descriptionEn ?? ""} ${localCatLabel(task.category, locale)} ${(task.keywords ?? []).join(" ")}`
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
        label: localCatLabel(cat, locale),
        tasks: map.get(cat)!.sort((a, b) => localTitle(a, locale).localeCompare(localTitle(b, locale), locale === "en" ? "en" : "fr")),
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

  const handleAbandon = useCallback((taskId: string) => {
    if (!confirm(t("home.abandonConfirm"))) return;
    clearProgress(taskId);
    setActiveProgress((prev) => prev.filter((p) => p.taskId !== taskId));
  }, [t]);

  if (ready && isSupervisor && !showOnboarding) {
    return <SupervisorHome />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        workerName={workerName}
        onFreshStart={() => { resetAllForFreshStart(); window.location.href = "/"; }}
      />

      <SearchBar query={query} onQueryChange={setQuery} pinned={searchPinned} />

      <main className="flex-1 px-5 py-4 dark:bg-neutral-900 sm:px-8">
        {!ready ? (
          <div className="space-y-4 py-4">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200 dark:bg-neutral-700" />
          </div>
        ) : (
          <>
            {!query && activeTasks.length === 0 && (
              <section className="mx-auto mb-5 max-w-xs py-4 text-center">
                {workerName && (
                  <p className="mb-2 text-base font-semibold text-gray-400">
                    {t(greeting)}, {workerName}
                  </p>
                )}
                <p className="font-heading text-xl font-bold text-gray-700 dark:text-neutral-200">
                  &laquo;&nbsp;{t(quoteKey)}&nbsp;&raquo;
                </p>
                <p className="mt-1.5 text-sm text-gray-400">
                  {t("home.chooseTask")}
                </p>
              </section>
            )}

            {!query && activeTasks.length > 0 && (
              <ActiveTasks activeTasks={activeTasks} onAbandon={handleAbandon} />
            )}

            {!query && teamTasks.length > 0 && (
              <>
                <TaskList grouped={teamGrouped} />
                <button
                  onClick={() => setShowAllTasks((v) => !v)}
                  className="mx-auto mb-4 mt-2 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 shadow-sm transition-colors hover:border-gray-400 hover:text-gray-700 active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-200"
                >
                  {showAllTasks ? t("home.hideAll") : t("home.showAll")}
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${showAllTasks ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </>
            )}

            {(query || teamTasks.length === 0 || showAllTasks) && (
              <TaskList grouped={grouped} />
            )}
          </>
        )}
      </main>

      <footer className="px-5 py-4 text-center text-xs text-muted dark:bg-neutral-900">
        {t(footerKey)}
      </footer>

      {showOnboarding && (
        <Onboarding
          onDone={() => {
            setTeamTaskIds(getTeamTasks());
            setWorkerNameState(getWorkerName());
            setIsSupervisor(getActiveRole() === "supervisor");
            setShowOnboarding(false);
          }}
        />
      )}

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
