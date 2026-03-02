"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { checklists } from "@/data/checklists";
import { checklistItemsEn, phaseTitlesEn } from "@/data/checklists-en";
import type { Phase } from "@/types";
import { addRecentTask, clearProgress, getWorkerName, loadProgress, saveProgress, getSites, getLastSiteId, setLastSiteId, type ConstructionSite } from "@/lib/storage";
import { mergePhases } from "@/lib/locale-helpers";
import { useLocale } from "@/lib/i18n";
import { getLogoPngDataUrl } from "@/lib/pdf-logo";
import { AlertTriangle, Camera, Download, MapPin } from "lucide-react";

function haptic(pattern: number | number[] = 15) {
  try { navigator?.vibrate?.(pattern); } catch { /* unsupported */ }
}
const HAPTIC_CHECK = 15;
const HAPTIC_UNCHECK = 8;
const HAPTIC_NA = 6;
const HAPTIC_PHASE = [15, 50, 15];
const HAPTIC_ALL_DONE = [10, 30, 10, 30, 40];

function linkifyPhones(text: string) {
  const phoneRegex = /(1[\s-]?\d{3}[\s-]\d{3}[\s-]\d{4})/g;
  const parts = text.split(phoneRegex);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (phoneRegex.test(part)) {
      const digits = part.replace(/\D/g, "");
      return <a key={i} href={`tel:${digits}`} className="font-semibold underline underline-offset-2">{part}</a>;
    }
    return part;
  });
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
  const rawChecklist = checklists[taskId];
  const phases = useMemo(() => rawChecklist ? mergePhases(rawChecklist.phases) : [], [rawChecklist]);
  const allItems = useMemo(() => phases.flatMap((p) => p.items), [phases]);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [na, setNa] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<Phase>>(new Set());
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [workerName, setWorkerName] = useState(getWorkerName);
  const [availableSites, setAvailableSites] = useState<ConstructionSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [phaseToast, setPhaseToast] = useState<{ phase: Phase; title: string } | null>(null);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");
  const [scanPhoto, setScanPhoto] = useState<string | null>(null);
  const [scanRisks, setScanRisks] = useState<string[]>([]);
  const [scanMarkers, setScanMarkers] = useState<{ x: number; y: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    const sites = getSites();
    setAvailableSites(sites);
    const lastId = getLastSiteId();
    if (lastId && sites.some((s) => s.id === lastId && s.active !== false)) {
      setSelectedSiteId(lastId);
    }
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
        haptic(HAPTIC_PHASE);

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

  const scrollToNextUnresolved = useCallback((justResolvedId: string) => {
    setTimeout(() => {
      const ordered = phases.flatMap(p => {
        if (collapsed.has(p.phase)) return [];
        return [...p.items].sort((a, b) => (a.critical && !b.critical ? -1 : !a.critical && b.critical ? 1 : 0));
      });
      const idx = ordered.findIndex(item => item.id === justResolvedId);
      if (idx === -1) return;
      const next = ordered.slice(idx + 1).find(item =>
        !checked.has(item.id) && !na.has(item.id) && item.id !== justResolvedId
      );
      if (!next) return;
      const el = document.querySelector(`[data-item-id="${next.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewBottom = window.innerHeight - 80;
      if (rect.top < 0 || rect.bottom > viewBottom) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 350);
  }, [phases, collapsed, checked, na]);

  const toggleCheck = useCallback((id: string) => {
    const wasChecked = checked.has(id);
    haptic(wasChecked ? HAPTIC_UNCHECK : HAPTIC_CHECK);
    userToggledRef.current = true;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!wasChecked) {
      setNa((prev) => { const next = new Set(prev); next.delete(id); return next; });
      scrollToNextUnresolved(id);
    }
  }, [checked, scrollToNextUnresolved]);

  const toggleNa = useCallback((id: string) => {
    haptic(HAPTIC_NA);
    userToggledRef.current = true;
    const wasNa = na.has(id);
    setNa((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (!wasNa) {
      setChecked((prev) => { const next = new Set(prev); next.delete(id); return next; });
      scrollToNextUnresolved(id);
    }
  }, [na, scrollToNextUnresolved]);

  const togglePhaseCollapse = useCallback((phase: Phase) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  }, []);

  const DEMO_MODE = true; // flip to false to use real Gemini AI

  const allFakeRisks = [
    t("task.scanRisk1"), t("task.scanRisk2"), t("task.scanRisk3"),
    t("task.scanRisk4"), t("task.scanRisk5"), t("task.scanRisk6"),
    t("task.scanRisk7"), t("task.scanRisk8"),
  ];

  async function handleScanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setScanPhoto(url);
    setScanState("scanning");
    e.target.value = "";

    if (DEMO_MODE) {
      const shuffled = [...allFakeRisks].sort(() => Math.random() - 0.5);
      const count = 2 + Math.floor(Math.random() * 2); // 2-3 risks
      const risks = shuffled.slice(0, count);
      const markers = risks.map(() => ({
        x: 15 + Math.random() * 70, // keep within 15%-85% to stay visible
        y: 15 + Math.random() * 60,
      }));
      setTimeout(() => {
        setScanRisks(risks);
        setScanMarkers(markers);
        setScanState("done");
      }, 6000);
      return;
    }

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, lang: locale }),
      });

      const data = await res.json();
      const realRisks: string[] = data.risks ?? [];
      setScanRisks(realRisks);
      setScanMarkers(realRisks.map(() => ({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 60 })));
      setScanState("done");
    } catch {
      setScanRisks([locale === "en" ? "Analysis failed — please try again" : "Analyse échouée — veuillez réessayer"]);
      setScanMarkers([{ x: 50, y: 40 }]);
      setScanState("done");
    }
  }

  function closeScan() {
    if (scanPhoto) URL.revokeObjectURL(scanPhoto);
    setScanPhoto(null);
    setScanRisks([]);
    setScanMarkers([]);
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

  const generatePdf = useCallback(async () => {
    if (!task || phases.length === 0) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let y = 20;

    const addPage = () => { doc.addPage(); y = 20; };
    const checkSpace = (needed: number) => { if (y + needed > 275) addPage(); };

    const brandRgb: [number, number, number] = [17, 137, 20];
    const headerRgb: [number, number, number] = [30, 35, 36];
    doc.setFillColor(...headerRgb);
    doc.rect(0, 0, pageW, 40, "F");

    const now = new Date();
    const dateLocale = locale === "en" ? "en-CA" : "fr-FR";
    const dateTimeStr = now.toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" }) + " — " + now.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" });

    try {
      const logoDataUrl = await getLogoPngDataUrl();
      const logoH = 10;
      const logoW = logoH * (2108 / 570);
      doc.addImage(logoDataUrl, "PNG", margin, 6, logoW, logoH);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(localTitle(task), margin, 28);
      doc.setFontSize(9);
      doc.text(dateTimeStr, margin, 35);
    } catch {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("OK Chantier", margin, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(localTitle(task), margin, 28);
      doc.setFontSize(9);
      doc.text(dateTimeStr, margin, 35);
    }
    y = 50;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    if (workerName) {
      doc.setFont("helvetica", "bold");
      doc.text(`${t("confirm.worker")}: `, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(workerName, margin + 30, y);
      y += 7;
    }
    const selectedSite = availableSites.find((s) => s.id === selectedSiteId);
    if (selectedSite) {
      doc.setFont("helvetica", "bold");
      doc.text(`${t("confirm.site")}: `, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(selectedSite.name, margin + 30, y);
      y += 7;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`${t("confirm.status")}: `, margin, y);
    doc.setFont("helvetica", "normal");
    const statusText = na.size > 0
      ? `${checked.size + na.size}/${allItems.length} (${checked.size} ${t("confirm.checked")}, ${na.size} ${t("confirm.na")})`
      : `${checked.size}/${allItems.length}`;
    doc.text(statusText, margin + 30, y);
    y += 12;

    for (const phase of phases) {
      checkSpace(16);
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y - 4, contentW, 8, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(localPhaseTitle(phase.title), margin + 2, y + 1);
      y += 10;

      for (const item of phase.items) {
        const label = localItemLabel(item);
        const isItemNa = na.has(item.id);
        const isItemChecked = checked.has(item.id);
        const lines = doc.splitTextToSize(label, contentW - 12);
        checkSpace(lines.length * 5 + 3);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        if (isItemNa) {
          doc.setTextColor(150, 150, 150);
          doc.text("N/A", margin + 1, y);
          doc.text(lines, margin + 12, y);
        } else if (isItemChecked) {
          doc.setTextColor(...brandRgb);
          doc.text("\u2713", margin + 1, y);
          doc.setTextColor(50, 50, 50);
          if (item.critical) doc.setFont("helvetica", "bold");
          doc.text(lines, margin + 8, y);
        } else {
          doc.setTextColor(200, 200, 200);
          doc.text("\u25CB", margin + 1, y);
          doc.setTextColor(100, 100, 100);
          doc.text(lines, margin + 8, y);
        }
        y += lines.length * 5 + 2;
      }
      y += 4;
    }

    checkSpace(20);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(t("task.source"), margin, y + 6);

    doc.save(`ok-chantier-${taskId}-${now.toISOString().slice(0, 10)}.pdf`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, phases, checked, na, allItems, workerName, availableSites, selectedSiteId, taskId, locale, t]);

  function navigateToConfirm() {
    const selectedSite = availableSites.find((s) => s.id === selectedSiteId);
    const params = new URLSearchParams({
      items: String(allItems.length),
      checked: String(checked.size),
      na: String(na.size),
      worker: workerName.trim(),
    });
    if (selectedSite) params.set("site", selectedSite.name);
    router.push(`/confirm/${taskId}?${params.toString()}`);
  }

  function handleConfirm() {
    haptic(HAPTIC_ALL_DONE);
    if (uncheckedCritical.length > 0) {
      setShowCriticalWarning(true);
      return;
    }
    navigateToConfirm();
  }

  return (
    <div className="flex min-h-dvh flex-col pb-28 dark:bg-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 text-white sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white/70 transition-colors active:bg-white/10"
            aria-label={t("nav.back")}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight text-white">
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
              className="flex h-10 w-10 items-center justify-center rounded-lg text-red-300 transition-colors hover:bg-white/10 active:bg-white/10"
              aria-label={t("task.abandon")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-white/60">
          <span key={resolvedCount} className="inline-block animate-count-bump">{resolvedCount}</span> / {allItems.length} {t("task.verifications")}
        </p>
      </header>

      {/* Checklist */}
      <main className="flex-1 px-5 py-4 sm:px-8">
        {/* Site picker */}
        {availableSites.length > 0 && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm dark:bg-neutral-700 dark:text-neutral-400">
              <MapPin className="h-4 w-4" />
            </span>
            <select
              value={selectedSiteId}
              onChange={(e) => { setSelectedSiteId(e.target.value); setLastSiteId(e.target.value); }}
              className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium text-gray-700 outline-none dark:bg-neutral-800 dark:text-neutral-200 [&>option]:bg-white [&>option]:text-gray-700 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-neutral-200"
            >
              <option value="">{t("site.select")}</option>
              {availableSites.filter((s) => s.active !== false).map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}{site.address ? ` — ${site.address}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ACQ course banner — Travaux en hauteur only */}
        {taskId === "travaux-hauteur" && (
          <a
            href="https://www.acq.org/formations/repertoire-des-cours/cours/?id=15401&title=Sauvetage%20en%20hauteur%20-%20niveau%201"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 flex w-full items-center gap-3 rounded-xl bg-amber-50 p-4 transition-colors active:bg-amber-100 dark:bg-amber-950/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold text-amber-900 dark:text-amber-200">{t("task.acqCourseHeightTitle")}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">{t("task.acqCourseHeightDesc")}</p>
            </div>
            <svg className="h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleScanFile}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mb-5 flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:active:bg-neutral-700"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-400">
            <Camera className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-300">{t("task.scanPhoto")}</p>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-400 dark:bg-neutral-700 dark:text-neutral-500">
            Beta
          </span>
        </button>

        {phases.map((group, phaseIdx) => {
          const resolvedInPhase = group.items.filter((i) => isResolved(i.id)).length;
          const allPhaseResolved = resolvedInPhase === group.items.length;
          const isCollapsed = collapsed.has(group.phase);

          return (
            <section
              key={group.phase}
              className="mb-6 scroll-mt-36"
              ref={(el) => { if (el) phaseRefs.current.set(group.phase, el); }}
            >
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

              {!isCollapsed && (
                <div className="animate-fade-in grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[...group.items]
                    .sort((a, b) => (a.critical && !b.critical ? -1 : !a.critical && b.critical ? 1 : 0))
                    .map((item) => {
                    const isChecked = checked.has(item.id);
                    const isNa = na.has(item.id);
                    return (
                      <SwipeItem key={item.id} onSwipe={() => { if (!isChecked && !isNa) toggleCheck(item.id); }}>
                        <div
                          data-item-id={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleCheck(item.id)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCheck(item.id); } }}
                          className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                            isChecked
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                              : isNa
                                ? "border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/50"
                                : item.critical
                                  ? "animate-critical-pulse border-red-300 bg-red-50/50 ring-1 ring-red-200 hover:border-red-400 dark:border-red-700 dark:bg-red-950/40 dark:ring-red-800"
                                  : "border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-750 dark:active:bg-neutral-700"
                          }`}
                        >
                          <div
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
                          </div>
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
                          <div className="flex shrink-0 items-start gap-1.5">
                            {localItemInfo(item) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedInfo(expandedInfo === item.id ? null : item.id);
                                }}
                                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                                  expandedInfo === item.id
                                    ? "bg-gray-200 text-gray-700 dark:bg-neutral-600 dark:text-neutral-200"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-400"
                                }`}
                                aria-label="Info"
                              >
                                i
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleNa(item.id); }}
                              className={`mt-0.5 flex h-11 shrink-0 items-center justify-center rounded-full px-3.5 text-sm font-bold transition-colors ${
                                isNa
                                  ? "bg-gray-400 text-white dark:bg-neutral-500"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-400"
                              }`}
                              aria-label="N/A"
                            >
                              {t("task.na")}
                            </button>
                          </div>
                        </div>
                        {expandedInfo === item.id && localItemInfo(item) && (
                          <div className="mx-2 mt-1.5 rounded-lg bg-gray-100 px-3.5 py-2.5 text-sm text-gray-700 dark:bg-neutral-700 dark:text-neutral-300">
                            {linkifyPhones(localItemInfo(item))}
                          </div>
                        )}
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

      {/* AI Scan — fullscreen takeover */}
      {scanState !== "idle" && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          {scanPhoto && (
            <div className={`relative w-full overflow-hidden ${scanState === "done" ? "flex-shrink-0" : "flex-1"}`} style={scanState === "done" ? { height: "42dvh" } : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scanPhoto} alt="" className="h-full w-full object-cover" />

              {scanState === "scanning" && (
                <>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="animate-scan-grid absolute inset-0" />
                  <div className="animate-scan-line absolute inset-x-0 h-[2px]" style={{ filter: "drop-shadow(0 0 12px rgba(74,222,128,0.9))" }}>
                    <div className="h-full w-full bg-green-400" />
                    <div className="absolute inset-x-0 -bottom-6 h-12 bg-gradient-to-b from-green-400/25 to-transparent" />
                  </div>
                  <div className="absolute inset-5">
                    <div className="animate-scan-corner absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-green-400" />
                    <div className="animate-scan-corner absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-green-400" />
                    <div className="animate-scan-corner absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-green-400" />
                    <div className="animate-scan-corner absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-green-400" />
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-scan-pulse-ring h-20 w-20 rounded-full border border-green-400/50" />
                    <div className="absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 bg-green-400/60" />
                    <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 bg-green-400/60" />
                  </div>
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-5 pb-8 pt-[calc(env(safe-area-inset-top)+1rem)]">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                      <span className="font-heading text-xs font-bold uppercase tracking-widest text-green-400">{t("task.scanTitle")}</span>
                    </div>
                    <span className="font-mono text-[10px] text-green-400/60">AI VISION</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-10">
                    <p className="text-sm text-neutral-300">{t("task.scanning")}</p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-700">
                      <div className="h-full w-2/3 rounded-full bg-green-500" style={{ animation: "scan-line 2s ease-in-out infinite" }} />
                    </div>
                  </div>
                </>
              )}

              {scanState === "done" && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
                  {scanMarkers.map((m, i) => (
                    <div
                      key={i}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      <div
                        className="animate-risk-slide-in flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-500/40"
                        style={{ animationDelay: `${i * 200}ms` }}
                      >
                        {i + 1}
                      </div>
                      <div className="mt-0.5 h-3 w-0.5 bg-red-400/80" />
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {scanState === "done" && (
            <div className="flex-1 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-400">
                <AlertTriangle className="h-4 w-4" />
                {scanRisks.length} {t("task.scanDone")}
              </p>
              <ul className="space-y-2.5">
                {scanRisks.map((risk, i) => (
                  <li
                    key={i}
                    className="animate-risk-slide-in flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-[15px] leading-snug text-red-200"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">{i + 1}</span>
                    {risk}
                  </li>
                ))}
              </ul>
              <button
                onClick={closeScan}
                className="mt-5 w-full rounded-xl bg-green-500 py-3.5 font-heading text-sm font-bold text-black transition-colors active:bg-green-600"
              >
                {t("task.scanClose")}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
