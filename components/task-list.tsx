"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localTitle, localDesc } from "@/lib/locale-helpers";
import type { Task } from "@/lib/locale-helpers";
import { checklists } from "@/data/checklists";
import { getCustomChecklist } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";

interface TaskListProps {
  grouped: { category: string; label: string; tasks: Task[] }[];
}

export function TaskList({ grouped }: TaskListProps) {
  const { locale, t } = useLocale();

  if (grouped.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-heading text-lg font-semibold text-gray-400">{t("home.noResults")}</p>
        <p className="mt-1 text-sm text-muted">
          {t("home.noResultsHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(({ category, label, tasks: groupTasks }) => (
        <section key={category}>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
            {label}
          </h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {groupTasks.map((task) => {
              const cl = checklists[task.id] ?? getCustomChecklist(task.id);
              const totalPoints = cl ? cl.phases.flatMap((p) => p.items).length : 0;
              return (
                <Link
                  key={task.id}
                  href={`/app/tasks/${task.id}`}
                  className="flex min-h-[56px] items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400 active:border-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                    <TaskIcon taskId={task.id} iconName={task.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-semibold leading-tight">{localTitle(task, locale)}</p>
                    <p className="mt-0.5 text-sm text-muted">{localDesc(task, locale)}</p>
                    {totalPoints > 0 && (
                      <p className="mt-1 text-xs text-gray-400">{totalPoints} {t("home.points")}</p>
                    )}
                  </div>
                  <svg className="ml-auto h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
