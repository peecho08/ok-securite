"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { checklists } from "@/data/checklists";
import { checklistItemsEn, phaseTitlesEn } from "@/data/checklists-en";
import { tasks } from "@/data/tasks";
import { getHistoryEntry, type HistoryEntry } from "@/lib/storage";
import { mergePhases } from "@/lib/locale-helpers";
import { TaskIcon } from "@/components/task-icon";
import { useLocale } from "@/lib/i18n";
import { ArrowLeft, MapPin, Check, FileText, ImageIcon } from "lucide-react";

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t } = useLocale();
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = getHistoryEntry(id);
    if (local) {
      setEntry(local);
      setLoading(false);
      return;
    }
    fetch(`/api/history/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setEntry(data as HistoryEntry);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const task = entry ? tasks.find((t) => t.id === entry.taskId) : null;
  const rawChecklist = entry ? checklists[entry.taskId] : null;
  const phases = useMemo(
    () => (rawChecklist ? mergePhases(rawChecklist.phases) : []),
    [rawChecklist],
  );

  const localTitle = (t: (typeof tasks)[number]) =>
    locale === "en" && t.titleEn ? t.titleEn : t.title;
  const localItemLabel = (item: { id: string; label: string }) =>
    locale === "en" && checklistItemsEn[item.id]
      ? checklistItemsEn[item.id].label
      : item.label;
  const localPhaseTitle = (title: string) =>
    locale === "en" && phaseTitlesEn[title] ? phaseTitlesEn[title] : title;

  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";

  if (loading) return null;

  if (!entry) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center dark:bg-neutral-900">
        <p className="font-heading text-lg font-semibold">
          {t("history.detail.notFound")}
        </p>
        <Link href="/app" className="mt-4 text-sm text-muted underline">
          {t("task.backHome")}
        </Link>
      </div>
    );
  }

  const displayTitle = task ? localTitle(task) : entry.taskTitle;
  const completedDate = new Date(entry.completedAt);
  const dateStr = completedDate.toLocaleDateString(dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = completedDate.toLocaleTimeString(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label={t("nav.back")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight">
              {displayTitle}
            </h1>
            <p className="text-xs text-muted">{dateStr}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-5 sm:px-8">
        {/* Summary card */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          {entry.workerName && (
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-700">
              <span className="text-sm text-muted">
                {t("history.detail.worker")}
              </span>
              <span className="font-heading text-sm font-semibold">
                {entry.workerName}
              </span>
            </div>
          )}
          {entry.workerCompany && (
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-700">
              <span className="text-sm text-muted">
                {t("history.detail.company")}
              </span>
              <span className="text-sm font-medium">
                {entry.workerCompany}
              </span>
            </div>
          )}
          {(entry.siteName || entry.location) && (
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-700">
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {t("history.detail.site")}
              </span>
              <span className="max-w-[60%] text-right text-sm font-medium">
                {entry.siteName || entry.location}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-700">
            <span className="text-sm text-muted">
              {t("history.detail.date")}
            </span>
            <span className="text-sm font-medium">{timeStr}</span>
          </div>
          <div className={`flex items-center justify-between px-4 py-3 ${entry.notes || entry.imageUrl ? "border-b border-gray-100 dark:border-neutral-700" : ""}`}>
            <span className="text-sm text-muted">
              {t("history.detail.status")}
            </span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-dark dark:bg-primary/20 dark:text-primary">
              {entry.checkedCount}/{entry.totalCount}
            </span>
          </div>
          {entry.notes && (
            <div className={`px-4 py-3 ${entry.imageUrl ? "border-b border-gray-100 dark:border-neutral-700" : ""}`}>
              <span className="mb-1 flex items-center gap-1.5 text-sm text-muted">
                <FileText className="h-3.5 w-3.5" />
                {t("history.detail.notes")}
              </span>
              <p className="whitespace-pre-wrap text-sm">{entry.notes}</p>
            </div>
          )}
          {entry.imageUrl && (
            <div className="px-4 py-3">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm text-muted">
                <ImageIcon className="h-3.5 w-3.5" />
                {t("history.detail.photo")}
              </span>
              <img src={entry.imageUrl} alt="" className="w-full rounded-lg object-cover" style={{ maxHeight: 300 }} />
            </div>
          )}
        </div>

        {/* Checklist items */}
        {phases.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
              {t("history.detail.checklist")}
            </h2>
            {phases.map((group) => (
              <section key={group.phase} className="mb-4">
                <p className="mb-2 font-heading text-sm font-semibold text-muted">
                  {localPhaseTitle(group.title)}
                </p>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2.5 rounded-lg bg-primary/5 px-3 py-2 dark:bg-primary/10"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-primary" />
                      <span className="text-sm text-primary-dark dark:text-primary">
                        {localItemLabel(item)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
