"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { checklists } from "@/data/checklists";
import type { Phase } from "@/types";
import { addRecentTask, loadProgress, saveProgress } from "@/lib/storage";

function haptic() {
  try { navigator?.vibrate?.(10); } catch { /* unsupported */ }
}

export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();

  const task = tasks.find((t) => t.id === taskId);
  const checklist = checklists[taskId];
  const allItems = checklist?.phases.flatMap((p) => p.items) ?? [];

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<Phase>>(new Set());
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [workerName, setWorkerName] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [phaseToast, setPhaseToast] = useState<{ phase: Phase; title: string } | null>(null);
  const [undoToast, setUndoToast] = useState<string | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const userToggledRef = useRef(false);
  const prevCompletedPhasesRef = useRef<Set<Phase>>(new Set());

  // Load saved progress and track recent task
  useEffect(() => {
    if (!taskId) return;
    const saved = loadProgress(taskId);
    if (saved.length > 0) setChecked(new Set(saved));
    addRecentTask(taskId);
  }, [taskId]);

  // Persist progress on change
  useEffect(() => {
    if (!taskId || checked.size === 0) return;
    saveProgress(taskId, Array.from(checked));
  }, [taskId, checked]);

  // Auto-collapse phases when fully checked + show phase toast when a phase is newly completed
  useEffect(() => {
    if (!checklist) return;
    const completedPhases = new Set<Phase>();
    for (const group of checklist.phases) {
      if (group.items.every((i) => checked.has(i.id))) {
        completedPhases.add(group.phase);
      }
    }
    const prev = prevCompletedPhasesRef.current;
    const newlyCompleted = [...completedPhases].find((p) => !prev.has(p));
    prevCompletedPhasesRef.current = completedPhases;

    setCollapsed(completedPhases);

    if (newlyCompleted && userToggledRef.current) {
      const group = checklist.phases.find((g) => g.phase === newlyCompleted);
      if (group) {
        setPhaseToast({ phase: newlyCompleted, title: group.title });
        try { navigator?.vibrate?.([30, 20, 30]); } catch { /* unsupported */ }
      }
    }
  }, [checklist, checked]);

  // Clear phase toast after delay
  useEffect(() => {
    if (!phaseToast) return;
    const t = setTimeout(() => setPhaseToast(null), 2200);
    return () => clearTimeout(t);
  }, [phaseToast]);

  // Celebration when the user checks the very last item
  useEffect(() => {
    if (!userToggledRef.current) return;
    userToggledRef.current = false;
    const allChecked = allItems.length > 0 && checked.size === allItems.length;
    if (!allChecked) return;
    setShowCelebration(true);
    try { navigator?.vibrate?.([50, 30, 50]); } catch { /* unsupported */ }
    const t = setTimeout(() => setShowCelebration(false), 2500);
    return () => clearTimeout(t);
  }, [checked, allItems.length]);

  const toggle = useCallback((id: string, wasChecked: boolean) => {
    haptic();
    userToggledRef.current = true;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (wasChecked) {
      clearTimeout(undoTimerRef.current);
      setUndoToast(id);
      undoTimerRef.current = setTimeout(() => setUndoToast(null), 3500);
    } else {
      clearTimeout(undoTimerRef.current);
      setUndoToast(null);
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    haptic();
    userToggledRef.current = true;
    setChecked((prev) => {
      const next = new Set(prev);
      next.add(undoToast);
      return next;
    });
    clearTimeout(undoTimerRef.current);
    setUndoToast(null);
  }, [undoToast]);

  const togglePhaseCollapse = useCallback((phase: Phase) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  }, []);

  if (!task || !checklist) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold">Tâche introuvable</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const progress = allItems.length > 0 ? checked.size / allItems.length : 0;
  const allChecked = checked.size === allItems.length && allItems.length > 0;

  function handleConfirm() {
    const params = new URLSearchParams({
      items: String(allItems.length),
      checked: String(checked.size),
      worker: workerName.trim(),
    });
    router.push(`/confirm/${taskId}?${params.toString()}`);
  }

  return (
    <div className="flex min-h-dvh flex-col pb-28">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-500 transition-colors active:bg-gray-100"
            aria-label="Retour"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight">
              {task.title}
            </h1>
          </div>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted">
          {checked.size} / {allItems.length} vérifications
        </p>
      </header>

      {/* Checklist */}
      <main className="flex-1 px-5 py-4 sm:px-8">
        {checklist.phases.map((group) => {
          const checkedInPhase = group.items.filter((i) => checked.has(i.id)).length;
          const allPhaseChecked = checkedInPhase === group.items.length;
          const isCollapsed = collapsed.has(group.phase);

          return (
            <section key={group.phase} className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => togglePhaseCollapse(group.phase)}
                  className="flex min-h-[48px] flex-1 items-center gap-2 text-left"
                >
                  <svg
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <h2 className="font-heading text-base font-semibold text-muted">{group.title}</h2>
                </button>

                <span className="shrink-0 text-xs text-muted">
                  {checkedInPhase}/{group.items.length}
                </span>
              </div>

              {!isCollapsed && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[...group.items]
                    .sort((a, b) => (a.critical && !b.critical ? -1 : !a.critical && b.critical ? 1 : 0))
                    .map((item) => {
                    const isChecked = checked.has(item.id);
                    const isInfoOpen = expandedInfo === item.id;
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => toggle(item.id, isChecked)}
                          className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
                            isChecked
                              ? "border-green-200 bg-green-50"
                              : item.critical
                                ? "border-red-200 bg-red-50/30 hover:border-red-300 hover:bg-red-50 active:bg-red-50"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              isChecked ? "border-green-600 bg-green-600 text-white" : item.critical ? "border-red-400" : "border-gray-300"
                            }`}
                          >
                            {isChecked && (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 text-base leading-snug ${isChecked ? "text-green-900" : ""}`}>
                            {item.critical && !isChecked && (
                              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">
                                CRITIQUE
                              </span>
                            )}
                            <span>{item.label}</span>
                          </span>
                          {item.info && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedInfo(isInfoOpen ? null : item.id);
                              }}
                              className="mt-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200 active:bg-gray-300"
                            >
                              i
                            </span>
                          )}
                        </button>
                        {isInfoOpen && item.info && (
                          <div className="mx-2 mt-1.5 rounded-lg bg-blue-50 px-3.5 py-2.5 text-sm text-blue-800">
                            {item.info}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {isCollapsed && allPhaseChecked && (
                <p className="text-xs text-green-600">Tous les points sont cochés.</p>
              )}
            </section>
          );
        })}

        <p className="mt-2 mb-4 text-center text-[11px] text-gray-400">
          Source : CNESST / Code de sécurité pour les travaux de construction
        </p>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 border-t border-gray-100 bg-white px-5 py-3 sm:px-8">
        <input
          type="text"
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          placeholder="Nom du travailleur (optionnel)"
          className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
        />
        <button
          onClick={handleConfirm}
          disabled={!allChecked}
          className={`w-full rounded-xl py-3.5 font-heading text-sm font-bold tracking-wide transition-colors ${
            allChecked
              ? "bg-black text-accent hover:bg-gray-900 active:bg-gray-900"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          {allChecked ? "VALIDER LA CHECKLIST ✓" : `${allItems.length - checked.size} point(s) restant(s)`}
        </button>
      </div>

      {/* Undo toast */}
      {undoToast && (
        <div
          className="fixed bottom-[140px] left-1/2 z-30 flex w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm">Point décoché</span>
          <button
            onClick={handleUndo}
            className="shrink-0 rounded-lg bg-white/20 px-4 py-2 text-sm font-bold transition-colors hover:bg-white/30 active:bg-white/40"
          >
            ANNULER
          </button>
        </div>
      )}

      {/* Phase completion toast */}
      {phaseToast && (
        <div
          className="fixed left-1/2 top-24 z-40 -translate-x-1/2 animate-scale-in rounded-xl border-2 border-green-300 bg-green-50 px-4 py-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-heading font-bold text-green-800">Bravo !</p>
              <p className="text-sm text-green-700">
                {phaseToast.title} terminé — Passez à l&apos;étape suivante →
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebration overlay */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex min-h-dvh flex-col items-center justify-center bg-green-500/95 px-6"
          onClick={() => setShowCelebration(false)}
          role="dialog"
          aria-live="polite"
          aria-label="Félicitations"
        >
          <div className="animate-scale-in flex flex-col items-center gap-6 text-center">
            <Image
              src="/ok.svg"
              alt="OK"
              width={188}
              height={98}
              className="h-24 w-auto brightness-0 invert"
            />
            <div className="flex flex-col gap-1">
              <p className="font-heading text-2xl font-bold text-white drop-shadow-sm">
                Félicitations !
              </p>
              <p className="text-base text-white/95">
                Tous les points sont cochés.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
