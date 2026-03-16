"use client";

import { useEffect, useMemo, useState } from "react";
import { getHistory } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";
import { X } from "lucide-react";

const DISMISSED_KEY = "okchantier:recap-dismissed-week";

function getISOWeek(d: Date): string {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${date.getFullYear()}-W${weekNum}`;
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === getISOWeek(new Date());
  } catch {
    return false;
  }
}

function dismiss(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, getISOWeek(new Date()));
  } catch { /* ignore */ }
}

interface WeeklyRecapProps {
  mode?: "worker" | "supervisor";
  serverHistory?: { completedAt: string; checkedCount: number; workerName?: string }[];
}

export function WeeklyRecap({ mode = "worker", serverHistory }: WeeklyRecapProps) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() + mondayOffset);

    const entries = serverHistory ?? getHistory();
    const weekEntries = entries.filter((e) => new Date(e.completedAt) >= monday);
    if (weekEntries.length === 0) return null;

    const totalItems = weekEntries.reduce((sum, e) => sum + (e.checkedCount || 0), 0);
    const uniqueWorkers = new Set(weekEntries.map((e) => e.workerName).filter(Boolean));

    return {
      completions: weekEntries.length,
      items: totalItems,
      workers: uniqueWorkers.size,
    };
  }, [serverHistory]);

  useEffect(() => {
    if (stats && !isDismissed()) setVisible(true);
  }, [stats]);

  if (!visible || !stats) return null;

  return (
    <section className="animate-fade-in relative mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-4 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-800">
      <button
        type="button"
        onClick={() => { dismiss(); setVisible(false); }}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors active:bg-gray-100 dark:text-neutral-500 dark:active:bg-neutral-700"
        aria-label={t("a11y.closeDialog")}
      >
        <X className="h-4 w-4" />
      </button>
      <h3 className="font-heading text-sm font-bold text-gray-700 dark:text-neutral-200">
        {t("recap.title")}
      </h3>
      <div className="mt-3 flex gap-4">
        <div className="text-center">
          <p className="font-heading text-2xl font-bold text-primary">{stats.completions}</p>
          <p className="text-[11px] text-muted">{t("recap.completions")}</p>
        </div>
        <div className="text-center">
          <p className="font-heading text-2xl font-bold text-gray-800 dark:text-neutral-100">{stats.items}</p>
          <p className="text-[11px] text-muted">{t("recap.itemsChecked")}</p>
        </div>
        {mode === "supervisor" && stats.workers > 0 && (
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-gray-800 dark:text-neutral-100">{stats.workers}</p>
            <p className="text-[11px] text-muted">{t("recap.workers")}</p>
          </div>
        )}
      </div>
      <p className="mt-2.5 text-xs text-muted">
        {t("recap.encouragement")}
      </p>
    </section>
  );
}
