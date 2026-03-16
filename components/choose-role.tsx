"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { setActiveRole, setRoleChoiceDone } from "@/lib/storage";

export function ChooseRole() {
  const { locale, setLocale, t } = useLocale();
  const { signOut } = useClerk();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handlePickRole(role: "supervisor" | "worker") {
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch("/api/profile/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        console.error("Failed to save role");
        setSaving(false);
        return;
      }

      setActiveRole(role);
      setRoleChoiceDone();

      if (role === "supervisor") {
        router.push("/app/create-team");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Error saving role:", err);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-y-0 left-0 right-0 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none">
      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-8 pt-6">
        <Image
          src="/ok-securite.svg"
          alt="OK Sécurité"
          width={188}
          height={48}
          className="h-10 w-auto"
          priority
        />
        <h1 className="mt-6 font-heading text-xl font-bold text-black dark:text-neutral-100">
          {t("role.chooseTitle")}
        </h1>
        <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handlePickRole("supervisor")}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50/50 p-4 text-center transition-colors hover:border-[var(--color-primary)] hover:bg-primary/5 active:bg-primary/10 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800/50"
          >
            <p className="font-heading font-bold text-gray-900 dark:text-neutral-100">
              {t("role.createTeam")}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              {t("role.createTeamDesc")}
            </p>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handlePickRole("worker")}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50/50 p-4 text-center transition-colors hover:border-[var(--color-primary)] hover:bg-primary/5 active:bg-primary/10 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800/50"
          >
            <p className="font-heading font-bold text-gray-900 dark:text-neutral-100">
              {t("role.joinTeam")}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              {t("role.joinTeamDesc")}
            </p>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 pb-6 pt-2">
        <button
          type="button"
          onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {locale === "fr" ? "English" : "Français"}
        </button>
        <span className="text-gray-300 dark:text-neutral-600">|</span>
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t("auth.signOut")}
        </button>
      </div>
    </div>
  );
}
