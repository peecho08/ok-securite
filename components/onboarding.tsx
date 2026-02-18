"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { tasks } from "@/data/tasks";
import { categoryLabels, type TaskCategory } from "@/types";
import { setFavorites, getWorkerName, setWorkerName } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";

const categoryOrder: TaskCategory[] = [
  "gros-oeuvre",
  "structure",
  "enveloppe",
  "mecanique",
  "finition",
  "equipement",
  "situation",
];

const MIN_FAVORITES = 1;

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface OnboardingProps {
  initial?: string[];
  skipWelcome?: boolean;
  onDone: (ids: string[]) => void;
}

export function Onboarding({ initial = [], skipWelcome = false, onDone }: OnboardingProps) {
  const [step, setStep] = useState<"welcome" | "pick">(skipWelcome ? "pick" : "welcome");
  const [name, setName] = useState(getWorkerName);
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));
  const [search, setSearch] = useState("");

  function handleStart() {
    if (name.trim()) setWorkerName(name.trim());
    setStep("pick");
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    if (selected.size < MIN_FAVORITES) return;
    const ids = Array.from(selected);
    setFavorites(ids);
    onDone(ids);
  }

  const filteredGrouped = useMemo(() => {
    const q = normalize(search);
    return categoryOrder.map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      tasks: tasks.filter((t) => {
        if (t.category !== cat) return false;
        if (!q) return true;
        return normalize(`${t.title} ${t.description}`).includes(q);
      }),
    })).filter((g) => g.tasks.length > 0);
  }, [search]);

  const count = selected.size;
  const canConfirm = count >= MIN_FAVORITES;

  if (step === "welcome") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <Image
            src="/logo.svg"
            alt="OK Chantier"
            width={188}
            height={48}
            className="h-14 w-auto"
            priority
          />

          <h1 className="mt-8 font-heading text-2xl font-bold">
            {name.trim() ? `Bonjour ${name.trim().split(" ")[0]}` : "Bonjour"} !
          </h1>
          <p className="mt-2 max-w-sm text-base text-gray-500">
            L&apos;application qui vous accompagne pour assurer la sécurité sur vos chantiers.
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre prénom"
            className="mt-8 w-full max-w-xs rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-base outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />

          <button
            onClick={handleStart}
            className="mt-6 w-full max-w-xs rounded-xl bg-[#118914] py-4 font-heading text-base font-bold tracking-wide text-white transition-colors hover:bg-[#0e7511] active:bg-[#0e7511]"
          >
            COMMENCER
          </button>

        </div>
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1.5">
          <span className="text-sm text-gray-400">Alimenté par</span>
          <Image
            src="/cnesst-logo.svg"
            alt="CNESST"
            width={100}
            height={38}
            className="h-[23px] w-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="bg-[#118914] px-5 pb-4 pt-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          {!skipWelcome && (
            <button
              onClick={() => setStep("welcome")}
              className="mb-3 flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
          )}
          <h1 className="font-heading text-2xl font-bold text-white">
            Choisissez vos tâches
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Sélectionnez au moins {MIN_FAVORITES} tâche pour un accès rapide.
          </p>

          <div className="relative mt-4">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une tâche…"
              className="w-full rounded-xl border border-white/25 bg-white/15 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/40 focus:bg-white/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-5 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {filteredGrouped.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">Aucune tâche trouvée</p>
            ) : (
              filteredGrouped.map(({ category, label, tasks: catTasks }) => (
                <section key={category}>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {label}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {catTasks.map((task) => {
                      const isSelected = selected.has(task.id);
                      return (
                        <button
                          key={task.id}
                          onClick={() => toggle(task.id)}
                          className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white hover:border-gray-300 active:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              isSelected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <TaskIcon taskId={task.id} className="h-4.5 w-4.5" />
                          </span>
                          <span className="min-w-0 text-sm font-semibold leading-tight">
                            {task.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-center text-sm text-gray-500">
            {count} tâche{count !== 1 ? "s" : ""} sélectionnée{count !== 1 ? "s" : ""}
          </p>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`w-full rounded-xl py-3.5 font-heading text-sm font-bold tracking-wide transition-colors ${
              canConfirm
                ? "bg-[#118914] text-white hover:bg-[#0e7511] active:bg-[#0e7511]"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {canConfirm ? "C\u2019EST PARTI" : "Sélectionnez au moins 1 tâche"}
          </button>
        </div>
      </div>
    </div>
  );
}
