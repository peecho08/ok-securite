"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { setSupervisorOrg, setActiveRole, setWorkerName, setCompanyLogo, getTeamName, getInviteToken, getDashboardSecret } from "@/lib/storage";
import { Upload, Check, Copy, Mail, MessageSquare } from "lucide-react";

function randomId() {
  return Math.random().toString(36).slice(2, 12);
}

export default function CreateTeamPage() {
  const { t } = useLocale();
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<"invite" | "dashboard" | null>(null);
  const [fetchedLogo, setFetchedLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const match = supervisorEmail.match(/@([^\s@]+\.[^\s@]+)$/);
    if (!match) { setFetchedLogo(null); return; }
    const domain = match[1].toLowerCase();
    const freeProviders = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", "live.com", "msn.com"];
    if (freeProviders.includes(domain)) { setFetchedLogo(null); return; }
    const url = `https://logo.clearbit.com/${domain}`;
    const img = new window.Image();
    img.onload = () => setFetchedLogo(url);
    img.onerror = () => setFetchedLogo(null);
    img.src = url;
  }, [supervisorEmail]);

  const inviteToken = typeof window !== "undefined" ? getInviteToken() : null;
  const dashboardSecret = typeof window !== "undefined" ? getDashboardSecret() : null;
  const savedTeamName = typeof window !== "undefined" ? getTeamName() : "";
  const displayName = savedTeamName || teamName;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supervisorEmail.trim());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = teamName.trim();
    if (!name || !isEmailValid) return;
    const orgId = randomId();
    const inv = randomId();
    const dash = randomId();
    setSupervisorOrg(orgId, name, inv, dash);
    if (supervisorName.trim()) setWorkerName(supervisorName.trim());
    if (fetchedLogo) setCompanyLogo(fetchedLogo);
    setActiveRole("supervisor");
    setDone(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPdfName(file.name);
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
        <div className="safe-area-header-cover" />
        <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white">
            <Image src="/logo.svg" alt="OK Chantier" width={120} height={32} className="acq-logo h-8 w-auto brightness-0 invert" />
          </Link>
        </header>
        <main className="flex-1 px-5 py-8">
          <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-neutral-100">
            {t("supervisor.inviteTitle")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{displayName}</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2 p-2.5 pl-3">
              <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-neutral-300">{inviteUrl}</span>
              <button
                type="button"
                onClick={copyInviteLink}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                {copied === "invite" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "invite" ? t("createTeam.copied") : t("createTeam.copy")}
              </button>
            </div>
            <div className="flex border-t border-gray-100 dark:border-neutral-700">
              <a
                href={`sms:?&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
              >
                <MessageSquare className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                {t("supervisor.shareText")}
              </a>
              <div className="w-px bg-gray-100 dark:bg-neutral-700" />
              <a
                href={`mailto:?subject=${encodeURIComponent(t("supervisor.inviteEmailSubject"))}&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
              >
                <Mail className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                {t("supervisor.shareEmail")}
              </a>
            </div>
          </div>
          <Link
            href="/"
            className="mt-8 block w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-center font-heading text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {t("createTeam.done")}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-neutral-900">
      <div className="safe-area-header-cover" />
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
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("createTeam.yourName")}
            </label>
            <input
              type="text"
              value={supervisorName}
              onChange={(e) => setSupervisorName(e.target.value)}
              placeholder={t("createTeam.yourNamePlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[var(--color-primary)] dark:focus:bg-neutral-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("createTeam.yourEmail")}
            </label>
            <input
              type="email"
              required
              value={supervisorEmail}
              onChange={(e) => setSupervisorEmail(e.target.value)}
              placeholder={t("createTeam.yourEmailPlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[var(--color-primary)] dark:focus:bg-neutral-700"
            />
            {fetchedLogo && (
              <div className="mt-2 flex items-center gap-2.5">
                <img
                  src={fetchedLogo}
                  alt=""
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <span className="text-xs text-primary dark:text-primary">Logo détecté automatiquement</span>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("createTeam.companyName")}
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={t("createTeam.namePlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[var(--color-primary)] dark:focus:bg-neutral-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("createTeam.preventionUpload")}
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3.5 text-left transition-colors ${
                pdfName
                  ? "border-primary/30 bg-primary/5 dark:border-primary/40 dark:bg-primary/10"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-800"
              }`}
            >
              {pdfName ? (
                <Check className="h-5 w-5 shrink-0 text-primary dark:text-primary" />
              ) : (
                <Upload className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
              )}
              <div className="min-w-0 flex-1">
                {pdfName ? (
                  <>
                    <p className="truncate text-sm font-medium text-primary dark:text-primary">{pdfName}</p>
                    <p className="text-xs text-primary/70 dark:text-primary/60">{t("createTeam.preventionUploaded")}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-neutral-400">{t("createTeam.preventionUploadHint")}</p>
                )}
              </div>
            </button>
          </div>
          <button
            type="submit"
            disabled={!teamName.trim() || !isEmailValid}
            className="mt-2 w-full rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500"
          >
            {t("createTeam.create")}
          </button>
        </form>
      </main>
    </div>
  );
}
