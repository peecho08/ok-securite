"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { tasks } from "@/data/tasks";
import { addHistory, clearProgress } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { AlertTriangle } from "lucide-react";

export default function ConfirmPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const searchParams = useSearchParams();

  const items = Number(searchParams.get("items")) || 0;
  const checkedCount = Number(searchParams.get("checked")) || 0;
  const workerName = searchParams.get("worker") || "";

  const task = tasks.find((t) => t.id === taskId);
  const allDone = items > 0 && checkedCount === items;
  const [saved, setSaved] = useState(false);

  const now = useMemo(() => new Date(), []);
  const timestamp = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (!task || saved) return;
    addHistory({
      taskId,
      taskTitle: task.title,
      taskIcon: task.icon,
      workerName,
      checkedCount,
      totalCount: items,
      completedAt: now.toISOString(),
    });
    if (allDone) clearProgress(taskId);
    setSaved(true);
  }, [task, taskId, workerName, checkedCount, items, allDone, now, saved]);

  if (!task) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold">Tâche introuvable</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:px-8">
        <div
          className={`flex h-48 w-48 items-center justify-center rounded-full sm:h-56 sm:w-56 ${
            allDone ? "bg-green-100" : "bg-amber-100"
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

        <h1 className="mt-6 text-2xl font-bold">
          {allDone ? "Checklist complétée" : "Checklist incomplète"}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-muted">
          <TaskIcon taskId={taskId} className="h-5 w-5" />
          <span className="text-sm">{task.title}</span>
        </div>

        {/* Summary card */}
        <div className="mt-8 w-full max-w-md rounded-xl border border-gray-200 bg-white p-5">
          {workerName && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-muted">Travailleur</span>
              <span className="font-heading font-bold">{workerName}</span>
            </div>
          )}
          <div className={`flex items-center justify-between ${workerName ? "border-b border-gray-100 py-3" : "border-b border-gray-100 pb-3"}`}>
            <span className="text-sm text-muted">Points vérifiés</span>
            <span className="font-heading font-bold">
              {checkedCount} / {items}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 py-3">
            <span className="text-sm text-muted">Statut</span>
            <span
              className={`font-heading rounded-md px-2 py-0.5 text-xs font-semibold ${
                allDone ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {allDone ? "COMPLET" : "INCOMPLET"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-sm text-muted">Date</span>
            <span className="text-right text-sm font-medium">
              {timestamp}
              <br />
              <span className="text-muted">{time}</span>
            </span>
          </div>
        </div>
      </main>

      <div className="border-t border-gray-100 px-5 py-4 sm:px-8">
        <div className="flex gap-3">
          <Link
            href="/"
            className="block flex-1 rounded-xl border-2 border-black py-3.5 text-center font-heading text-sm font-bold transition-colors active:bg-gray-50"
          >
            ACCUEIL
          </Link>
          <Link
            href="/history"
            className="block flex-1 rounded-xl border-2 border-gray-300 py-3.5 text-center font-heading text-sm font-bold text-gray-600 transition-colors active:bg-gray-50"
          >
            HISTORIQUE
          </Link>
        </div>
      </div>
    </div>
  );
}
