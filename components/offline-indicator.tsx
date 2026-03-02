"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";

export function OfflineIndicator() {
  const { t } = useLocale();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[200] flex items-center justify-center gap-2 bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-700">
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M8.464 15.536a5 5 0 010-7.072M15.536 8.464a5 5 0 010 7.072" />
        <line x1="4" y1="4" x2="20" y2="20" strokeWidth={2} strokeLinecap="round" />
      </svg>
      {t("offline.message")}
    </div>
  );
}
