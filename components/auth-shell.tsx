"use client";

import Image from "next/image";
import { useLocale } from "@/lib/i18n";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-header)] px-6">
      <Image
        src="/ok-securite.svg"
        alt="OK Sécurité"
        width={188}
        height={48}
        className="mb-6 h-12 w-auto"
        priority
      />
      {children}
      <button
        type="button"
        onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
        className="mt-6 rounded-lg border border-neutral-700 bg-neutral-800/60 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-700/60 hover:text-white"
      >
        {locale === "fr" ? "English" : "Français"}
      </button>
    </div>
  );
}
