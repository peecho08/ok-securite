"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import {
  getTeamName,
  setTeamName as saveTeamName,
  getInviteToken,
  getWorkerName,
  getHistory,
  getCompanyWebsite,
  setCompanyWebsite,
  getCompanyLogo,
  setCompanyLogo,
  getRemovedMembers,
  addRemovedMember,
  type HistoryEntry,
} from "@/lib/storage";
import { Copy, Check, Mail, MessageSquare, Users, Trophy, Globe, ImageIcon, Trash2 } from "lucide-react";

export default function MyTeamPage() {
  const { locale, t } = useLocale();

  const [teamName, setTeamName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [workerName, setWorkerName] = useState("");
  const [removedMembers, setRemovedMembers] = useState<string[]>([]);
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTeamName(getTeamName() || t("supervisor.defaultTeamName"));
    setWebsite(getCompanyWebsite());
    setLogo(getCompanyLogo());
    setHistory(getHistory());
    setWorkerName(getWorkerName());
    setRemovedMembers(getRemovedMembers());
    const token = getInviteToken();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setInviteUrl(token ? `${origin}/join/${token}` : `${origin}/join/demo-invite-abc123`);
  }, [t]);

  function handleRemoveMember(name: string) {
    addRemovedMember(name);
    setRemovedMembers((prev) => [...prev, name]);
    setConfirmingRemove(null);
  }

  function handleCopy() {
    if (!inviteUrl) return;
    void navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWebsiteBlur() {
    setCompanyWebsite(website.trim());
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogo(dataUrl);
      setCompanyLogo(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  const members = buildMembers(history, workerName).filter((m) => !removedMembers.includes(m.name));

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-neutral-900">
      <div className="safe-area-green-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("nav.back")}
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold text-white">{t("team.title")}</h1>
      </header>

      <main className="flex-1 px-5 py-6 sm:px-8">
        {/* Company info */}
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            {t("team.companyInfo")}
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="group flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:border-neutral-500"
              >
                {logo ? (
                  <img src={logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-gray-300 transition-colors group-hover:text-gray-400 dark:text-neutral-500" />
                )}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-400">{t("createTeam.companyName")}</p>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    onBlur={() => saveTeamName(teamName.trim())}
                    className="w-full border-b border-transparent bg-transparent font-heading text-base font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-400 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-400"
                    placeholder={t("supervisor.defaultTeamName")}
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-400">{t("team.companyWebsite")}</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-gray-300" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      onBlur={handleWebsiteBlur}
                      placeholder={t("team.companyWebsitePlaceholder")}
                      className="min-w-0 flex-1 border-b border-gray-200 bg-transparent py-1 text-sm outline-none placeholder:text-gray-300 focus:border-gray-400 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-400"
                    />
                  </div>
                </div>
              </div>
            </div>
            {logo && (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="mt-3 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
              >
                {t("team.changeLogo")}
              </button>
            )}
          </div>
        </section>

        {/* Invite link */}
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Users className="h-3.5 w-3.5" />
            {t("supervisor.inviteTitle")}
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2 p-2.5 pl-3">
              <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-neutral-300">{inviteUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t("createTeam.copied") : t("createTeam.copy")}
              </button>
            </div>
            <div className="flex border-t border-gray-100 dark:border-neutral-700">
              <a
                href={`sms:?&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
              >
                <MessageSquare className="h-4 w-4 text-gray-400" />
                {t("supervisor.shareText")}
              </a>
              <div className="w-px bg-gray-100 dark:bg-neutral-700" />
              <a
                href={`mailto:?subject=${encodeURIComponent(t("supervisor.inviteEmailSubject"))}&body=${encodeURIComponent(`${t("supervisor.inviteMessage")} ${inviteUrl}`)}`}
                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 transition-colors active:bg-gray-50 dark:text-neutral-300 dark:active:bg-neutral-700"
              >
                <Mail className="h-4 w-4 text-gray-400" />
                {t("supervisor.shareEmail")}
              </a>
            </div>
          </div>
        </section>

        {/* Team members */}
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Users className="h-3.5 w-3.5" />
            {t("team.members")} {members.length > 0 && <span className="text-gray-300">({members.length})</span>}
          </h2>
          {members.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-gray-400">{t("team.noMembers")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.name}
                  className={`overflow-hidden rounded-xl border bg-white dark:bg-neutral-800 transition-colors ${
                    confirmingRemove === m.name
                      ? "border-red-200 dark:border-red-800"
                      : "border-gray-200 dark:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-heading text-xs font-bold text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="flex-1 truncate font-heading text-sm font-semibold">{m.name}</span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {t("team.completions").replace("{count}", String(m.count)).replace("{s}", m.count !== 1 ? "s" : "")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmingRemove(confirmingRemove === m.name ? null : m.name)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                        confirmingRemove === m.name
                          ? "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-400"
                          : "text-gray-300 hover:bg-red-50 hover:text-red-500 active:bg-red-100 dark:hover:bg-red-950 dark:hover:text-red-400"
                      }`}
                      aria-label={t("team.removeMember")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {confirmingRemove === m.name && (
                    <div className="flex items-center justify-between border-t border-red-100 bg-red-50 px-4 py-2.5 dark:border-red-900 dark:bg-red-950/50">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        {t("team.removeConfirm").replace("{name}", m.name)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmingRemove(null)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-white active:bg-white dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                          {t("nav.cancel")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.name)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700 active:bg-red-700"
                        >
                          {t("team.removeMember")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Leaderboard */}
        <Leaderboard workerName={workerName} history={history} removedMembers={removedMembers} />
      </main>
    </div>
  );
}

function buildMembers(history: HistoryEntry[], currentUser: string) {
  const counts = new Map<string, number>();
  for (const entry of history) {
    const name = entry.workerName || currentUser || "—";
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function Leaderboard({ workerName, history, removedMembers }: { workerName: string; history: HistoryEntry[]; removedMembers: string[] }) {
  const { t } = useLocale();

  const fallbackWorkers = [
    { name: workerName || "Claude", count: 15 },
    { name: "Marc-Antoine", count: 12 },
    { name: "Stéphane", count: 11 },
    { name: "Jean-Pierre", count: 8 },
    { name: "Luc", count: 6 },
    { name: "Patrick", count: 5 },
    { name: "Éric", count: 4 },
    { name: "François", count: 3 },
    { name: "Mathieu", count: 2 },
    { name: "Sébastien", count: 1 },
  ];

  let leaderboard = fallbackWorkers.filter((w) => !removedMembers.includes(w.name));

  if (history.length > 0) {
    const workerCounts = new Map<string, number>();
    for (const entry of history) {
      const name = entry.workerName || workerName || "—";
      workerCounts.set(name, (workerCounts.get(name) || 0) + 1);
    }
    leaderboard = [...workerCounts.entries()]
      .filter(([name]) => !removedMembers.includes(name))
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  const rankStyle = (i: number) =>
    i === 0 ? "bg-amber-100 text-amber-700" :
    i === 1 ? "bg-gray-200 text-gray-600" :
    i === 2 ? "bg-orange-100 text-orange-700" :
    "bg-gray-100 text-gray-500";

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        <Trophy className="h-3.5 w-3.5" />
        {t("dashboard.topWorkers")}
      </h2>
      <div className="space-y-2">
        {leaderboard.map((worker, i) => (
          <div
            key={worker.name}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold ${rankStyle(i)}`}>
              {i + 1}
            </span>
            <span className="flex-1 truncate font-heading text-sm font-semibold">
              {worker.name}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-gray-400">{worker.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
