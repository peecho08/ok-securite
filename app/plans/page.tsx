"use client";

import { useLocale } from "@/lib/i18n";
import { Check, Minus } from "lucide-react";
import { MarketingShell } from "@/components/marketing-shell";

interface Feature {
  labelKey: string;
  free: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
}

export default function PlansPage() {
  return (
    <MarketingShell>
      <PlansContent />
    </MarketingShell>
  );
}

function PlansContent() {
  const { t } = useLocale();

  const features: Feature[] = [
    { labelKey: "plans.feat.checklists", free: t("plans.feat.checklists.val"), silver: t("plans.feat.checklists.val"), gold: t("plans.feat.checklists.val") },
    { labelKey: "plans.feat.pdf", free: true, silver: true, gold: true },
    { labelKey: "plans.feat.custom", free: false, silver: t("plans.feat.custom.silver"), gold: t("plans.feat.custom.gold") },
    { labelKey: "plans.feat.team", free: false, silver: t("plans.feat.team.silver"), gold: t("plans.feat.team.gold") },
    { labelKey: "plans.feat.sites", free: false, silver: t("plans.feat.sites.silver"), gold: t("plans.feat.sites.gold") },
    { labelKey: "plans.feat.dashboard", free: false, silver: true, gold: true },
    { labelKey: "plans.feat.support", free: false, silver: false, gold: true },
    { labelKey: "plans.feat.branding", free: false, silver: false, gold: true },
  ];

  const tiers = [
    {
      nameKey: "plans.free",
      priceKey: "plans.free.price",
      descKey: "plans.free.desc",
      ctaKey: "plans.cta.free",
      popular: false,
      values: features.map((f) => f.free),
    },
    {
      nameKey: "plans.silver",
      priceKey: "plans.silver.price",
      descKey: "plans.silver.desc",
      ctaKey: "plans.cta.silver",
      popular: true,
      values: features.map((f) => f.silver),
    },
    {
      nameKey: "plans.gold",
      priceKey: "plans.gold.price",
      descKey: "plans.gold.desc",
      ctaKey: "plans.cta.gold",
      popular: false,
      values: features.map((f) => f.gold),
    },
  ];

  return (
    <section className="px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            {t("plans.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-gray-600 dark:text-neutral-400">
            {t("plans.subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.nameKey}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
                tier.popular
                  ? "border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/10 dark:shadow-[var(--color-primary)]/5"
                  : "border-gray-200 dark:border-neutral-700"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-white">
                  {t("plans.popular")}
                </span>
              )}

              <div className="mb-6">
                <h2 className="font-heading text-lg font-bold">{t(tier.nameKey)}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  {t(tier.descKey)}
                </p>
                <p className="mt-4 font-heading text-3xl font-bold">
                  {t(tier.priceKey)}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {features.map((feat, i) => {
                  const val = tier.values[i];
                  return (
                    <li key={feat.labelKey} className="flex items-start gap-2.5 text-sm">
                      {val === false ? (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 dark:text-neutral-600" />
                      ) : (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                      )}
                      <span className={val === false ? "text-gray-400 dark:text-neutral-500" : ""}>
                        {t(feat.labelKey)}
                        {typeof val === "string" && (
                          <span className="ml-1 font-medium text-gray-900 dark:text-neutral-100">
                            ({val})
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <a
                href="https://app.ok-chantier.com"
                className={`block rounded-xl py-3 text-center font-heading text-sm font-bold transition-colors ${
                  tier.popular
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {t(tier.ctaKey)}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
