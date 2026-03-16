"use client";

import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export default function BienEtrePage() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label={t("nav.back")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">{t("wellbeing.title")}</h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 sm:px-8">
        <p className="text-base text-gray-600 dark:text-neutral-300">
          {t("wellbeing.intro")}
        </p>

        <section className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 dark:border-primary/25 dark:bg-primary/10">
          <h2 className="font-heading text-lg font-bold text-primary-dark">
            {t("wellbeing.buildHealthy")}
          </h2>
          <p className="mt-2 text-sm text-primary-dark">
            {t("wellbeing.availability")}
          </p>
          <p className="mt-1 text-sm text-primary">
            {t("wellbeing.forWorkers")}
          </p>

          <a
            href="tel:18008072433"
            className="mt-4 flex items-center gap-3 rounded-xl bg-[var(--color-primary)] px-4 py-3.5 font-heading text-base font-bold text-white transition-colors active:bg-[var(--color-primary-dark)]"
          >
            <Phone className="h-5 w-5 shrink-0" />
            1 800 807-2433
          </a>

          <ul className="mt-4 space-y-1.5 text-sm text-primary-dark">
            <li>· {t("wellbeing.psychSupport")}</li>
            <li>· {t("wellbeing.stressSleep")}</li>
            <li>· {t("wellbeing.addictions")}</li>
            <li>· {t("wellbeing.chronic")}</li>
            <li>· {t("wellbeing.postTrauma")}</li>
          </ul>
        </section>

        <section className="mt-6 space-y-3">
          <a
            href="https://www.cnesst.gouv.qc.ca/fr/sante-securite-travail"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400 active:border-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
              {t("wellbeing.cnesst")}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {t("wellbeing.cnesstSub")}
            </p>
          </a>

          <a
            href="tel:18662773553"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400 active:border-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <Phone className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
            <div>
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Tel-Aide · 1 866 277-3553
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t("wellbeing.telAide")}
              </p>
            </div>
          </a>

          <a
            href="tel:18664277273"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400 active:border-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <Phone className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
            <div>
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Drogue: aide et référence · 1 866 427-7273
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t("wellbeing.drugHelp")}
              </p>
            </div>
          </a>

          <a
            href="tel:18006652000"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-400 active:border-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:active:border-neutral-400"
          >
            <Phone className="h-5 w-5 shrink-0 text-gray-500 dark:text-neutral-400" />
            <div>
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Jeu: aide et référence · 1 800 665-2000
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t("wellbeing.gamblingHelp")}
              </p>
            </div>
          </a>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-heading text-base font-bold text-gray-900 dark:text-neutral-100">
            {t("wellbeing.tips")}
          </h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">{t("wellbeing.tip1Title")}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                {t("wellbeing.tip1")}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">{t("wellbeing.tip2Title")}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                {t("wellbeing.tip2")}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-neutral-100">{t("wellbeing.tip3Title")}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                {t("wellbeing.tip3")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
