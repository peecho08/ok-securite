"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearHistory, getHistory, type HistoryEntry } from "@/lib/storage";

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  function handleClear() {
    if (confirm("Effacer tout l'historique ?")) {
      clearHistory();
      setEntries([]);
    }
  }

  const grouped = entries.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    const day = new Date(entry.completedAt).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    (acc[day] ??= []).push(entry);
    return acc;
  }, {});

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors active:bg-gray-100"
            aria-label="Retour"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold">Historique</h1>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="ml-auto text-xs text-red-500 hover:text-red-700"
            >
              Tout effacer
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 px-5 py-4 sm:px-8">
        {entries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-heading text-lg font-semibold text-gray-400">Aucun historique</p>
            <p className="mt-1 text-sm text-muted">
              Les checklists complétées apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([day, dayEntries]) => (
              <section key={day}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {day}
                </h2>
                <div className="space-y-2">
                  {dayEntries.map((entry, i) => {
                    const isComplete = entry.checkedCount === entry.totalCount;
                    const time = new Date(entry.completedAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={`${entry.completedAt}-${i}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl">
                          {entry.taskIcon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-sm font-semibold leading-tight">
                            {entry.taskTitle}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">
                            {time}
                            {entry.workerName && ` — ${entry.workerName}`}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 font-heading text-[10px] font-semibold ${
                            isComplete ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {entry.checkedCount}/{entry.totalCount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
