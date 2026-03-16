"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { useClerk, useUser } from "@clerk/nextjs";
import { ArrowLeft, Camera, Download, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const { t } = useLocale();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.avatar_url) setAvatarUrl(data.avatar_url); })
      .catch(() => {});
  }, []);

  const displayAvatar = avatarUrl || user?.imageUrl || null;

  async function handleAvatarUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("account.photoTooLarge"));
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAvatarUrl(data.avatar_url);
      window.dispatchEvent(new CustomEvent("avatar-updated", { detail: data.avatar_url }));
      toast.success(t("account.photoUpdated"));
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemoveAvatar() {
    setUploading(true);
    try {
      const res = await fetch("/api/profile/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAvatarUrl(null);
      window.dispatchEvent(new CustomEvent("avatar-updated", { detail: null }));
      toast.success(t("account.photoRemoved"));
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setUploading(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ok-securite-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t("toast.dataExported"));
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(t("toast.accountDeleteRequested"));
      localStorage.clear();
      setTimeout(() => signOut({ redirectUrl: "/sign-in" }), 1500);
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="relative z-[2] mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur dark:bg-neutral-900/95 sm:px-8">
        <Link
          href="/app"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-heading text-lg font-bold">{t("account.title")}</h1>
      </header>

      <main className="px-5 pb-10 sm:px-8">
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            {t("account.profilePhoto")}
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-700">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt=""
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <svg className="h-10 w-10 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatarUpload(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" />
                  {t("account.changePhoto")}
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 font-heading text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <X className="h-4 w-4" />
                    {t("account.removePhoto")}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400 dark:text-neutral-500">
              {t("account.photoHint")}
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            {t("account.exportData")}
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <p className="mb-3 text-sm text-gray-500 dark:text-neutral-400">
              {t("account.exportHint")}
            </p>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3 font-heading text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <Download className="h-4 w-4" />
              {exporting ? t("account.exporting") : t("account.exportData")}
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
            {t("account.deleteAccount")}
          </h2>
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="mb-3 text-sm text-gray-600 dark:text-neutral-400">
              {t("account.deleteHint")}
            </p>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-300 py-3 font-heading text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                <Trash2 className="h-4 w-4" />
                {t("account.deleteAccount")}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {t("account.deleteConfirm")}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-heading text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300"
                  >
                    {t("nav.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-xl bg-red-600 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? t("account.deleting") : t("account.deleteConfirmButton")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
