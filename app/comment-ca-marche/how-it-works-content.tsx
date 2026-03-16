"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { APP_URL } from "@/lib/urls";
import { PlayCircle, Users, ClipboardList, BarChart3, FileCheck, UserPlus, ListChecks, CheckSquare, Send } from "lucide-react";

type Persona = "employer" | "worker";

const EMPLOYER_STEPS = [
  { key: "emp1", icon: Users },
  { key: "emp2", icon: ClipboardList },
  { key: "emp3", icon: BarChart3 },
  { key: "emp4", icon: FileCheck },
] as const;

const WORKER_STEPS = [
  { key: "wrk1", icon: UserPlus },
  { key: "wrk2", icon: ListChecks },
  { key: "wrk3", icon: CheckSquare },
  { key: "wrk4", icon: Send },
] as const;

export function HowItWorksContent() {
  const { t } = useLocale();
  const [persona, setPersona] = useState<Persona>("employer");

  const steps = persona === "employer" ? EMPLOYER_STEPS : WORKER_STEPS;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-header)] px-5 pb-16 pt-28 text-center text-white sm:px-8 sm:pb-20 sm:pt-36">
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {t("mkt.hiw.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75 sm:text-xl">
            {t("mkt.hiw.subtitle")}
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2.5 rounded-xl border border-white/20 px-6 py-3 font-heading text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            <PlayCircle className="h-5 w-5" />
            {t("mkt.hiw.videoDemo")}
          </a>
        </div>
      </section>

      {/* Toggle */}
      <section className="px-5 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto flex max-w-sm items-center rounded-full bg-gray-100 p-1 dark:bg-neutral-800">
          <ToggleButton
            active={persona === "employer"}
            onClick={() => setPersona("employer")}
            label={t("mkt.hiw.employer")}
          />
          <ToggleButton
            active={persona === "worker"}
            onClick={() => setPersona("worker")}
            label={t("mkt.hiw.worker")}
          />
        </div>
      </section>

      {/* Z-layout steps */}
      <div className="py-16 sm:py-24">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isEven = i % 2 === 1;
          const bgClass = isEven
            ? "bg-gray-50 dark:bg-neutral-900"
            : "bg-white dark:bg-neutral-950";

          return (
            <section key={step.key} className={`${bgClass} px-5 py-14 sm:px-8 sm:py-20`}>
              <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
                {/* Text side */}
                <div className={isEven ? "md:order-2" : ""}>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                    {t(`mkt.hiw.${step.key}.title`)}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-neutral-400 sm:text-lg">
                    {t(`mkt.hiw.${step.key}.desc`)}
                  </p>
                </div>

                {/* Image placeholder */}
                <div className={isEven ? "md:order-1" : ""}>
                  <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl bg-gray-100 dark:bg-neutral-800">
                    <Icon className="mb-3 h-10 w-10 text-gray-300 dark:text-neutral-600" />
                    <span className="text-sm text-gray-400 dark:text-neutral-500">
                      {t("mkt.hiw.imagePlaceholder")}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-[var(--color-header)] px-5 py-14 text-center sm:px-8">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          {t("mkt.hiw.cta.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          {t("mkt.hiw.cta.subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={APP_URL}
            className="rounded-xl bg-[var(--color-primary)] px-8 py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {t("mkt.hero.cta")}
          </a>
          <Link
            href="/plans"
            className="rounded-xl border border-white/20 px-8 py-3.5 font-heading text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            {t("mkt.nav.plans")}
          </Link>
        </div>
      </section>
    </>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
        active
          ? "bg-[var(--color-primary)] text-white shadow-sm"
          : "text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
      }`}
    >
      {label}
    </button>
  );
}
