"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isUnlocked, setUnlocked } from "@/lib/storage";

const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlockedState] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUnlockedState(isUnlocked());
    setReady(true);
  }, []);

  // No password configured — skip gate
  if (!APP_PASSWORD || APP_PASSWORD === "") {
    return <>{children}</>;
  }

  // Not yet hydrated — show loading to avoid flash
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
      setError("Mot de passe incorrect");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-header)] px-6">
      <Image
        src="/logo.svg"
        alt="OK Chantier"
        width={188}
        height={48}
        className="acq-logo mb-8 h-12 w-auto brightness-0 invert"
      />
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label htmlFor="pw" className="mb-2 block text-sm font-medium text-white/90">
            Mot de passe
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe"
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
          ENTRER
        </button>
      </form>
    </div>
  );
}
