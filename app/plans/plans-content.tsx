"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { Check, Minus, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Feature {
  labelKey: string;
  free: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
}

export function PlansContent() {
  return (
    <Suspense>
      <PlansInner />
    </Suspense>
  );
}

function PlansInner() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    trackEvent("plan_page_viewed", { success, canceled });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  }

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
      plan: null,
      popular: false,
      values: features.map((f) => f.free),
    },
    {
      nameKey: "plans.silver",
      priceKey: "plans.silver.price",
      descKey: "plans.silver.desc",
      ctaKey: "plans.cta.silver",
      plan: "silver",
      popular: true,
      values: features.map((f) => f.silver),
    },
    {
      nameKey: "plans.gold",
      priceKey: "plans.gold.price",
      descKey: "plans.gold.desc",
      ctaKey: "plans.cta.gold",
      plan: "gold",
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

        {success && (
          <div className="mx-auto mb-8 max-w-md rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            {t("plans.success")}
          </div>
        )}
        {canceled && (
          <div className="mx-auto mb-8 max-w-md rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            {t("plans.canceled")}
          </div>
        )}

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

              {tier.plan ? (
                <button
                  type="button"
                  onClick={() => handleCheckout(tier.plan!)}
                  disabled={loading !== null}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-center font-heading text-sm font-bold transition-colors disabled:opacity-60 ${
                    tier.popular
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {loading === tier.plan && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t(tier.ctaKey)}
                </button>
              ) : (
                <a
                  href="/sign-up"
                  className="block rounded-xl border border-gray-200 bg-white py-3 text-center font-heading text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  {t(tier.ctaKey)}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handlePortal}
            disabled={loading !== null}
            className="text-sm text-gray-500 underline transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            {loading === "portal" && <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />}
            {t("plans.manageSubscription")}
          </button>
        </div>
      </div>
    </section>
  );
}
