"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useLocale } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6 py-8 dark:bg-neutral-900">
      <p className="text-center font-medium text-gray-800 dark:text-neutral-200">
        {t("error.title")}
      </p>
      <p className="mt-2 text-center text-sm text-gray-500 dark:text-neutral-400">
        {t("error.subtitle")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 font-heading text-sm font-bold text-white"
      >
        {t("error.retry")}
      </button>
    </div>
  );
}
