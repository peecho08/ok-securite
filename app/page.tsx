"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { categoryLabels, type TaskCategory } from "@/types";
import { clearProgress, getActiveTaskProgress, getFavorites, getWorkerName, hasFavorites } from "@/lib/storage";
import { checklists } from "@/data/checklists";
import { TaskIcon } from "@/components/task-icon";
import { Onboarding } from "@/components/onboarding";

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
  const [query, setQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingFavorites, setEditingFavorites] = useState(false);
  const [activeProgress, setActiveProgress] = useState<{ taskId: string; checkedIds: string[] }[]>([]);
  const [showTop, setShowTop] = useState(false);
  const [searchPinned, setSearchPinned] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [workerName, setWorkerNameState] = useState("");

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
      const haystack = normalize(`${task.title} ${task.description} ${categoryLabels[task.category]}`);
      return haystack.includes(q);
    });
  }, [query]);

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
        label: categoryLabels[cat],
        tasks: map.get(cat)!.sort((a, b) => a.title.localeCompare(b.title, "fr")),
      }));
  }, [filtered]);

  const [greeting] = useState(() => {
    const h = new Date().getHours();
    const pick = (opts: string[]) => opts[Math.floor(Math.random() * opts.length)];
    if (h < 5) return pick(["Bonne nuit", "Encore debout", "Nuit blanche"]);
    if (h < 12) return pick(["Bon matin", "Bonne matinée", "Salut"]);
    if (h < 17) return pick(["Bon après-midi", "Bonne journée", "Salut"]);
    return pick(["Bonne soirée", "Bonne fin de journée", "Salut"]);
  });

  const [motivationalQuote] = useState(() => {
    const quotes = [
      "Discipline. Effort. Respect.",
      "Le travail bien fait, ça parle tout seul.",
      "Travaille fort. Reste solide.",
      "Travaille comme si ton nom était dessus.",
      "La fierté commence par la sécurité.",
      "Chaque geste compte. Chaque règle aussi.",
      "La sécurité n'est pas une option.",
      "Le vrai talent, c'est l'effort.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-[#118914] px-5 pt-6 pb-4 sm:px-8">
        <div className="grid grid-cols-3 items-center gap-2">
          <a
            href="https://www.cnesst.gouv.qc.ca/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-1 transition-opacity hover:opacity-80"
          >
            <span className="text-xs text-white/80 underline decoration-white/40 underline-offset-2">
              Alimenté par
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
            type="button"
            onClick={() => window.location.reload()}
            className="flex justify-center cursor-pointer transition-opacity hover:opacity-80"
            aria-label="Rafraîchir la page"
          >
            <Image
              src="/logo.svg"
              alt="OK Chantier"
              width={188}
              height={48}
              className="h-12 w-auto brightness-0 invert sm:h-9"
              priority
            />
          </button>

          <div className="relative flex items-center justify-end">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors active:bg-white/40 sm:h-9 sm:w-9"
              aria-label="Menu"
            >
              <svg className="h-6 w-6 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40 bg-black/30 sm:bg-transparent" onClick={() => setShowMenu(false)} aria-hidden />
                <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-56 sm:rounded-xl sm:rounded-t-none sm:border sm:border-t-0 sm:shadow-xl">
                  <div className="mx-auto mb-2 mt-3 h-1 w-12 rounded-full bg-gray-200 sm:hidden" aria-hidden />
                  {workerName && (
                    <div className="border-b border-gray-100 px-5 py-4 sm:px-4 sm:py-3">
                      <p className="font-heading text-base font-bold text-gray-900 sm:text-sm">{workerName}</p>
                      <p className="text-sm text-gray-400 sm:text-xs">Travailleur</p>
                    </div>
                  )}
                  <div className="py-2 pb-[env(safe-area-inset-bottom)] sm:py-1 sm:pb-0">
                    <Link
                      href="/history"
                      onClick={() => setShowMenu(false)}
                      className="flex min-h-[52px] items-center gap-4 px-5 py-3 text-base text-gray-700 transition-colors active:bg-gray-100 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Historique
                    </Link>
                    <button
                      onClick={() => { setShowMenu(false); setEditingFavorites(true); setShowOnboarding(true); }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.911c.969 0 1.372 1.24.588 1.81l-3.974 2.888 1.518 4.674c.3.921-.755 1.688-1.539 1.118L12 15.203l-3.974 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674-3.974-2.888c-.783-.57-.38-1.81.588-1.81h4.911l1.518-4.674z" />
                      </svg>
                      Modifier mes favoris
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setEditingFavorites(false);
                        setShowOnboarding(true);
                      }}
                      className="flex min-h-[52px] w-full items-center gap-4 px-5 py-3 text-left text-base text-gray-700 transition-colors active:bg-gray-100 sm:min-h-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm sm:hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 shrink-0 text-gray-400 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Recommencer l&apos;accueil
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
            placeholder="Rechercher une tâche…"
            className="w-full rounded-lg border border-white/30 bg-white/15 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/60 outline-none transition-colors focus:border-white/50 focus:bg-white/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              aria-label="Effacer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 px-5 py-4 sm:px-8">
        {/* Motivational empty state */}
        {!query && activeTasks.length === 0 && (
          <section className="mx-auto mb-6 max-w-xs py-6 text-center">
            {workerName && (
              <p className="mb-3 font-heading text-lg font-semibold text-gray-400">
                {greeting}, {workerName}
              </p>
            )}
            <p className="font-heading text-2xl font-bold text-gray-700">
              &laquo;&nbsp;{motivationalQuote}&nbsp;&raquo;
            </p>
            <p className="mt-1.5 text-sm text-gray-400">
              Choisissez une tâche pour commencer.
            </p>
          </section>
        )}

        {/* Active / ongoing tasks */}
        {!query && activeTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
              En cours
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {activeTasks.map(({ task, checked, total }, i) => (
                <div key={task.id} className="animate-slide-in-up relative" style={{ animationDelay: `${i * 80}ms` }}>
                  <Link
                    href={`/tasks/${task.id}?resume=1`}
                    className="flex aspect-[4/3] flex-col justify-between rounded-2xl border-2 border-green-200 bg-green-50 p-5 transition-colors hover:border-green-300 active:bg-green-100"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                        <TaskIcon taskId={task.id} className="h-6 w-6" />
                      </span>
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold leading-tight text-green-900">
                        {task.title}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-green-200">
                        <div
                          className="h-full rounded-full bg-green-600 transition-all"
                          style={{ width: `${(checked / total) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-sm font-medium text-green-700">
                        {checked}/{total} vérifications
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      if (!confirm("Abandonner cette inspection ?")) return;
                      clearProgress(task.id);
                      setActiveProgress((prev) => prev.filter((p) => p.taskId !== task.id));
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow-sm transition-colors hover:bg-white hover:text-red-500"
                    aria-label="Abandonner"
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
                Favoris
              </h2>
              <button
                onClick={() => { setEditingFavorites(true); setShowOnboarding(true); }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Modifier
              </button>
            </div>
            <div className="relative">
              <div className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1">
                {favoriteTasks.map((task) => task && (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex min-h-[48px] shrink-0 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50"
                >
                  <TaskIcon taskId={task.id} className="h-5 w-5 text-gray-500" />
                  <span className="font-heading text-sm font-semibold">{task.title}</span>
                </Link>
              ))}
              </div>
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-white via-white/60 to-transparent"
                aria-hidden
              />
            </div>
          </section>
        )}

        {grouped.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-heading text-lg font-semibold text-gray-400">Aucune tâche trouvée</p>
            <p className="mt-1 text-sm text-muted">
              Essayez un autre terme comme &laquo;&nbsp;béton&nbsp;&raquo; ou &laquo;&nbsp;hauteur&nbsp;&raquo;
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
                  {groupTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="flex min-h-[56px] items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <TaskIcon taskId={task.id} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-base font-semibold leading-tight">{task.title}</p>
                        <p className="mt-0.5 text-sm text-muted">{task.description}</p>
                      </div>
                      <svg className="ml-auto h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="px-5 py-4 text-center text-xs text-muted">
        Restez vigilant. Chaque geste compte.
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
