"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6 py-8 dark:bg-neutral-900">
      <p className="text-center font-medium text-gray-800 dark:text-neutral-200">
        Une erreur s&apos;est produite.
      </p>
      <p className="mt-2 text-center text-sm text-gray-500 dark:text-neutral-400">
        Rechargez la page ou réessayez plus tard.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 font-heading text-sm font-bold text-white"
      >
        Réessayer
      </button>
    </div>
  );
}
