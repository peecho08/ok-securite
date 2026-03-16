"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useLocale } from "@/lib/i18n";
import { setSupervisorOrg, setActiveRole, setWorkerName, setCompanyLogo, getTeamName, getInviteToken, getDashboardSecret, getSupervisorOrgId, getTeamTasks, setTeamTasks, clearRoleChoiceDone, setSupervisorEmail } from "@/lib/storage";
import { persistRole } from "@/lib/hooks/use-db-role";
import { tasks } from "@/data/tasks";
import { categoryLabels, categoryLabelsEn, type TaskCategory } from "@/types";
import { ArrowLeft, Upload, Check, Copy, Mail, MessageSquare, Search } from "lucide-react";
import { TaskIcon } from "@/components/task-icon";

function TaskPicker({ onDone, editMode }: { onDone: () => void; editMode: boolean }) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<Set<string>>(() => {
    if (editMode) return new Set(getTeamTasks());
    return new Set<string>();
  });
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    function onScroll() { setPinned(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const catLabels = locale === "en" ? categoryLabelsEn : categoryLabels;
  const categories = Object.keys(catLabels) as TaskCategory[];

  const filtered = useMemo(() => {
    if (!search.trim()) return tasks;
    const q = search.toLowerCase();
    return tasks.filter((t) => {
      const title = locale === "en" && t.titleEn ? t.titleEn : t.title;
      if (title.toLowerCase().includes(q)) return true;
      if (t.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [search, locale]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    const taskArray = Array.from(selected);
    setTeamTasks(taskArray);
    const orgId = getSupervisorOrgId();
    if (orgId) {
      fetch("/api/teams/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, taskIds: taskArray }),
      }).catch(console.error);
    }
    onDone();
  }

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <div className="safe-area-header-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-3 sm:px-8">
        <Link href="/app" className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          {t("nav.back")}
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold text-white">
          {t("createTeam.selectTasks")}
        </h1>
        <p className="mt-0.5 text-sm text-white/70">
          {t("createTeam.selectTasksHint")}
        </p>
      </header>
      <div className={`sticky top-0 z-10 bg-[var(--color-header)] px-5 pb-3 sm:px-8 transition-[padding] duration-200 ${pinned ? "pt-3" : "pt-1"}`}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("onboarding.searchPlaceholder")}
            className="w-full rounded-lg border border-white/30 bg-white/15 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/50 transition-colors focus:border-white/50 focus:bg-white/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <main className="flex-1 px-5 py-5 sm:px-8">

        <div className="mt-5 space-y-6 pb-28">
          {categories.map((cat) => {
            const catTasks = filtered.filter((t) => t.category === cat);
            if (catTasks.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  {catLabels[cat]}
                </h2>
                <div className="grid gap-2.5">
                  {catTasks.map((task) => {
                    const isSelected = selected.has(task.id);
                    const title = locale === "en" && task.titleEn ? task.titleEn : task.title;
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggle(task.id)}
                        className={`flex items-center gap-3.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                          isSelected
                            ? "border-[var(--color-primary)] bg-primary/5 dark:border-[var(--color-primary)] dark:bg-primary/10"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                        }`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? "bg-primary/10 text-[var(--color-primary)] dark:bg-primary/20"
                            : "bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300"
                        }`}>
                          <TaskIcon taskId={task.id} className="h-5 w-5" />
                        </span>
                        <span className={`min-w-0 flex-1 text-sm font-semibold leading-tight ${isSelected ? "text-[var(--color-primary)]" : "text-gray-700 dark:text-neutral-300"}`}>
                          {title}
                        </span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                            : "border-gray-300 dark:border-neutral-600"
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-neutral-400">
              {t("onboarding.noResults")}
            </p>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 px-5 py-4 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mb-2 flex items-center justify-center gap-2">
          <p className="text-center text-xs text-gray-500 dark:text-neutral-400">
            {t("createTeam.taskCount").replace("{count}", String(selected.size)).replaceAll("{s}", selected.size > 1 ? "s" : "")}
          </p>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs font-medium text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              {t("createTeam.unselectAll")}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          {t("createTeam.done")}
        </button>
      </div>
    </div>
  );
}

export default function CreateTeamPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const isEditTasks = searchParams.has("edit-tasks");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorEmail, setSupervisorEmailState] = useState("");
  const [teamName, setTeamName] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [step, setStep] = useState<"form" | "tasks" | "invite">("form");
  const [copied, setCopied] = useState<"invite" | "dashboard" | null>(null);
  const [fetchedLogo, setFetchedLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefilled || !user) return;
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    if (fullName && !supervisorName) setSupervisorName(fullName);
    const email = user.primaryEmailAddress?.emailAddress;
    if (email && !supervisorEmail) setSupervisorEmailState(email);
    setPrefilled(true);
  }, [user, prefilled, supervisorName, supervisorEmail]);

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
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  if (isEditTasks) {
    return <TaskPicker editMode onDone={() => { window.location.href = "/app"; }} />;
  }

  if (step === "tasks") {
    return <TaskPicker editMode={false} onDone={() => setStep("invite")} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = teamName.trim();
    if (!name || !isEmailValid) return;

    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setCreateError(data.error || "Failed to create team");
        return;
      }

      const { org } = await res.json();
      const localDashId = Math.random().toString(36).slice(2, 12);
      setSupervisorOrg(org.id, name, org.invite_token, localDashId);
      if (supervisorName.trim()) setWorkerName(supervisorName.trim());
      if (supervisorEmail.trim()) setSupervisorEmail(supervisorEmail.trim());
      if (fetchedLogo) setCompanyLogo(fetchedLogo);
      setActiveRole("supervisor");
      persistRole("supervisor");
      setStep("tasks");
    } catch {
      setCreateError("Network error");
    } finally {
      setCreating(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPdfName(file.name);
  }

  function copyInviteLink() {
    if (typeof window === "undefined" || !inviteToken) return;
    const url = `${window.location.origin}/app/join/${inviteToken}`;
    void navigator.clipboard.writeText(url);
    setCopied("invite");
    setTimeout(() => setCopied(null), 2000);
  }

  function copyDashboardLink() {
    if (typeof window === "undefined" || !dashboardSecret) return;
    const url = `${window.location.origin}/app/dashboard?team=${dashboardSecret}`;
    void navigator.clipboard.writeText(url);
    setCopied("dashboard");
    setTimeout(() => setCopied(null), 2000);
  }

  if (step === "invite" && inviteToken && dashboardSecret) {
    const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/app/join/${inviteToken}` : "";
    const dashboardUrl = typeof window !== "undefined" ? `${window.location.origin}/app/dashboard?team=${dashboardSecret}` : "";

    return (
      <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
        <div className="safe-area-header-cover" />
        <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
          <Link href="/app" className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white">
            <Image src="/ok-securite.svg" alt="OK Sécurité" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <h1 className="mt-3 font-heading text-2xl font-bold text-white">
            {t("supervisor.inviteTitle")}
          </h1>
          <p className="mt-0.5 text-sm text-white/70">{displayName}</p>
        </header>
        <main className="flex-1 px-5 py-5 sm:px-8">
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
            href="/app"
            className="mt-8 block w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-center font-heading text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {t("createTeam.done")}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <div className="safe-area-header-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
        <button
          type="button"
          onClick={() => { clearRoleChoiceDone(); router.push("/app"); }}
          className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("nav.back")}
        </button>
        <h1 className="mt-3 font-heading text-2xl font-bold text-white">
          {t("createTeam.title")}
        </h1>
      </header>
      <main className="flex-1 px-5 py-5 sm:px-8">
        <form onSubmit={handleSubmit} className="mt-1 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("createTeam.yourName")}
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
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
              name="email"
              autoComplete="email"
              required
              value={supervisorEmail}
              onChange={(e) => setSupervisorEmailState(e.target.value)}
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
                <span className="text-xs text-primary dark:text-primary">{t("createTeam.logoDetected")}</span>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("createTeam.companyName")}
            </label>
            <input
              type="text"
              name="organization"
              autoComplete="organization"
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
          {createError && (
            <p className="mt-2 text-sm font-medium text-red-500">{createError}</p>
          )}
          <button
            type="submit"
            disabled={!teamName.trim() || !isEmailValid || creating}
            className="mt-2 w-full rounded-xl bg-[var(--color-primary)] py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500"
          >
            {creating ? "..." : t("createTeam.create")}
          </button>
        </form>
      </main>
    </div>
  );
}
