"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localTitle } from "@/lib/locale-helpers";
import type { Task } from "@/lib/locale-helpers";
import { TaskIcon } from "@/components/task-icon";

interface ActiveTasksProps {
  activeTasks: { task: Task; checked: number; total: number }[];
  onAbandon: (taskId: string) => void;
}

export function ActiveTasks({ activeTasks, onAbandon }: ActiveTasksProps) {
  const { locale, t } = useLocale();

  return (
    <section className="mb-6">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
        {t("home.ongoing")}
      </h2>
      <div className="flex flex-col gap-3">
        {activeTasks.map(({ task, checked, total }, i) => (
          <div key={task.id} className="animate-slide-in-up relative" style={{ animationDelay: `${i * 80}ms` }}>
            <Link
              href={`/tasks/${task.id}?resume=1`}
              className="flex items-center gap-4 rounded-2xl border-2 border-green-200 bg-green-50 p-4 transition-colors hover:border-green-300 active:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:hover:border-green-700"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm dark:bg-green-900 dark:text-green-300">
                <TaskIcon taskId={task.id} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="font-heading text-base font-bold leading-tight text-green-900 dark:text-green-200">
                  {localTitle(task, locale)}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-green-200">
                    <div
                      className="h-full rounded-full bg-green-600 transition-all"
                      style={{ width: `${(checked / total) * 100}%` }}
                    />
                  </div>
                  <p className="shrink-0 text-sm font-medium text-green-700 dark:text-green-400">
                    {checked}/{total}
                  </p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => onAbandon(task.id)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow-sm transition-colors hover:bg-white hover:text-red-500"
              aria-label={t("home.abandon")}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
