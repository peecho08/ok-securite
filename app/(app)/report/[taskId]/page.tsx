"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { getWorkerName } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const severityOptions = [
  { value: "observation", labelKey: "report.observation", color: "bg-blue-100 text-blue-800" },
  { value: "presquaccident", labelKey: "report.nearMiss", color: "bg-amber-100 text-amber-800" },
  { value: "incident", labelKey: "report.incident", color: "bg-red-100 text-red-800" },
];

export default function ReportPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const { locale, t } = useLocale();
  const task = tasks.find((t) => t.id === taskId);

  const localTitle = (task: (typeof tasks)[number]) =>
    locale === "en" && task.titleEn ? task.titleEn : task.title;

  const [severity, setSeverity] = useState("observation");
  const [description, setDescription] = useState("");
  const [reporter, setReporter] = useState(() => getWorkerName());
  const [submitted, setSubmitted] = useState(false);

  if (!task) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold">{t("task.notFound")}</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">{t("report.back")}</Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const report = {
      taskId,
      taskTitle: localTitle(task!),
      severity,
      description,
      reporter,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("okchantier:reports") || "[]");
      existing.unshift(report);
      localStorage.setItem("okchantier:reports", JSON.stringify(existing.slice(0, 50)));
    } catch { /* ignore */ }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardCheck className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">{t("report.saved")}</h1>
        <p className="mt-2 text-sm text-muted">
          {t("report.savedDetail")}
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href={`/tasks/${taskId}`}
            className="rounded-xl border-2 border-gray-300 px-5 py-3 font-heading text-sm font-bold transition-colors active:bg-gray-50 dark:border-neutral-600 dark:text-neutral-100 dark:active:bg-neutral-700"
          >
            {t("report.back")}
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-primary px-5 py-3 font-heading text-sm font-bold text-white transition-colors active:bg-primary-dark dark:bg-primary dark:text-white dark:active:bg-primary-dark"
          >
            {t("nav.home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label={t("report.back")}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">{t("report.title")}</h1>
        </div>
        <p className="mt-1 text-xs text-muted">{localTitle(task)}</p>
      </header>

      <main className="flex-1 px-5 py-4 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Severity */}
          <div>
            <label className="mb-2 block font-heading text-sm font-semibold">{t("report.severity")}</label>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSeverity(opt.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    severity === opt.value
                      ? `${opt.color} ring-2 ring-offset-1 ring-gray-400 dark:ring-neutral-500 dark:ring-offset-neutral-900`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="desc" className="mb-2 block font-heading text-sm font-semibold">
              {t("report.description")}
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("report.descriptionPlaceholder")}
              rows={4}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
            />
          </div>

          {/* Reporter */}
          <div>
            <label htmlFor="reporter" className="mb-2 block font-heading text-sm font-semibold">
              {t("report.reporter")}
            </label>
            <input
              id="reporter"
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              placeholder={t("report.reporterPlaceholder")}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700"
            />
          </div>

          {/* Timestamp */}
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-muted dark:bg-neutral-800">
            {t("report.datetime")} {new Date().toLocaleString(locale === "en" ? "en-CA" : "fr-FR")}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:bg-red-700 active:bg-red-700"
          >
            {t("report.submit")}
          </button>
        </form>
      </main>
    </div>
  );
}
