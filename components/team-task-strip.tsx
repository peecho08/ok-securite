"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localTitle, localDesc } from "@/lib/locale-helpers";
import type { Task } from "@/lib/locale-helpers";
import { checklists } from "@/data/checklists";
import { TaskIcon } from "@/components/task-icon";
import { getTeamName } from "@/lib/storage";

interface TeamTaskStripProps {
  tasks: (Task | undefined)[];
}

export function TeamTaskStrip({ tasks: tasksProp }: TeamTaskStripProps) {
  const { locale, t } = useLocale();
  const tasks = tasksProp.filter((task): task is Task => task != null);
  const teamName = typeof window !== "undefined" ? getTeamName() : "";

  if (tasks.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          {teamName || t("home.myTasks")}
        </h2>
      </div>
      <div className="relative">
        <div className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1">
          {tasks.map((task) => {
            const cl = checklists[task.id];
            const totalPoints = cl ? cl.phases.flatMap((p) => p.items).length : 0;
            return (
              <Link
                key={task.id}
                href={`/app/tasks/${task.id}`}
                className="flex w-64 shrink-0 items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400 active:border-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                  <TaskIcon taskId={task.id} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-base font-semibold leading-tight">{localTitle(task, locale)}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">{localDesc(task, locale)}</p>
                  {totalPoints > 0 && (
                    <p className="mt-1 text-xs text-gray-400">{totalPoints} {t("home.points")}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-white via-white/60 to-transparent dark:from-neutral-900 dark:via-neutral-900/60"
          aria-hidden
        />
      </div>
    </section>
  );
}
