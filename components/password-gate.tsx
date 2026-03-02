"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isUnlocked, setUnlocked } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const { t } = useLocale();
  const [unlocked, setUnlockedState] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUnlockedState(isUnlocked());
    setReady(true);
  }, []);

  if (!APP_PASSWORD || APP_PASSWORD === "") {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--color-primary)]">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/30" />
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password === APP_PASSWORD) {
      setUnlocked();
      setUnlockedState(true);
    } else {
      setError(t("password.incorrect"));
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-header)] px-6">
      <Image
        src="/ok-yellow-white.svg"
        alt="OK Chantier"
        width={188}
        height={48}
        className="mb-8 h-12 w-auto"
      />
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label htmlFor="pw" className="mb-2 block text-sm font-medium text-white/90">
            {t("password.label")}
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("password.placeholder")}
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3.5 text-white placeholder:text-white/50 outline-none transition-colors focus:border-white/50 focus:bg-white/20"
          />
          {error && (
            <p className="mt-2 text-sm text-red-200">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-white py-3.5 font-heading text-sm font-bold tracking-wide text-[var(--color-primary)] transition-colors hover:bg-white/95 active:bg-white/90"
        >
          {t("password.enter")}
        </button>
      </form>
    </div>
  );
}
