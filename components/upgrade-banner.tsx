"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface UpgradeBannerProps {
  messageKey: string;
}

export function UpgradeBanner({ messageKey }: UpgradeBannerProps) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800/40 dark:bg-amber-950/30">
      <Lock className="mx-auto mb-3 h-8 w-8 text-amber-500 dark:text-amber-400" />
      <h2 className="font-heading text-base font-bold text-amber-900 dark:text-amber-200">
        {t("upgrade.title")}
      </h2>
      <p className="mt-1.5 text-sm text-amber-700 dark:text-amber-300/80">
        {t(messageKey)}
      </p>
      <Link
        href="/plans"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        {t("upgrade.cta")}
      </Link>
    </div>
  );
}

interface LimitBannerProps {
  messageKey: string;
}

export function LimitBanner({ messageKey }: LimitBannerProps) {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800/40 dark:bg-amber-950/30">
      <p className="text-sm text-amber-700 dark:text-amber-300/80">
        {t(messageKey)}
      </p>
      <Link
        href="/plans"
        className="mt-2 inline-flex text-sm font-semibold text-[var(--color-primary)] underline transition-colors hover:text-[var(--color-primary-dark)]"
      >
        {t("upgrade.cta")}
      </Link>
    </div>
  );
}
