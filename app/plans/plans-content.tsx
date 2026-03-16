"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useLocale } from "@/lib/i18n";
import { Check, Minus, Loader2, X } from "lucide-react";
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
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const pendingPlan = searchParams.get("plan") as "silver" | "gold" | null;
  const [autoTriggered, setAutoTriggered] = useState(false);

  useEffect(() => {
    trackEvent("plan_page_viewed");
  }, []);

  const handleSubscribe = useCallback(async (plan: "silver" | "gold") => {
    setLoadingPlan(plan);
    setCheckoutError(null);
    trackEvent("plan_checkout_started", { plan, billing });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "Create a team first") {
        router.push(`/app/create-team?redirect_url=${encodeURIComponent(`/plans?plan=${plan}`)}`);
      } else if (data.error === "plan_not_configured") {
        setCheckoutError(t("plans.error.config"));
        setLoadingPlan(null);
      } else if (data.error === "stripe_error") {
        setCheckoutError(t("plans.error.stripe").replace("{message}", data.message || ""));
        setLoadingPlan(null);
      } else {
        setCheckoutError(t("plans.error.generic"));
        setLoadingPlan(null);
      }
    } catch {
      setCheckoutError(t("plans.error.generic"));
      setLoadingPlan(null);
    }
  }, [router, t, billing]);

  useEffect(() => {
    if (pendingPlan && isSignedIn && !autoTriggered && !success && !canceled) {
      setAutoTriggered(true);
      handleSubscribe(pendingPlan);
    }
  }, [pendingPlan, isSignedIn, autoTriggered, success, canceled, handleSubscribe]);

  const features: Feature[] = [
    { labelKey: "plans.feat.checklists", free: t("plans.feat.checklists.val"), silver: t("plans.feat.checklists.val"), gold: t("plans.feat.checklists.val") },
    { labelKey: "plans.feat.pdf", free: false, silver: true, gold: true },
    { labelKey: "plans.feat.photos", free: false, silver: false, gold: true },
    { labelKey: "plans.feat.emailNotif", free: false, silver: true, gold: true },
    { labelKey: "plans.feat.custom", free: t("plans.feat.custom.free"), silver: t("plans.feat.custom.silver"), gold: t("plans.feat.custom.gold") },
    { labelKey: "plans.feat.team", free: t("plans.feat.team.free"), silver: t("plans.feat.team.silver"), gold: t("plans.feat.team.gold") },
    { labelKey: "plans.feat.sites", free: t("plans.feat.sites.free"), silver: t("plans.feat.sites.silver"), gold: t("plans.feat.sites.gold") },
    { labelKey: "plans.feat.dashboard", free: false, silver: t("plans.feat.dashboard.silver"), gold: t("plans.feat.dashboard.gold") },
    { labelKey: "plans.feat.branding", free: false, silver: false, gold: true },
    { labelKey: "plans.feat.csvExport", free: false, silver: false, gold: true },
    { labelKey: "plans.feat.bulkPdf", free: false, silver: false, gold: true },
    { labelKey: "plans.feat.weeklyEmail", free: false, silver: false, gold: true },
    { labelKey: "plans.feat.support", free: false, silver: false, gold: true },
  ];

  const yearlySavings = {
    silver: "$58",
    gold: "$158",
  };

  type Tier = {
    nameKey: string;
    monthlyPriceKey: string;
    yearlyPriceKey: string;
    yearlyPerMonthKey: string;
    descKey: string;
    ctaKey: string;
    href: string | null;
    plan: "silver" | "gold" | null;
    highlighted: boolean;
    isPaid: boolean;
    savings: string | null;
    values: (string | boolean)[];
  };

  const tiers: Tier[] = [
    {
      nameKey: "plans.free",
      monthlyPriceKey: "plans.free.price",
      yearlyPriceKey: "plans.free.price",
      yearlyPerMonthKey: "plans.free.price",
      descKey: "plans.free.desc",
      ctaKey: "plans.cta.free",
      href: "/sign-up",
      plan: null,
      highlighted: false,
      isPaid: false,
      savings: null,
      values: features.map((f) => f.free),
    },
    {
      nameKey: "plans.silver",
      monthlyPriceKey: "plans.silver.price",
      yearlyPriceKey: "plans.silver.yearlyPrice",
      yearlyPerMonthKey: "plans.silver.yearlyPerMonth",
      descKey: "plans.silver.desc",
      ctaKey: isSignedIn ? "plans.cta.silver" : "plans.cta.signUpFirst",
      href: isSignedIn ? null : `/sign-up?redirect_url=${encodeURIComponent("/app/create-team?plan=silver")}`,
      plan: isSignedIn ? "silver" : null,
      highlighted: true,
      isPaid: true,
      savings: yearlySavings.silver,
      values: features.map((f) => f.silver),
    },
    {
      nameKey: "plans.gold",
      monthlyPriceKey: "plans.gold.price",
      yearlyPriceKey: "plans.gold.yearlyPrice",
      yearlyPerMonthKey: "plans.gold.yearlyPerMonth",
      descKey: "plans.gold.desc",
      ctaKey: isSignedIn ? "plans.cta.gold" : "plans.cta.signUpFirst",
      href: isSignedIn ? null : `/sign-up?redirect_url=${encodeURIComponent("/app/create-team?plan=gold")}`,
      plan: isSignedIn ? "gold" : null,
      highlighted: false,
      isPaid: true,
      savings: yearlySavings.gold,
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

        {/* Billing toggle */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium transition-colors ${billing === "monthly" ? "text-gray-900 dark:text-neutral-100" : "text-gray-400 dark:text-neutral-500"}`}>
            {t("plans.billingMonthly")}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={billing === "yearly"}
            onClick={() => setBilling((b) => b === "monthly" ? "yearly" : "monthly")}
            className={`relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
              billing === "yearly"
                ? "bg-[var(--color-primary)]"
                : "bg-gray-200 dark:bg-neutral-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${
                billing === "yearly" ? "translate-x-[28px]" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${billing === "yearly" ? "text-gray-900 dark:text-neutral-100" : "text-gray-400 dark:text-neutral-500"}`}>
            {t("plans.billingYearly")}
          </span>
          {billing === "yearly" && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/40 dark:text-green-300">
              -17%
            </span>
          )}
        </div>

        {success && (
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
            {t("plans.success")}
          </div>
        )}
        {canceled && (
          <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-center text-sm font-medium text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            {t("plans.canceled")}
          </div>
        )}
        {checkoutError && (
          <div className="mb-8 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
            <span>{checkoutError}</span>
            <button type="button" onClick={() => setCheckoutError(null)} className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-red-100 dark:hover:bg-red-900/50">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.nameKey}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
                tier.highlighted
                  ? "border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/10 dark:shadow-[var(--color-primary)]/5"
                  : "border-gray-200 dark:border-neutral-700"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-white">
                  {t("plans.popular")}
                </span>
              )}

              <div className="mb-6">
                <h2 className="font-heading text-lg font-bold">{t(tier.nameKey)}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  {t(tier.descKey)}
                </p>
                {billing === "yearly" && tier.isPaid ? (
                  <div className="mt-4">
                    <p className="flex items-baseline gap-1">
                      <span className="font-heading text-3xl font-bold">{t(tier.yearlyPerMonthKey)}</span>
                      <span className="text-sm text-gray-500 dark:text-neutral-400">
                        {t("plans.perMonth")}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                      {t(tier.yearlyPriceKey)} {t("plans.perYear")}
                    </p>
                    {tier.savings && (
                      <p className="mt-1 text-xs font-semibold text-green-600 dark:text-green-400">
                        {t("plans.yearlySave").replace("{amount}", tier.savings)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-bold">{t(tier.monthlyPriceKey)}</span>
                    {tier.isPaid && (
                      <span className="text-sm text-gray-500 dark:text-neutral-400">
                        {t("plans.perMonth")}
                      </span>
                    )}
                  </p>
                )}
                {tier.plan && (
                  <p className="mt-1 text-xs text-[var(--color-primary)]">
                    {t("plans.trial")}
                  </p>
                )}
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

              {tier.href ? (
                <a
                  href={tier.href}
                  className={`block rounded-xl py-3 text-center font-heading text-sm font-bold transition-colors ${
                    tier.highlighted
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                      : "border border-gray-200 bg-white hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  }`}
                >
                  {t(tier.ctaKey)}
                </a>
              ) : tier.plan ? (
                <button
                  onClick={() => handleSubscribe(tier.plan!)}
                  disabled={loadingPlan !== null}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-center font-heading text-sm font-bold transition-colors disabled:opacity-60 ${
                    tier.highlighted
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                      : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  }`}
                >
                  {loadingPlan === tier.plan && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {t(tier.ctaKey)}
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-neutral-400">
          {t("plans.launchNote")}
        </p>
      </div>
    </section>
  );
}
