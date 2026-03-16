"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getWorkerName, setWorkerName, setWorkerOrgId, setWorkerOnboardingDone } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

interface OnboardingProps {
  onDone: () => void;
}

type OnboardingStep = "join" | "welcome";

export function Onboarding({ onDone }: OnboardingProps) {
  const { t } = useLocale();
  const [step, setStep] = useState<OnboardingStep>("join");
  const [name, setName] = useState(getWorkerName);
  const [joinLink, setJoinLink] = useState("");

  const [joinError, setJoinError] = useState("");

  function handleJoinSubmit() {
    const token = joinLink.trim().replace(/.*\/join\/?/i, "").trim();
    if (!token) {
      setJoinError(t("joinTeam.invalidLink"));
      return;
    }
    setJoinError("");
    setWorkerOrgId(token);
    setStep("welcome");
  }

  function handleJoinLater() {
    setWorkerOrgId(null);
    setStep("welcome");
  }

  function handleStart() {
    if (name.trim()) setWorkerName(name.trim());
    setWorkerOnboardingDone();
    onDone();
  }

  if (step === "join") {
    return (
      <div className="fixed inset-y-0 left-0 right-0 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none">
        <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
          <button
            type="button"
            onClick={handleJoinLater}
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("role.joinLater")}
          </button>
          <h1 className="mt-3 font-heading text-2xl font-bold text-white">{t("joinTeam.title")}</h1>
        </header>
        <main className="flex-1 px-5 py-5 sm:px-8">
          <input
            type="text"
            value={joinLink}
            onChange={(e) => { setJoinLink(e.target.value); setJoinError(""); }}
            placeholder={t("joinTeam.pastePlaceholder")}
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 focus:bg-white dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700 ${joinError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-gray-400 dark:border-neutral-600"}`}
          />
          {joinError && <p className="mt-2 text-sm text-red-500">{joinError}</p>}
          <button
            type="button"
            onClick={handleJoinSubmit}
            className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-3 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)]"
          >
            {t("joinTeam.join")}
          </button>
          <button
            type="button"
            onClick={handleJoinLater}
            className="mt-3 w-full rounded-xl border border-gray-200 py-3 font-heading text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {t("role.joinLater")}
          </button>
        </main>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div className="fixed inset-y-0 left-0 right-0 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none">
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-6 pt-2 text-center">
          <div className="animate-scale-in">
            <Image
              src="/ok-securite.svg"
              alt="OK Sécurité"
              width={188}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>

          <h1 className="mt-5 animate-slide-in-up font-heading text-xl font-bold">
            {name.trim() ? `${t("onboarding.hello")} ${name.trim().split(" ")[0]}` : t("onboarding.hello")} !
          </h1>
          <p className="mt-1 max-w-sm animate-slide-in-up text-sm text-gray-500" style={{ animationDelay: "0.1s" }}>
            {t("onboarding.subtitle")}
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("onboarding.namePlaceholder")}
            className="mt-5 w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-base outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700 animate-slide-in-up"
            style={{ animationDelay: "0.45s" }}
          />

          <button
            onClick={handleStart}
            className="mt-4 w-full max-w-sm rounded-xl bg-[var(--color-primary)] py-3 font-heading text-base font-bold tracking-wide text-white transition-colors hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)] animate-slide-in-up"
            style={{ animationDelay: "0.55s" }}
          >
            {t("onboarding.start")}
          </button>

        </div>
        <div className="pb-4" />
      </div>
    );
  }

  return null;
}
