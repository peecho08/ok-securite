"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { getCustomTasks, getCustomChecklist, deleteCustomTask } from "@/lib/storage";
import type { Task } from "@/types";
import { TaskIcon } from "@/components/task-icon";
import { ArrowLeft, PenLine, Plus, Trash2 } from "lucide-react";

export default function MyChecklistsPage() {
  const { t } = useLocale();
  const [customTasks, setCustomTasks] = useState<Task[]>([]);

  useEffect(() => {
    setCustomTasks(getCustomTasks());
  }, []);

  return (
    <div className="relative z-[2] mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur dark:bg-neutral-900/95 sm:px-8">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-heading text-lg font-bold">{t("supervisor.myChecklists")}</h1>
      </header>

      <main className="px-5 pb-10 sm:px-8">
        {customTasks.length > 0 && (
          <div className="space-y-2">
            {customTasks.map((ct) => {
              const cl = getCustomChecklist(ct.id);
              const itemCount = cl ? cl.phases.flatMap((p) => p.items).length : 0;
              return (
                <div
                  key={ct.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <Link
                    href={`/create-checklist?edit=${ct.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                      <TaskIcon taskId={ct.id} iconName={ct.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-semibold leading-tight">{ct.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">{itemCount} {t("home.points")}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(t("customCl.deleteConfirm"))) return;
                      deleteCustomTask(ct.id);
                      setCustomTasks(getCustomTasks());
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                    aria-label={t("customCl.delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {customTasks.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <PenLine className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-neutral-600" />
            <p className="mb-4 text-sm text-gray-500 dark:text-neutral-400">{t("supervisor.noChecklists")}</p>
            <Link
              href="/create-checklist"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              <Plus className="h-4 w-4" />
              {t("supervisor.createChecklist")}
            </Link>
          </div>
        )}

        {customTasks.length > 0 && (
          <Link
            href="/create-checklist"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
          >
            <Plus className="h-4 w-4" />
            {t("supervisor.createChecklist")}
          </Link>
        )}
      </main>
    </div>
  );
}
