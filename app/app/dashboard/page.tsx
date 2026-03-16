"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { TaskIcon } from "@/components/task-icon";
import { usePlan } from "@/lib/hooks/use-plan";
import { UpgradeBanner } from "@/components/upgrade-banner";

interface ActivityEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  taskIcon: string | null;
  workerName: string | null;
  siteName: string | null;
  completedAt: string;
  checkedCount: number;
  totalCount: number;
}

interface DashboardData {
  recentActivity: ActivityEntry[];
  totalCompleted: number;
  weekCompleted: number;
  topWorkers: { name: string; count: number }[];
  weekDays: { date: string; count: number }[];
}

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

function formatDayLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(locale === "en" ? "en-CA" : "fr-FR", { weekday: "short" });
}

function formatActivityTime(iso: string, locale: string): string {
  const d = new Date(iso);
  const loc = locale === "en" ? "en-CA" : "fr-FR";
  return d.toLocaleDateString(loc, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function DashboardPage() {
  const { locale, t } = useLocale();
  const { dashboard, loading: planLoading } = usePlan();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const weekMax = data ? Math.max(...data.weekDays.map((d) => d.count), 1) : 1;
  const hasData = data && data.totalCompleted > 0;

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
          <h1 className="text-lg font-bold">{t("dashboard.title")}</h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 sm:px-8">
        {!planLoading && !dashboard ? (
          <div className="py-12">
            <UpgradeBanner messageKey="upgrade.dashboard" />
          </div>
        ) : loading || planLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : !hasData ? (
          <div className="py-16 text-center">
            <p className="font-heading text-lg font-semibold">{t("dashboard.noData")}</p>
            <p className="mt-2 text-sm text-muted">{t("dashboard.noDataHint")}</p>
          </div>
        ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={data.totalCompleted} label={t("dashboard.completedTotal")} accent />
            <StatCard value={data.weekCompleted} label={t("dashboard.completedWeek")} />
          </div>

          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.weeklyActivity")}</h2>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-5 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-end gap-3" style={{ height: 120 }}>
                {data.weekDays.map((day, i) => {
                  const pct = Math.max((day.count / weekMax) * 100, 8);
                  const isToday = i === data.weekDays.length - 1;
                  return (
                    <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
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
                {data.weekDays.map((day, i) => (
                  <div key={day.date} className="flex-1 text-center">
                    <span className={`text-[10px] uppercase ${i === data.weekDays.length - 1 ? "font-bold text-primary" : "text-muted"}`}>
                      {formatDayLabel(day.date, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {data.topWorkers.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.topWorkers")}</h2>
            <div className="space-y-2">
              {data.topWorkers.map((worker, i) => (
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
                  </span>
                  <span className="text-sm text-muted">{worker.count}</span>
                </div>
              ))}
            </div>
          </section>
          )}

          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{t("dashboard.recentActivity")}</h2>
            <div className="space-y-2">
              {data.recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                    <TaskIcon taskId={entry.taskId} className="h-5 w-5" fallback={entry.taskIcon ?? undefined} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-semibold leading-tight">{entry.taskTitle}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatActivityTime(entry.completedAt, locale)}
                      {entry.workerName ? ` — ${entry.workerName}` : ""}
                      {entry.siteName ? ` · ${entry.siteName}` : ""}
                    </p>
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
