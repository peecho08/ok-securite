"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { addHistory, clearProgress } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export default function ConfirmPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const searchParams = useSearchParams();
  const { locale, t } = useLocale();

  const items = Number(searchParams.get("items")) || 0;
  const checkedCount = Number(searchParams.get("checked")) || 0;
  const workerName = searchParams.get("worker") || "";

  const task = tasks.find((t) => t.id === taskId);
  const allDone = items > 0 && checkedCount === items;
  const [saved, setSaved] = useState(false);
  const [notified, setNotified] = useState(false);

  const localTitle = (task: (typeof tasks)[number]) =>
    locale === "en" && task.titleEn ? task.titleEn : task.title;

  const now = useMemo(() => new Date(), []);
  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";
  const timestamp = now.toLocaleDateString(dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (!task || saved) return;
    addHistory({
      taskId,
      taskTitle: locale === "en" && task.titleEn ? task.titleEn : task.title,
      taskIcon: task.icon,
      workerName,
      checkedCount,
      totalCount: items,
      completedAt: now.toISOString(),
    });
    if (allDone) clearProgress(taskId);
    setSaved(true);
  }, [task, taskId, workerName, checkedCount, items, allDone, now, saved, locale]);

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
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
        <div
          className={`flex h-48 w-48 items-center justify-center rounded-full sm:h-56 sm:w-56 ${
            allDone ? "animate-stamp bg-green-100" : "bg-amber-100"
          }`}
        >
          {allDone ? (
            <Image
              src="/ok.svg"
              alt="OK"
              width={94}
              height={49}
              className="h-20 w-auto sm:h-24"
            />
          ) : (
            <AlertTriangle className="h-20 w-20 text-amber-600 sm:h-24 sm:w-24" />
          )}
        </div>

        <div className="animate-confirm-content">
          <h1 className="mt-6 text-2xl font-bold">
            {allDone ? t("confirm.complete") : t("confirm.incomplete")}
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2 text-muted">
            <TaskIcon taskId={taskId} className="h-5 w-5" />
            <span className="text-sm">{localTitle(task)}</span>
          </div>
        </div>

        {/* Summary card */}
        <div className="animate-confirm-card mt-8 w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          {workerName && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-muted">{t("confirm.worker")}</span>
              <span className="font-heading font-bold">{workerName}</span>
            </div>
          )}
          <div className={`flex items-center justify-between ${workerName ? "border-b border-gray-100 py-3" : "border-b border-gray-100 pb-3"}`}>
            <span className="text-sm text-muted">{t("confirm.pointsChecked")}</span>
            <span className="font-heading font-bold">
              {checkedCount} / {items}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-muted">{t("confirm.status")}</span>
            <span
              className={`font-heading rounded-md px-2 py-0.5 text-xs font-semibold ${
                allDone ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {allDone ? t("confirm.statusComplete") : t("confirm.statusIncomplete")}
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

        {allDone && (
          <p className="animate-confirm-card mt-4 text-sm text-muted">
            {t("confirm.wellDone")}
          </p>
        )}
      </main>

      <div className="animate-confirm-footer border-t border-gray-100 px-5 py-4 dark:border-neutral-800 sm:px-8">
        {allDone && !notified && (
          <button
            onClick={async () => {
              const taskTitle = localTitle(task);
              const summary = [
                t("confirm.shareChecklist").replace("{task}", taskTitle),
                workerName ? t("confirm.shareWorker").replace("{name}", workerName) : "",
                t("confirm.sharePoints").replace("{checked}", String(checkedCount)).replace("{total}", String(items)),
                `${timestamp} à ${time}`,
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
                setNotified(true);
              }
            }}
            className="mb-3 w-full rounded-xl bg-[#118914] py-3.5 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#0e7511] active:bg-[#0e7511]"
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
        <div className="flex gap-3">
          <Link
            href="/"
            className="block flex-1 rounded-xl border-2 border-black py-3.5 text-center font-heading text-sm font-bold transition-colors active:bg-gray-50 dark:border-neutral-300 dark:text-neutral-100"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/history"
            className="block flex-1 rounded-xl border-2 border-gray-300 py-3.5 text-center font-heading text-sm font-bold text-gray-600 transition-colors active:bg-gray-50"
          >
            {t("nav.history")}
          </Link>
        </div>
      </div>
    </div>
  );
}
