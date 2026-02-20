"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { checklists } from "@/data/checklists";
import { checklistItemsEn, phaseTitlesEn } from "@/data/checklists-en";
import type { Phase } from "@/types";
import { addRecentTask, clearProgress, getWorkerName, loadProgress, saveProgress } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

function haptic() {
  try { navigator?.vibrate?.(10); } catch { /* unsupported */ }
}

const SWIPE_THRESHOLD = 60;

function useSwipeRight(onSwipe: () => void) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    swiping.current = true;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swiping.current) return;
    swiping.current = false;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
    if (dx > SWIPE_THRESHOLD && dy < dx * 0.7) {
      onSwipe();
    }
  }, [onSwipe]);

  return { onTouchStart, onTouchEnd };
}

function SwipeItem({ onSwipe, children }: { onSwipe: () => void; children: React.ReactNode }) {
  const handlers = useSwipeRight(onSwipe);
  return <div {...handlers}>{children}</div>;
}

export default function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldResume = searchParams.get("resume") === "1";
  const { locale, t } = useLocale();

  const task = tasks.find((t) => t.id === taskId);
  const localTitle = (task: (typeof tasks)[number]) =>
    locale === "en" && task.titleEn ? task.titleEn : task.title;
  const localItemLabel = (item: { id: string; label: string }) =>
    locale === "en" && checklistItemsEn[item.id] ? checklistItemsEn[item.id].label : item.label;
  const localItemInfo = (item: { id: string; info?: string }) =>
    locale === "en" && checklistItemsEn[item.id]
      ? (checklistItemsEn[item.id].info ?? item.info ?? "")
      : (item.info ?? "");
  const localPhaseTitle = (title: string) =>
    locale === "en" && phaseTitlesEn[title] ? phaseTitlesEn[title] : title;
  const checklist = checklists[taskId];
  const allItems = checklist?.phases.flatMap((p) => p.items) ?? [];

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<Phase>>(new Set());
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [workerName, setWorkerName] = useState(getWorkerName);
  const [phaseToast, setPhaseToast] = useState<{ phase: Phase; title: string } | null>(null);
  const [undoToast, setUndoToast] = useState<string | null>(null);
  const [unlockedFlash, setUnlockedFlash] = useState<Phase | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const userToggledRef = useRef(false);
  const prevCompletedPhasesRef = useRef<Set<Phase>>(new Set());
  const phaseRefs = useRef<Map<Phase, HTMLElement>>(new Map());

  // Load or clear progress depending on entry mode
  useEffect(() => {
    if (!taskId) return;
    if (shouldResume) {
      const saved = loadProgress(taskId);
      if (saved.length > 0) setChecked(new Set(saved));
    } else {
      clearProgress(taskId);
    }
    addRecentTask(taskId);
  }, [taskId, shouldResume]);

  // Persist progress on change
  useEffect(() => {
    if (!taskId || checked.size === 0) return;
    saveProgress(taskId, Array.from(checked));
  }, [taskId, checked]);

  // Auto-collapse phases when fully checked + show phase toast + scroll to next phase
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

        const completedIdx = checklist.phases.findIndex((g) => g.phase === newlyCompleted);
        const nextPhase = checklist.phases[completedIdx + 1];
        if (nextPhase) {
          setUnlockedFlash(nextPhase.phase);
          setTimeout(() => setUnlockedFlash(null), 1200);
          try { navigator?.vibrate?.([20, 10, 20, 10, 40]); } catch { /* unsupported */ }
          const el = phaseRefs.current.get(nextPhase.phase);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 400);
          }
        }
      }
    }
  }, [checklist, checked]);

  // Clear phase toast after delay
  useEffect(() => {
    if (!phaseToast) return;
    const t = setTimeout(() => setPhaseToast(null), 2200);
    return () => clearTimeout(t);
  }, [phaseToast]);

  // Auto-navigate to confirm page when all items checked
  useEffect(() => {
    if (!userToggledRef.current) return;
    userToggledRef.current = false;
    const allDone = allItems.length > 0 && checked.size === allItems.length;
    if (!allDone || !taskId) return;
    try { navigator?.vibrate?.([50, 30, 50]); } catch { /* unsupported */ }
    const params = new URLSearchParams({
      items: String(allItems.length),
      checked: String(allItems.length),
      worker: workerName.trim(),
    });
    router.push(`/confirm/${taskId}?${params.toString()}`);
  }, [checked, allItems.length, taskId, workerName, router]);

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
        <p className="font-heading text-lg font-semibold">{t("task.notFound")}</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">
          {t("task.backHome")}
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
    <div className="flex min-h-dvh flex-col pb-28 dark:bg-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-500 transition-colors active:bg-gray-100"
            aria-label={t("nav.back")}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight">
              {localTitle(task)}
            </h1>
          </div>
          {checked.size > 0 && (
            <button
              onClick={() => {
                if (!confirm(t("task.abandonConfirm"))) return;
                clearProgress(taskId);
                router.push("/");
              }}
              className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-xs text-red-500 transition-colors hover:bg-red-50 active:bg-red-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
              </svg>
              {t("task.abandon")}
            </button>
          )}
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted">
          {checked.size} / {allItems.length} {t("task.verifications")}
        </p>
      </header>

      {/* Checklist */}
      <main className="flex-1 px-5 py-4 sm:px-8">
        {checklist.phases.map((group, phaseIdx) => {
          const checkedInPhase = group.items.filter((i) => checked.has(i.id)).length;
          const allPhaseChecked = checkedInPhase === group.items.length;
          const isCollapsed = collapsed.has(group.phase);

          const isLocked = phaseIdx > 0 && !checklist.phases
            .slice(0, phaseIdx)
            .every((prev) => prev.items.every((i) => checked.has(i.id)));

          return (
            <section
              key={group.phase}
              className={`mb-6 scroll-mt-24 transition-all duration-500 ${isLocked ? "opacity-40" : ""} ${unlockedFlash === group.phase ? "animate-phase-unlock" : ""}`}
              ref={(el) => { if (el) phaseRefs.current.set(group.phase, el); }}
            >
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => !isLocked && togglePhaseCollapse(group.phase)}
                  className={`flex min-h-[48px] flex-1 items-center gap-2 text-left ${isLocked ? "cursor-not-allowed" : ""}`}
                  disabled={isLocked}
                >
                  {isLocked ? (
                    <svg className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg
                      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <h2 className="font-heading text-base font-semibold text-muted">{localPhaseTitle(group.title)}</h2>
                </button>

                <span className="shrink-0 text-xs text-muted">
                  {checkedInPhase}/{group.items.length}
                </span>
              </div>

              {isLocked && (
                <p className="text-xs text-gray-400">
                  {t("task.unlockPrevious")}
                </p>
              )}

              {!isLocked && !isCollapsed && (
                <div className="animate-fade-in grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[...group.items]
                    .sort((a, b) => (a.critical && !b.critical ? -1 : !a.critical && b.critical ? 1 : 0))
                    .map((item) => {
                    const isChecked = checked.has(item.id);
                    const isInfoOpen = expandedInfo === item.id;
                    return (
                      <SwipeItem key={item.id} onSwipe={() => { if (!isChecked) toggle(item.id, false); }}>
                        <button
                          onClick={() => toggle(item.id, isChecked)}
                          className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
                            isChecked
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                              : item.critical
                                ? "border-red-200 bg-red-50/30 hover:border-red-300 hover:bg-red-50 active:bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
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
                                {t("task.critical")}
                              </span>
                            )}
                            <span>{localItemLabel(item)}</span>
                          </span>
                          {localItemInfo(item) && (
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
                        {isInfoOpen && localItemInfo(item) && (
                          <div className="mx-2 mt-1.5 rounded-lg bg-blue-50 px-3.5 py-2.5 text-sm text-blue-800">
                            {localItemInfo(item)}
                          </div>
                        )}
                      </SwipeItem>
                    );
                  })}
                </div>
              )}

              {!isLocked && isCollapsed && allPhaseChecked && (
                <div className="animate-fade-in flex items-center gap-2 text-green-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium">{t("task.allChecked")}</p>
                </div>
              )}
            </section>
          );
        })}

        <p className="mt-2 mb-4 text-center text-[11px] text-gray-400">
          {t("task.source")}
        </p>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 border-t border-gray-100 bg-white px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <input
          type="text"
          value={workerName}
          onChange={(e) => setWorkerName(e.target.value)}
          placeholder={t("task.workerName")}
          className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:bg-neutral-750"
        />
        <button
          onClick={handleConfirm}
          disabled={!allChecked}
          className={`w-full rounded-xl py-3.5 font-heading text-sm font-bold tracking-wide transition-colors ${
            allChecked
              ? "bg-black text-accent hover:bg-gray-900 active:bg-gray-900 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"
          }`}
        >
          {allChecked ? t("task.validate") : `${allItems.length - checked.size} ${t("task.remaining")}`}
        </button>
      </div>

      {/* Undo toast */}
      {undoToast && (
        <div
          className="fixed bottom-[140px] left-1/2 z-30 flex w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm">{t("task.unchecked")}</span>
          <button
            onClick={handleUndo}
            className="shrink-0 rounded-lg bg-white/20 px-4 py-2 text-sm font-bold transition-colors hover:bg-white/30 active:bg-white/40"
          >
            {t("task.undo")}
          </button>
        </div>
      )}

      {/* Phase completion toast */}
      {phaseToast && (
        <div
          className="fixed inset-x-0 bottom-[120px] z-40 flex justify-center px-5 sm:px-8"
          role="status"
          aria-live="polite"
        >
          <div className="animate-slide-in-bottom flex w-full max-w-3xl items-center gap-4 rounded-2xl border-2 border-green-300 bg-green-50 px-5 py-4 shadow-lg sm:px-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-base font-bold text-green-800">{t("task.phaseComplete")}</p>
              <p className="text-sm text-green-700">
                {localPhaseTitle(phaseToast.title)} {t("task.phaseCompleteDetail")}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
