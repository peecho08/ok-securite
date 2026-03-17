"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { APP_URL } from "@/lib/urls";
import { MusicPlayer } from "@/components/music-player";
import { ClipboardCheck, CheckCircle, FileText, Quote, HardHat, Truck, Factory, Flame, Lock, ChevronDown, ShieldCheck, Layers, Zap } from "lucide-react";

export function MarketingHomeContent() {
  const { t } = useLocale();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-header)] px-5 pb-20 pt-28 text-center text-white sm:px-8 sm:pb-28 sm:pt-36">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/hero.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("mkt.hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75 sm:text-xl">
            {t("mkt.hero.subtitle")}
          </p>
          <a
            href={APP_URL}
            className="mt-8 inline-block rounded-xl bg-[var(--color-primary)] px-8 py-4 font-heading text-base font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] sm:text-lg"
          >
            {t("mkt.hero.cta")}
          </a>
        </div>
      </section>


      {/* Sub-branches */}
      <section className="bg-gray-50 px-5 py-16 dark:bg-neutral-900 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center font-heading text-2xl font-bold sm:text-3xl">
            {t("mkt.branches.title")}
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-sm text-gray-500 dark:text-neutral-400">
            {t("mkt.branches.subtitle")}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BranchCard
              icon={<HardHat className="h-7 w-7" />}
              name={t("mkt.branches.chantier")}
              description={t("mkt.branches.chantierDesc")}
              active
            />
            <BranchCard
              icon={<Truck className="h-7 w-7" />}
              name={t("mkt.branches.transport")}
              description={t("mkt.branches.transportDesc")}
            />
            <BranchCard
              icon={<Factory className="h-7 w-7" />}
              name={t("mkt.branches.industriel")}
              description={t("mkt.branches.industrielDesc")}
            />
            <BranchCard
              icon={<Flame className="h-7 w-7" />}
              name={t("mkt.branches.incendie")}
              description={t("mkt.branches.incendieDesc")}
            />
          </div>
        </div>
      </section>

      {/* 3-step explainer */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-heading text-2xl font-bold sm:text-3xl">
            {t("mkt.steps.title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
            <Step
              icon={<ClipboardCheck className="h-7 w-7" />}
              title={t("mkt.step1.title")}
              description={t("mkt.step1.desc")}
            />
            <Step
              icon={<CheckCircle className="h-7 w-7" />}
              title={t("mkt.step2.title")}
              description={t("mkt.step2.desc")}
            />
            <Step
              icon={<FileText className="h-7 w-7" />}
              title={t("mkt.step3.title")}
              description={t("mkt.step3.desc")}
            />
          </div>
        </div>
      </section>

      {/* Social proof stats */}
      <section className="border-y border-gray-100 bg-white px-5 py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold sm:text-3xl">
            {t("mkt.proof.title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <ProofStat icon={<ShieldCheck className="h-7 w-7" />} value={t("mkt.proof.stat1.value")} label={t("mkt.proof.stat1.label")} />
            <ProofStat icon={<Layers className="h-7 w-7" />} value={t("mkt.proof.stat2.value")} label={t("mkt.proof.stat2.label")} />
            <ProofStat icon={<Zap className="h-7 w-7" />} value={t("mkt.proof.stat3.value")} label={t("mkt.proof.stat3.label")} />
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 opacity-60 grayscale">
            <Image src="/cnesst-logo.svg" alt="CNESST" width={100} height={32} className="h-8 w-auto dark:invert" />
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Quote className="mx-auto mb-6 h-10 w-10 text-[var(--color-primary)] opacity-40" />
          <blockquote className="font-heading text-xl font-medium leading-relaxed text-gray-800 dark:text-neutral-100 sm:text-2xl">
            &ldquo;{t("mkt.testimonial.quote")}&rdquo;
          </blockquote>
          <div className="mt-6">
            <p className="font-heading text-sm font-bold text-gray-900 dark:text-neutral-100">
              {t("mkt.testimonial.author")}
            </p>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
              {t("mkt.testimonial.role")}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-5 py-16 dark:bg-neutral-900 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold sm:text-3xl">
            {t("mkt.faq.title")}
          </h2>
          <div className="space-y-3">
            {(["1", "2", "3", "4", "5", "6"] as const).map((n) => (
              <FaqItem key={n} question={t(`mkt.faq.q${n}`)} answer={t(`mkt.faq.a${n}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* Song */}
      <section className="bg-white px-5 py-12 dark:bg-neutral-950 sm:px-8">
        <div className="mx-auto max-w-md">
          <MusicPlayer />
        </div>
      </section>

      {/* CTA banner before footer */}
      <section className="bg-[var(--color-header)] px-5 py-14 text-center sm:px-8">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          OK Sécurité
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          {t("mkt.hero.subtitle")}
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

function Step({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        {icon}
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}

function ProofStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="font-heading text-3xl font-bold sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-heading text-sm font-bold sm:text-base">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform dark:text-neutral-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-gray-600 dark:border-neutral-700 dark:text-neutral-400">
          {answer}
        </div>
      )}
    </div>
  );
}

function BranchCard({
  icon,
  name,
  description,
  active,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  active?: boolean;
}) {
  const { t } = useLocale();

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-colors ${
        active
          ? "border-[var(--color-primary)]/30 bg-white shadow-sm dark:border-[var(--color-primary)]/20 dark:bg-neutral-800"
          : "border-gray-200 bg-white/60 opacity-60 dark:border-neutral-700 dark:bg-neutral-800/50"
      }`}
    >
      {active && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {t("mkt.branches.available")}
        </span>
      )}
      {!active && (
        <span className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
          <Lock className="h-2.5 w-2.5" />
          {t("mkt.branches.comingSoon")}
        </span>
      )}
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"}`}>
        {icon}
      </div>
      <h3 className="font-heading text-base font-bold">{name}</h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-neutral-400">{description}</p>
    </div>
  );
}
