"use client";

import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { getWorkerName } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { usePlan } from "@/lib/hooks/use-plan";
import { UpgradeBanner } from "@/components/upgrade-banner";

function StatCard({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-primary/20 bg-primary/5 dark:border-primary/25 dark:bg-primary/10" : "border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"}`}>
      <p className={`font-heading text-3xl font-bold ${accent ? "text-primary dark:text-primary" : "text-gray-900 dark:text-neutral-100"}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function getDayLabels(locale: string): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    labels.push(d.toLocaleDateString(locale === "en" ? "en-CA" : "fr-FR", { weekday: "short" }));
  }
  return labels;
}

function getRecentDates(locale: string): string[] {
  const now = new Date();
  const loc = locale === "en" ? "en-CA" : "fr-FR";
  return [0, 0, 1, 1, 2, 3, 4].map((daysAgo) => {
    const d = new Date(now.getTime() - daysAgo * 86400000);
    const hours = [7, 10, 8, 14, 9, 7, 11];
    d.setHours(hours[daysAgo] ?? 8, Math.floor(Math.random() * 40 + 10), 0, 0);
    return d.toLocaleDateString(loc, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  });
}

export default function DashboardPage() {
  const { locale, t } = useLocale();
  const { dashboard, loading } = usePlan();

  const currentUser = (typeof window !== "undefined" ? getWorkerName() : "") || "Claude";
  const dayLabels = getDayLabels(locale);
  const recentDates = getRecentDates(locale);

  const weekDays = [
    { label: dayLabels[0], count: 2 },
    { label: dayLabels[1], count: 3 },
    { label: dayLabels[2], count: 1 },
    { label: dayLabels[3], count: 4 },
    { label: dayLabels[4], count: 2 },
    { label: dayLabels[5], count: 3 },
    { label: dayLabels[6], count: 2 },
  ];
  const weekMax = 4;

  const topWorkers = [
    { name: currentUser, count: 14 },
    { name: "Marc-Antoine", count: 12 },
    { name: "Stéphane", count: 11 },
    { name: "Jean-Pierre", count: 10 },
    { name: "Luc", count: 9 },
    { name: "Patrick", count: 8 },
    { name: "Éric", count: 7 },
    { name: "François", count: 6 },
    { name: "Mathieu", count: 4 },
    { name: "Sébastien", count: 3 },
  ];

  const recentActivity = [
    { taskId: "coffrage", title: locale === "en" ? "Formwork" : "Coffrage", icon: "🪵", worker: currentUser, time: recentDates[0] },
    { taskId: "electricite", title: locale === "en" ? "Electrical" : "Électricité", icon: "⚡", worker: "Marc-Antoine", time: recentDates[1] },
    { taskId: "echafaudage", title: locale === "en" ? "Scaffolding" : "Échafaudage", icon: "🏗️", worker: "Stéphane", time: recentDates[2] },
    { taskId: "soudage", title: locale === "en" ? "Welding / Cutting" : "Soudage / Coupage", icon: "🔥", worker: currentUser, time: recentDates[3] },
    { taskId: "terrassement", title: locale === "en" ? "Earthwork / Excavation" : "Terrassement / Excavation", icon: "⛏️", worker: "Jean-Pierre", time: recentDates[4] },
  ];

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label={t("nav.back")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">{t("dashboard.title")}</h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 sm:px-8">
        {!loading && !dashboard ? (
          <div className="py-12">
            <UpgradeBanner messageKey="upgrade.dashboard" />
          </div>
        ) : (
        <div className="space-y-6">
          {/* Top stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={84} label={t("dashboard.completedTotal")} accent />
            <StatCard value={17} label={t("dashboard.completedWeek")} />
          </div>

          {/* Weekly activity */}
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.weeklyActivity")}</h2>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-5 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-end gap-3" style={{ height: 120 }}>
                {weekDays.map((day, i) => {
                  const pct = Math.max((day.count / weekMax) * 100, 8);
                  const isToday = i === 6;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 dark:text-neutral-200">{day.count}</span>
                      <div className="flex w-full justify-center" style={{ height: 80 }}>
                        <div className="flex w-full max-w-[28px] items-end">
                          <div
                            className={`animate-bar-grow w-full rounded-md ${
                              isToday ? "bg-primary" : "bg-primary/60"
                            }`}
                            style={{ height: `${pct}%`, animationDelay: `${i * 0.08}s` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-3">
                {weekDays.map((day, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className={`text-[10px] uppercase ${i === 6 ? "font-bold text-primary" : "text-muted"}`}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top workers */}
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.topWorkers")}</h2>
            <div className="space-y-2">
              {topWorkers.map((worker, i) => (
                <div
                  key={worker.name}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${
                    i === 0 ? "bg-green-100 text-green-700" : i === 1 ? "bg-gray-200 text-gray-600" : i === 2 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 font-heading text-sm font-semibold">
                    {worker.name}
                    {i === 0 && <span className="ml-1.5 text-xs font-normal text-muted">({t("dashboard.you")})</span>}
                  </span>
                  <span className="text-sm text-muted">{worker.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.recentActivity")}</h2>
            <div className="space-y-2">
              {recentActivity.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                    <TaskIcon taskId={entry.taskId} className="h-5 w-5" fallback={entry.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-semibold leading-tight">{entry.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{entry.time} — {entry.worker}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-heading text-[10px] font-semibold text-primary-dark">
                    ✓
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
}
