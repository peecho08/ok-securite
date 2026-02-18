"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { categoryLabels, type TaskCategory } from "@/types";
import { getRecentTasks } from "@/lib/storage";

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
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setRecentIds(getRecentTasks());
  }, []);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const recentTasks = useMemo(
    () => recentIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean),
    [recentIds],
  );

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
              className="h-[40px] w-auto brightness-0 invert"
              priority
            />
          </button>

          <div className="flex items-center justify-end gap-2">
            <Link
              href="/history"
              className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Récents"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
              aria-hidden
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

      </header>

      <div className="sticky top-0 z-10 bg-[#118914] px-5 pt-1.5 pb-3 sm:px-8">
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
        {/* Recent tasks */}
        {!query && recentTasks.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
              Récents
            </h2>
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto scroll-smooth pb-1">
                {recentTasks.map((task) => task && (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <span className="text-lg">{task.icon}</span>
                  <span className="font-heading text-xs font-semibold">{task.title}</span>
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
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                        {task.icon}
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
