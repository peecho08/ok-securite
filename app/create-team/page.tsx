"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { setSupervisorOrg, setActiveRole, getTeamName, getInviteToken, getDashboardSecret } from "@/lib/storage";

function randomId() {
  return Math.random().toString(36).slice(2, 12);
}

export default function CreateTeamPage() {
  const { t } = useLocale();
  const [teamName, setTeamName] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<"invite" | "dashboard" | null>(null);

  const inviteToken = typeof window !== "undefined" ? getInviteToken() : null;
  const dashboardSecret = typeof window !== "undefined" ? getDashboardSecret() : null;
  const savedTeamName = typeof window !== "undefined" ? getTeamName() : "";
  const displayName = savedTeamName || teamName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = teamName.trim();
    if (!name) return;
    const orgId = randomId();
    const inv = randomId();
    const dash = randomId();
    setSupervisorOrg(orgId, name, inv, dash);
    setActiveRole("supervisor");
    setDone(true);
  }

  function copyInviteLink() {
    if (typeof window === "undefined" || !inviteToken) return;
    const url = `${window.location.origin}/join/${inviteToken}`;
    void navigator.clipboard.writeText(url);
    setCopied("invite");
    setTimeout(() => setCopied(null), 2000);
  }

  function copyDashboardLink() {
    if (typeof window === "undefined" || !dashboardSecret) return;
    const url = `${window.location.origin}/dashboard?team=${dashboardSecret}`;
    void navigator.clipboard.writeText(url);
    setCopied("dashboard");
    setTimeout(() => setCopied(null), 2000);
  }

  if (done && inviteToken && dashboardSecret) {
    const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/join/${inviteToken}` : "";
    const dashboardUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard?team=${dashboardSecret}` : "";

    return (
      <div className="flex min-h-dvh flex-col bg-white dark:bg-neutral-900">
        <div className="safe-area-green-cover" />
        <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white">
            <Image src="/logo.svg" alt="OK Chantier" width={120} height={32} className="acq-logo h-8 w-auto brightness-0 invert" />
          </Link>
        </header>
        <main className="flex-1 px-5 py-8">
          <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-neutral-100">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {t("createTeam.inviteLink")}
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            />
            <button
              type="button"
              onClick={copyInviteLink}
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              {copied === "invite" ? t("createTeam.copied") : t("createTeam.copy")}
            </button>
          </div>
          <p className="mt-6 text-sm font-medium text-gray-700 dark:text-neutral-200">
            {t("createTeam.dashboardLink")}
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              readOnly
              value={dashboardUrl}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            />
            <button
              type="button"
              onClick={copyDashboardLink}
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              {copied === "dashboard" ? t("createTeam.copied") : t("createTeam.copy")}
            </button>
          </div>
          <Link
            href="/"
            className="mt-8 block w-full rounded-xl border border-gray-200 py-3 text-center font-heading text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {t("nav.home")}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-neutral-900">
      <div className="safe-area-green-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("nav.back")}
        </Link>
      </header>
      <main className="flex-1 px-5 py-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-neutral-100">
          {t("createTeam.title")}
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder={t("createTeam.namePlaceholder")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:focus:border-[var(--color-primary)]"
          />
          <button
            type="submit"
            disabled={!teamName.trim()}
            className="mt-6 w-full rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {t("createTeam.create")}
          </button>
        </form>
      </main>
    </div>
  );
}
