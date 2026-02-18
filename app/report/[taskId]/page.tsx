"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { tasks } from "@/data/tasks";

const severityOptions = [
  { value: "observation", label: "Observation", color: "bg-blue-100 text-blue-800" },
  { value: "presquaccident", label: "Presqu'accident", color: "bg-amber-100 text-amber-800" },
  { value: "incident", label: "Incident / Blessure", color: "bg-red-100 text-red-800" },
];

export default function ReportPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const task = tasks.find((t) => t.id === taskId);

  const [severity, setSeverity] = useState("observation");
  const [description, setDescription] = useState("");
  const [reporter, setReporter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!task) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="font-heading text-lg font-semibold">Tâche introuvable</p>
        <Link href="/" className="mt-4 text-sm text-muted underline">Retour</Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const report = {
      taskId,
      taskTitle: task!.title,
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
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl">📋</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Rapport enregistré</h1>
        <p className="mt-2 text-sm text-muted">
          Votre signalement a été sauvegardé localement.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href={`/confirm/${taskId}`}
            className="rounded-xl border-2 border-gray-300 px-5 py-3 font-heading text-sm font-bold transition-colors active:bg-gray-50"
          >
            Retour
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-black px-5 py-3 font-heading text-sm font-bold text-accent transition-colors active:bg-gray-900"
          >
            Accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors active:bg-gray-100"
            aria-label="Retour"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Signaler un incident</h1>
        </div>
        <p className="mt-1 text-xs text-muted">{task.title}</p>
      </header>

      <main className="flex-1 px-5 py-4 sm:px-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Severity */}
          <div>
            <label className="mb-2 block font-heading text-sm font-semibold">Gravité</label>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSeverity(opt.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    severity === opt.value
                      ? `${opt.color} ring-2 ring-offset-1 ring-gray-400`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="desc" className="mb-2 block font-heading text-sm font-semibold">
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la situation observée…"
              rows={4}
              required
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
          </div>

          {/* Reporter */}
          <div>
            <label htmlFor="reporter" className="mb-2 block font-heading text-sm font-semibold">
              Signalé par
            </label>
            <input
              id="reporter"
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              placeholder="Votre nom (optionnel)"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
            />
          </div>

          {/* Timestamp */}
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-muted">
            Date et heure : {new Date().toLocaleString("fr-FR")}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 font-heading text-sm font-bold tracking-wide text-white transition-colors hover:bg-red-700 active:bg-red-700"
          >
            ENVOYER LE SIGNALEMENT
          </button>
        </form>
      </main>
    </div>
  );
}
