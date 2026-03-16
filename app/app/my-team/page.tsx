"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import {
  getCompanyWebsite,
  setCompanyWebsite,
  getCompanyLogo,
  setCompanyLogo,
} from "@/lib/storage";
import { ArrowLeft, Copy, Check, Mail, MessageSquare, Users, Trophy, Globe, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { InviteQRCode } from "@/components/invite-qr-code";

interface MemberProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  profile: MemberProfile | null;
}

interface Org {
  id: string;
  name: string;
  invite_token: string;
  logo_url: string | null;
  website: string | null;
}

export default function MyTeamPage() {
  const { locale, t } = useLocale();

  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWebsite(getCompanyWebsite());
    setLogo(getCompanyLogo());

    fetch("/api/teams/members")
      .then((r) => r.json())
      .then((data) => {
        setOrg(data.org ?? null);
        setMembers(data.members ?? []);
        if (data.org) {
          setTeamName(data.org.name);
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          setInviteUrl(data.org.invite_token ? `${origin}/app/join/${data.org.invite_token}` : "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleRemoveMember(memberId: string) {
    setRemoving(true);
    try {
      const res = await fetch("/api/teams/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        toast.success(t("toast.memberRemoved"));
      } else {
        toast.error(t("toast.error"));
      }
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setRemoving(false);
      setConfirmingRemove(null);
    }
  }

  function handleCopy() {
    if (!inviteUrl) return;
    void navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success(t("toast.linkCopied"));
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

  function displayName(m: Member) {
    return m.profile?.full_name || m.profile?.email || t("team.unknownMember");
  }

  function displayInitial(m: Member) {
    const name = displayName(m);
    return name.charAt(0).toUpperCase();
  }

  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";

  return (
    <div className="relative z-[2] mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur dark:bg-neutral-900/95 sm:px-8">
        <Link
          href="/app"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-heading text-lg font-bold">{t("team.title")}</h1>
      </header>

      <main className="px-5 pb-10 sm:px-8">
        {/* Company info */}
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            {t("team.companyInfo")}
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-start gap-4">
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
                  <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">{t("createTeam.companyName")}</p>
                  <p className="font-heading text-base font-bold text-gray-900 dark:text-neutral-100">
                    {teamName || t("supervisor.defaultTeamName")}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500 dark:text-neutral-400">{t("team.companyWebsite")}</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-gray-400 dark:text-neutral-500" />
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
                className="mt-3 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                {t("team.changeLogo")}
              </button>
            )}
          </div>
        </section>

        {/* Invite link */}
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            {t("supervisor.inviteTitle")}
          </h2>
          {inviteUrl ? (
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
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-neutral-600 dark:bg-neutral-800">
              <p className="text-sm text-gray-500 dark:text-neutral-400">{t("supervisor.noInviteYet")}</p>
              <Link
                href="/app/create-team"
                className="mt-3 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                {t("supervisor.generateInvite")}
              </Link>
            </div>
          )}
          {inviteUrl && <InviteQRCode url={inviteUrl} teamName={org?.name} />}
        </section>

        {/* Team members */}
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            {t("team.members")} {members.length > 0 && <span className="text-gray-400 dark:text-neutral-500">({members.length})</span>}
          </h2>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-neutral-700" />
                    <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-neutral-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-gray-500 dark:text-neutral-400">{t("team.noMembers")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className={`overflow-hidden rounded-xl border bg-white dark:bg-neutral-800 transition-colors ${
                    confirmingRemove === m.id
                      ? "border-red-200 dark:border-red-800"
                      : "border-gray-200 dark:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-heading text-xs font-bold text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                      {displayInitial(m)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-semibold">{displayName(m)}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
                        {m.role === "supervisor" ? t("menu.supervisor") : t("role.joinTeam")}
                        <span className="mx-1 text-gray-400 dark:text-neutral-500">·</span>
                        {new Date(m.joinedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    {m.role !== "supervisor" && (
                      <button
                        type="button"
                        onClick={() => setConfirmingRemove(confirmingRemove === m.id ? null : m.id)}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                          confirmingRemove === m.id
                            ? "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-400"
                            : "text-gray-300 hover:bg-red-50 hover:text-red-500 active:bg-red-100 dark:hover:bg-red-950 dark:hover:text-red-400"
                        }`}
                        aria-label={t("team.removeMember")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {confirmingRemove === m.id && (
                    <div className="flex items-center justify-between border-t border-red-100 bg-red-50 px-4 py-2.5 dark:border-red-900 dark:bg-red-950/50">
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        {t("team.removeConfirm").replace("{name}", displayName(m))}
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
                          disabled={removing}
                          onClick={() => handleRemoveMember(m.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700 active:bg-red-700 disabled:opacity-50"
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
      </main>
    </div>
  );
}
