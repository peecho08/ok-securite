"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { checklists } from "@/data/checklists";
import { checklistItemsEn, phaseTitlesEn } from "@/data/checklists-en";
import type { Phase } from "@/types";
import { addRecentTask, clearProgress, getWorkerName, loadProgress, saveProgress } from "@/lib/storage";
import { mergePhases } from "@/lib/locale-helpers";
import { useLocale } from "@/lib/i18n";
import { AlertTriangle, Camera } from "lucide-react";

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
  const localPhaseTitle = (title: string) =>
    locale === "en" && phaseTitlesEn[title] ? phaseTitlesEn[title] : title;
  const rawChecklist = checklists[taskId];
  const phases = useMemo(() => rawChecklist ? mergePhases(rawChecklist.phases) : [], [rawChecklist]);
  const allItems = useMemo(() => phases.flatMap((p) => p.items), [phases]);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [na, setNa] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<Phase>>(new Set());
  const [workerName, setWorkerName] = useState(getWorkerName);
  const [phaseToast, setPhaseToast] = useState<{ phase: Phase; title: string } | null>(null);
  const [undoToast, setUndoToast] = useState<{ id: string; was: "checked" | "na" } | null>(null);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);
  const [navigatingAway, setNavigatingAway] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [scanPhoto, setScanPhoto] = useState<string | null>(null);
  const [scanRisks, setScanRisks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const userToggledRef = useRef(false);
  const prevCompletedPhasesRef = useRef<Set<Phase>>(new Set());
  const phaseRefs = useRef<Map<Phase, HTMLElement>>(new Map());

  const isResolved = useCallback((id: string) => checked.has(id) || na.has(id), [checked, na]);
  const resolvedCount = checked.size + na.size;

  // Load or clear progress depending on entry mode
  useEffect(() => {
    if (!taskId) return;
    if (shouldResume) {
      const saved = loadProgress(taskId);
      if (saved.checked.length > 0 || saved.na.length > 0) {
        setChecked(new Set(saved.checked));
        setNa(new Set(saved.na));
      }
    } else {
      clearProgress(taskId);
    }
    addRecentTask(taskId);
  }, [taskId, shouldResume]);

  // Persist progress on change
  useEffect(() => {
    if (!taskId || (checked.size === 0 && na.size === 0)) return;
    saveProgress(taskId, { checked: Array.from(checked), na: Array.from(na) });
  }, [taskId, checked, na]);

  // Auto-collapse phases when fully resolved + show phase toast + scroll to next phase
  useEffect(() => {
    if (phases.length === 0) return;
    const completedPhases = new Set<Phase>();
    for (const group of phases) {
      if (group.items.every((i) => isResolved(i.id))) {
        completedPhases.add(group.phase);
      }
    }
    const prev = prevCompletedPhasesRef.current;
    const newlyCompleted = [...completedPhases].find((p) => !prev.has(p));
    prevCompletedPhasesRef.current = completedPhases;

    setCollapsed(completedPhases);

    if (newlyCompleted && userToggledRef.current) {
      const group = phases.find((g) => g.phase === newlyCompleted);
      if (group) {
        setPhaseToast({ phase: newlyCompleted, title: group.title });
        haptic();

        const completedIdx = phases.findIndex((g) => g.phase === newlyCompleted);
        const nextPhase = phases[completedIdx + 1];
        if (nextPhase) {
          const el = phaseRefs.current.get(nextPhase.phase);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
          }
        }
      }
    }
  }, [phases, checked, na, isResolved]);

  // Clear phase toast after delay
  useEffect(() => {
    if (!phaseToast) return;
    const t = setTimeout(() => setPhaseToast(null), 2200);
    return () => clearTimeout(t);
  }, [phaseToast]);

  // Auto-navigate to confirm page when all items resolved
  useEffect(() => {
    if (!userToggledRef.current) return;
    userToggledRef.current = false;
    const allDone = allItems.length > 0 && resolvedCount === allItems.length;
    if (!allDone || !taskId) return;
    try { navigator?.vibrate?.([50, 30, 50]); } catch { /* unsupported */ }
    setNavigatingAway(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        items: String(allItems.length),
        checked: String(checked.size),
        na: String(na.size),
        worker: workerName.trim(),
      });
      router.push(`/confirm/${taskId}?${params.toString()}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [checked, na, resolvedCount, allItems.length, taskId, workerName, router]);

  const toggleCheck = useCallback((id: string) => {
    haptic();
    userToggledRef.current = true;
    const wasChecked = checked.has(id);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // If checking, remove from N/A
    if (!wasChecked) {
      setNa((prev) => { const next = new Set(prev); next.delete(id); return next; });
      clearTimeout(undoTimerRef.current);
      setUndoToast(null);
    } else {
      clearTimeout(undoTimerRef.current);
      setUndoToast({ id, was: "checked" });
      undoTimerRef.current = setTimeout(() => setUndoToast(null), 3500);
    }
  }, [checked]);

  const toggleNa = useCallback((id: string) => {
    haptic();
    userToggledRef.current = true;
    const wasNa = na.has(id);
    setNa((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // If marking N/A, remove from checked
    if (!wasNa) {
      setChecked((prev) => { const next = new Set(prev); next.delete(id); return next; });
      clearTimeout(undoTimerRef.current);
      setUndoToast(null);
    } else {
      clearTimeout(undoTimerRef.current);
      setUndoToast({ id, was: "na" });
      undoTimerRef.current = setTimeout(() => setUndoToast(null), 3500);
    }
  }, [na]);

  const handleUndo = useCallback(() => {
    if (!undoToast) return;
    haptic();
    userToggledRef.current = true;
    if (undoToast.was === "checked") {
      setChecked((prev) => { const next = new Set(prev); next.add(undoToast.id); return next; });
    } else {
      setNa((prev) => { const next = new Set(prev); next.add(undoToast.id); return next; });
    }
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

  const allFakeRisks = [
    t("task.scanRisk1"), t("task.scanRisk2"), t("task.scanRisk3"),
    t("task.scanRisk4"), t("task.scanRisk5"), t("task.scanRisk6"),
    t("task.scanRisk7"), t("task.scanRisk8"),
  ];

  function handleScanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setScanPhoto(url);
    setScanState("scanning");
    // Pick 2-4 random risks
    const shuffled = [...allFakeRisks].sort(() => Math.random() - 0.5);
    const count = 2 + Math.floor(Math.random() * 3);
    setTimeout(() => {
      setScanRisks(shuffled.slice(0, count));
      setScanState("done");
    }, 2500);
    e.target.value = "";
  }

  function closeScan() {
    if (scanPhoto) URL.revokeObjectURL(scanPhoto);
    setScanPhoto(null);
    setScanRisks([]);
    setScanState("idle");
  }

  if (!task || !rawChecklist) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold">{t("task.notFound")}</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">
          {t("task.backHome")}
        </Link>
      </div>
    );
  }

  const progress = allItems.length > 0 ? resolvedCount / allItems.length : 0;
  const allResolved = resolvedCount === allItems.length && allItems.length > 0;
  const uncheckedCritical = allItems.filter((i) => i.critical && !isResolved(i.id));

  function navigateToConfirm() {
    const params = new URLSearchParams({
      items: String(allItems.length),
      checked: String(checked.size),
      na: String(na.size),
      worker: workerName.trim(),
    });
    router.push(`/confirm/${taskId}?${params.toString()}`);
  }

  function handleConfirm() {
    if (uncheckedCritical.length > 0) {
      setShowCriticalWarning(true);
      return;
    }
    navigateToConfirm();
  }

  return (
    <div className="flex min-h-dvh flex-col pb-28 dark:bg-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
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
          {resolvedCount > 0 && (
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
          {resolvedCount} / {allItems.length} {t("task.verifications")}
        </p>
      </header>

      {/* Checklist */}
      <main className="flex-1 px-5 py-4 sm:px-8">
        {/* AI Scan — top of list */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleScanFile}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mb-5 flex w-full items-center gap-3.5 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-left transition-colors active:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
            <Camera className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold text-blue-900 dark:text-blue-200">{t("task.scanPhoto")}</p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">{t("task.scanHint")}</p>
          </div>
        </button>

        {phases.map((group, phaseIdx) => {
          const resolvedInPhase = group.items.filter((i) => isResolved(i.id)).length;
          const allPhaseResolved = resolvedInPhase === group.items.length;
          const isCollapsed = collapsed.has(group.phase);

          const isLocked = phaseIdx > 0 && !phases
            .slice(0, phaseIdx)
            .every((prev) => prev.items.every((i) => isResolved(i.id)));

          return (
            <section
              key={group.phase}
              className={`mb-6 scroll-mt-36 transition-opacity duration-300 ${isLocked ? "opacity-40" : ""}`}
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

                <span className={`flex shrink-0 items-center gap-1.5 text-xs ${allPhaseResolved ? "text-green-600 font-medium" : "text-muted"}`}>
                  {resolvedInPhase}/{group.items.length}
                  {allPhaseResolved && (
                    <svg className="h-4 w-4 animate-phase-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
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
                    const isNa = na.has(item.id);
                    return (
                      <SwipeItem key={item.id} onSwipe={() => { if (!isChecked && !isNa) toggleCheck(item.id); }}>
                        <div
                          className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                            isChecked
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                              : isNa
                                ? "border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/50"
                                : item.critical
                                  ? "animate-critical-pulse border-red-300 bg-red-50/50 ring-1 ring-red-200 hover:border-red-400 dark:border-red-700 dark:bg-red-950/40 dark:ring-red-800"
                                  : "border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                          }`}
                        >
                          <button
                            onClick={() => toggleCheck(item.id)}
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              isChecked
                                ? "animate-check-fill border-green-600 bg-green-600 text-white"
                                : isNa
                                  ? "border-gray-300 dark:border-neutral-600"
                                  : item.critical ? "border-red-400 active:border-green-500" : "border-gray-300 active:border-green-500"
                            }`}
                            aria-label="Done"
                          >
                            {isChecked && (
                              <svg className="h-4 w-4 animate-check-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <span className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 text-base leading-snug ${
                            isChecked ? "text-green-900 dark:text-green-200" : isNa ? "text-gray-400 line-through dark:text-neutral-500" : ""
                          }`}>
                            {item.critical && !isChecked && !isNa && (
                              <span className="flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
                                <AlertTriangle className="h-3 w-3" />
                                {t("task.critical")}
                              </span>
                            )}
                            <span>{localItemLabel(item)}</span>
                          </span>
                          <button
                            onClick={() => toggleNa(item.id)}
                            className={`mt-0.5 flex h-9 shrink-0 items-center justify-center rounded-full px-2.5 text-xs font-bold transition-colors ${
                              isNa
                                ? "bg-gray-400 text-white dark:bg-neutral-500"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-400"
                            }`}
                            aria-label="N/A"
                          >
                            {t("task.na")}
                          </button>
                        </div>
                      </SwipeItem>
                    );
                  })}
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
          disabled={!allResolved}
          className={`w-full rounded-xl py-3.5 font-heading text-sm font-bold tracking-wide transition-colors ${
            allResolved
              ? "bg-black text-accent hover:bg-gray-900 active:bg-gray-900 dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"
          }`}
        >
          {allResolved ? t("task.validate") : `${allItems.length - resolvedCount} ${t("task.remaining")}`}
        </button>
      </div>

      {/* Undo toast */}
      {undoToast && (
        <div
          className="fixed bottom-[140px] left-1/2 z-30 flex w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm">{undoToast.was === "checked" ? t("task.unchecked") : t("task.markedNa")}</span>
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
          className="fixed inset-x-0 bottom-[120px] z-40 flex justify-center px-5 sm:px-8 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="flex w-full max-w-3xl items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3.5 shadow-md">
            <svg className="h-5 w-5 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-green-800">
              {localPhaseTitle(phaseToast.title)} — {t("task.phaseCompleteDetail")}
            </p>
          </div>
        </div>
      )}

      {/* Completion transition overlay */}
      {navigatingAway && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 animate-scale-in">
            <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-4 font-heading text-lg font-bold text-green-700 dark:text-green-400 animate-fade-in" style={{ animationDelay: "150ms" }}>
            {t("task.allComplete")}
          </p>
        </div>
      )}

      {/* Critical items warning dialog */}
      {showCriticalWarning && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCriticalWarning(false)} />
          <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-800">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-neutral-100">
                  {t("task.criticalWarningTitle")}
                </h3>
                <p className="text-sm text-muted">
                  {t("task.criticalWarningCount").replace("{count}", String(uncheckedCritical.length))}
                </p>
              </div>
            </div>
            <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto">
              {uncheckedCritical.map((item) => (
                <li key={item.id} className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {localItemLabel(item)}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowCriticalWarning(false)}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-heading text-sm font-bold transition-colors active:bg-gray-50 dark:border-neutral-600 dark:text-neutral-100"
              >
                {t("task.criticalWarningBack")}
              </button>
              <button
                onClick={() => { setShowCriticalWarning(false); navigateToConfirm(); }}
                className="flex-1 rounded-xl bg-red-600 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-red-700 active:bg-red-700"
              >
                {t("task.criticalWarningContinue")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Scan modal */}
      {scanState !== "idle" && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={scanState === "done" ? closeScan : undefined} />
          <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-800">
            {scanPhoto && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scanPhoto} alt="" className="max-h-56 w-full object-cover" />
                {scanState === "scanning" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                  </div>
                )}
                {scanState === "scanning" && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                    <div className="mx-4 h-0.5 animate-pulse bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]" />
                  </div>
                )}
              </div>
            )}
            <div className="p-5">
              <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-neutral-100">
                {t("task.scanTitle")}
              </h3>
              {scanState === "scanning" && (
                <p className="mt-2 animate-pulse text-sm text-gray-500">{t("task.scanning")}</p>
              )}
              {scanState === "done" && (
                <div className="mt-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t("task.scanDone")}
                  </p>
                  <ul className="space-y-2">
                    {scanRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={closeScan}
                    className="mt-4 w-full rounded-xl bg-black py-3 font-heading text-sm font-bold text-white transition-colors active:bg-gray-800 dark:bg-neutral-600"
                  >
                    {t("task.scanClose")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
