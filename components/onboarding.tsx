"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getWorkerName, setWorkerName, getRoleChoiceDone, setRoleChoiceDone, setActiveRole, setWorkerOrgId, setWorkerOnboardingDone } from "@/lib/storage";
import { useLocale } from "@/lib/i18n";

interface OnboardingProps {
  onDone: () => void;
}

type OnboardingStep = "role" | "join" | "welcome";

export function Onboarding({ onDone }: OnboardingProps) {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(() => {
    if (!getRoleChoiceDone()) return "role";
    return "welcome";
  });
  const [name, setName] = useState(getWorkerName);
  const [joinLink, setJoinLink] = useState("");

  function handleCreateTeam() {
    setRoleChoiceDone();
    setActiveRole("supervisor");
    router.push("/create-team");
  }

  function handleJoinTeam() {
    setStep("join");
  }

  const [joinError, setJoinError] = useState("");

  function handleJoinSubmit() {
    const token = joinLink.trim().replace(/.*\/join\/?/i, "").trim();
    if (!token) {
      setJoinError(t("joinTeam.invalidLink"));
      return;
    }
    setJoinError("");
    setRoleChoiceDone();
    setActiveRole("worker");
    setWorkerOrgId(token);
    setStep("welcome");
  }

  function handleJoinLater() {
    setRoleChoiceDone();
    setActiveRole("worker");
    setWorkerOrgId(null);
    setStep("welcome");
  }

  function handleStart() {
    if (name.trim()) setWorkerName(name.trim());
    setWorkerOnboardingDone();
    onDone();
  }

  if (step === "role") {
    return (
      <div className="fixed inset-y-0 left-0 right-0 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none">
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-8 pt-6">
          <Image src="/ok-securite.svg" alt="OK Sécurité" width={188} height={48} className="h-10 w-auto" priority />
          <h1 className="mt-6 font-heading text-xl font-bold text-black dark:text-neutral-100">{t("role.chooseTitle")}</h1>
          <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCreateTeam}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50/50 p-4 text-center transition-colors hover:border-[var(--color-primary)] hover:bg-primary/5 active:bg-primary/10 dark:border-neutral-700 dark:bg-neutral-800/50"
            >
              <p className="font-heading font-bold text-gray-900 dark:text-neutral-100">{t("role.createTeam")}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">{t("role.createTeamDesc")}</p>
            </button>
            <button
              type="button"
              onClick={handleJoinTeam}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50/50 p-4 text-center transition-colors hover:border-[var(--color-primary)] hover:bg-primary/5 active:bg-primary/10 dark:border-neutral-700 dark:bg-neutral-800/50"
            >
              <p className="font-heading font-bold text-gray-900 dark:text-neutral-100">{t("role.joinTeam")}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">{t("role.joinTeamDesc")}</p>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
          className="pb-6 pt-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {locale === "fr" ? "English" : "Français"}
        </button>
      </div>
    );
  }

  if (step === "join") {
    return (
      <div className="fixed inset-y-0 left-0 right-0 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none">
        <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
          <button
            type="button"
            onClick={() => setStep("role")}
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("nav.back")}
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

  const roleAlreadyChosen = getRoleChoiceDone();

  if (step === "welcome") {
    return (
      <div className="fixed inset-y-0 left-0 right-0 z-50 mx-auto flex w-full max-w-3xl flex-col overflow-y-auto bg-white text-gray-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none">
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-6 pt-2 text-center">
          {!roleAlreadyChosen && (
            <button
              type="button"
              onClick={() => setStep("role")}
              className="absolute left-5 top-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("nav.back")}
            </button>
          )}
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

          <h1 className="mt-5 animate-slide-in-up font-heading text-xl font-bold text-black">
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
            className="mt-5 w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-base text-black outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-700 animate-slide-in-up"
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
