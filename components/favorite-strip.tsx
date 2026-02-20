"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { localTitle } from "@/lib/locale-helpers";
import type { Task } from "@/lib/locale-helpers";
import { TaskIcon } from "@/components/task-icon";

interface FavoriteStripProps {
  tasks: (Task | undefined)[];
  onEdit: () => void;
}

export function FavoriteStrip({ tasks: tasksProp, onEdit }: FavoriteStripProps) {
  const { locale, t } = useLocale();
  const tasks = tasksProp.filter((task): task is Task => task != null);

  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          {t("home.favorites")}
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          {t("home.edit")}
        </button>
      </div>
      <div className="relative">
        <div className="flex gap-2.5 overflow-x-auto scroll-smooth pb-1">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="flex min-h-[48px] shrink-0 items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <TaskIcon taskId={task.id} className="h-5 w-5 text-gray-500" />
              <span className="font-heading text-sm font-semibold">{localTitle(task, locale)}</span>
            </Link>
          ))}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-white via-white/60 to-transparent dark:from-neutral-900 dark:via-neutral-900/60"
          aria-hidden
        />
      </div>
    </section>
  );
}
