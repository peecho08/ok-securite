"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { checklists } from "@/data/checklists";
import { checklistItemsEn, phaseTitlesEn } from "@/data/checklists-en";
import { tasks } from "@/data/tasks";
import { addHistory, clearProgress, loadProgress } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import { mergePhases } from "@/lib/locale-helpers";
import { TaskIcon } from "@/components/task-icon";
import { Download } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";

export default function ConfirmPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const searchParams = useSearchParams();
  const { locale, t } = useLocale();
  const { acqColors } = useTheme();

  const rawChecklist = checklists[taskId as string];
  const phases = useMemo(() => rawChecklist ? mergePhases(rawChecklist.phases) : [], [rawChecklist]);
  const allItems = useMemo(() => phases.flatMap((p) => p.items), [phases]);
  const items = allItems.length;

  const [progressLoaded, setProgressLoaded] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [naIds, setNaIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const data = loadProgress(taskId as string);
    setCheckedIds(new Set(data.checked));
    setNaIds(new Set(data.na));
    setProgressLoaded(true);
  }, [taskId]);

  const checkedCount = checkedIds.size;
  const naCount = naIds.size;

  const workerName = searchParams.get("worker") || "";
  const siteName = searchParams.get("site") || "";

  const task = tasks.find((t) => t.id === taskId);
  const [saved, setSaved] = useState(false);
  const [notified, setNotified] = useState(false);
  const [geoAddress, setGeoAddress] = useState("");
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": locale } },
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            const parts = [
              addr?.road,
              addr?.city || addr?.town || addr?.village,
            ].filter(Boolean);
            setGeoAddress(parts.join(", ") || data.display_name?.split(",").slice(0, 3).join(",") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } else {
            setGeoAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch {
          setGeoAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setGeoLoading(false);
      },
      () => { setGeoLoading(false); },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, [locale]);

  const locationLabel = siteName || geoAddress;
  const locationLoading = !siteName && geoLoading;

  const localTitle = (task: (typeof tasks)[number]) =>
    locale === "en" && task.titleEn ? task.titleEn : task.title;
  const localItemLabel = (item: { id: string; label: string }) =>
    locale === "en" && checklistItemsEn[item.id] ? checklistItemsEn[item.id].label : item.label;
  const localPhaseTitle = (title: string) =>
    locale === "en" && phaseTitlesEn[title] ? phaseTitlesEn[title] : title;

  const now = useMemo(() => new Date(), []);
  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";
  const timestamp = now.toLocaleDateString(dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" });

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

    const brandRgb: [number, number, number] = acqColors ? [248, 164, 27] : [17, 137, 20];
    doc.setFillColor(...brandRgb);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("OK Chantier", margin, 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(localTitle(task), margin, 28);
    doc.setFontSize(9);
    doc.text(`${timestamp} — ${time}`, margin, 35);
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
    if (locationLabel) {
      const locLabelKey = siteName ? t("confirm.site") : t("confirm.location");
      doc.setFont("helvetica", "bold");
      doc.text(`${locLabelKey}: `, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(locationLabel, margin + 30, y);
      y += 7;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`${t("confirm.status")}: `, margin, y);
    doc.setFont("helvetica", "normal");
    const statusDetail = naCount > 0
      ? `${t("confirm.statusComplete")}  (${checkedCount} ${t("confirm.checked")}, ${naCount} ${t("confirm.na")})`
      : `${t("confirm.statusComplete")}  (${items}/${items})`;
    doc.text(statusDetail, margin + 30, y);
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
        const isItemNa = naIds.has(item.id);
        const lines = doc.splitTextToSize(label, contentW - 12);
        checkSpace(lines.length * 5 + 3);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        if (isItemNa) {
          doc.setTextColor(150, 150, 150);
          doc.text("N/A", margin + 1, y);
          doc.text(lines, margin + 12, y);
        } else {
          doc.setTextColor(...brandRgb);
          doc.text("\u2713", margin + 1, y);
          doc.setTextColor(50, 50, 50);
          if (item.critical) doc.setFont("helvetica", "bold");
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

    const filename = `ok-chantier-${taskId}-${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, phases, checkedIds, naIds, checkedCount, naCount, items, workerName, timestamp, time, taskId, now, locale, t, acqColors, locationLabel, siteName]);

  useEffect(() => {
    if (!task || saved || !progressLoaded || geoLoading) return;
    addHistory({
      taskId,
      taskTitle: locale === "en" && task.titleEn ? task.titleEn : task.title,
      taskIcon: task.icon,
      workerName,
      checkedCount: items,
      totalCount: items,
      completedAt: now.toISOString(),
      siteName: siteName || undefined,
      location: geoAddress || undefined,
    });
    setSaved(true);
  }, [task, taskId, workerName, items, now, saved, progressLoaded, locale, siteName, geoAddress, geoLoading]);

  function handleFinish() {
    clearProgress(taskId as string);
  }

  if (!task) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold">{t("task.notFound")}</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">
          {t("task.backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <div className="px-5 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-8">
        <Link
          href={`/tasks/${taskId}?resume=1`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors active:text-gray-600 dark:text-neutral-500 dark:active:text-neutral-300"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("confirm.backToChecklist")}
        </Link>
      </div>
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
        <div className="flex h-48 w-48 animate-stamp items-center justify-center rounded-full bg-green-100 sm:h-56 sm:w-56">
          <Image
            src="/ok.svg"
            alt="OK"
            width={94}
            height={49}
            className="acq-logo h-20 w-auto sm:h-24"
          />
        </div>

        <div className="animate-confirm-content">
          <h1 className="mt-6 text-2xl font-bold">
            {t("confirm.complete")}
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2 text-muted">
            <TaskIcon taskId={taskId} className="h-5 w-5" />
            <span className="text-sm">{localTitle(task)}</span>
          </div>
        </div>

        <div className="animate-confirm-card mt-8 w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          {workerName && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-muted">{t("confirm.worker")}</span>
              <span className="font-heading font-bold">{workerName}</span>
            </div>
          )}
          {siteName && (
            <div className={`flex items-center justify-between border-b border-gray-100 ${workerName ? "py-3" : "pb-3"}`}>
              <span className="text-sm text-muted">{t("confirm.site")}</span>
              <span className="max-w-[60%] text-right text-sm font-medium">{siteName}</span>
            </div>
          )}
          {geoAddress && (
            <div className={`flex items-center justify-between border-b border-gray-100 ${workerName || siteName ? "py-3" : "pb-3"}`}>
              <span className="text-sm text-muted">{t("confirm.location")}</span>
              <span className="max-w-[60%] text-right text-sm font-medium">{geoAddress}</span>
            </div>
          )}
          <div className={`flex items-center justify-between ${workerName || siteName || geoAddress ? "border-b border-gray-100 py-3" : "border-b border-gray-100 pb-3"}`}>
            <span className="text-sm text-muted">{t("confirm.pointsChecked")}</span>
            <span className="font-heading font-bold">
              {naCount > 0
                ? `${checkedCount} ${t("confirm.checked")}, ${naCount} ${t("confirm.na")}`
                : `${items} / ${items}`
              }
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-muted">{t("confirm.status")}</span>
            <span className="font-heading rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
              {t("confirm.statusComplete")}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-sm text-muted">{t("confirm.date")}</span>
            <span className="text-right text-sm font-medium">
              {timestamp}
              <br />
              <span className="text-muted">{time}</span>
            </span>
          </div>
        </div>

        <p className="animate-confirm-card mt-4 text-sm text-muted">
          {t("confirm.wellDone")}
        </p>
      </main>

      <div className="animate-confirm-footer border-t border-gray-100 px-5 py-4 dark:border-neutral-800 sm:px-8">
        {!notified && (
          <button
            onClick={async () => {
              const taskTitle = localTitle(task);
              const locLine = locationLabel
                ? `${siteName ? t("confirm.site") : t("confirm.location")}: ${locationLabel}`
                : "";
              const summary = [
                t("confirm.shareChecklist").replace("{task}", taskTitle),
                workerName ? t("confirm.shareWorker").replace("{name}", workerName) : "",
                locLine,
                naCount > 0
                  ? `${checkedCount} ${t("confirm.checked")}, ${naCount} ${t("confirm.na")} / ${items}`
                  : t("confirm.sharePoints").replace("{checked}", String(items)).replace("{total}", String(items)),
                `${timestamp} — ${time}`,
                "",
                t("confirm.shareVia"),
              ].filter(Boolean).join("\n");
              try {
                if (navigator.share) {
                  await navigator.share({ title: t("confirm.shareTitle").replace("{task}", taskTitle), text: summary });
                  setNotified(true);
                } else {
                  await navigator.clipboard.writeText(summary);
                  setNotified(true);
                }
              } catch {
                /* user cancelled share — do nothing */
              }
            }}
            className="mb-3 w-full rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)]"
          >
            {t("confirm.notify")}
          </button>
        )}
        {notified && (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3.5 text-sm font-medium text-green-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t("confirm.notified")}
          </div>
        )}
        <button
          onClick={generatePdf}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-800 py-3.5 font-heading text-sm font-bold tracking-wide transition-colors active:bg-gray-100 dark:border-neutral-300 dark:text-neutral-100 dark:active:bg-neutral-700"
        >
          <Download className="h-4 w-4" />
          {t("confirm.downloadPdf")}
        </button>
        <Link
          href="/"
          onClick={handleFinish}
          className="block w-full py-3.5 text-center text-sm font-medium text-gray-500 transition-colors active:text-gray-700 dark:text-neutral-400 dark:active:text-neutral-200"
        >
          {t("nav.home")}
        </Link>
      </div>
    </div>
  );
}
