"use client";

import { useEffect, useState, useCallback } from "react";
import type { PlanTier, PlanLimits } from "@/lib/stripe";

export interface PlanInfo extends PlanLimits {
  plan: PlanTier;
  loading: boolean;
}

const DEFAULT: PlanInfo = {
  plan: "free",
  customChecklists: 0,
  sites: 0,
  teamMembers: 0,
  dashboard: false,
  pdfExport: false,
  photoAttachments: false,
  emailNotifications: false,
  prioritySupport: false,
  branding: false,
  loading: true,
};

let cached: PlanInfo | null = null;
let cachedAt = 0;

const PLAN_CHANGED_EVENT = "plan-cache-invalidated";
const STALE_MS = 60_000;

function fetchPlan(onResult: (info: PlanInfo) => void, onError?: () => void) {
  fetch("/api/plan")
    .then((r) => r.json())
    .then((data) => {
      const result: PlanInfo = { ...data, loading: false };
      cached = result;
      cachedAt = Date.now();
      onResult(result);
    })
    .catch(() => onError?.());
}

export function usePlan(): PlanInfo {
  const [info, setInfo] = useState<PlanInfo>(cached ?? DEFAULT);

  const refresh = useCallback(() => {
    fetchPlan(setInfo, () => setInfo((prev) => ({ ...prev, loading: false })));
  }, []);

  useEffect(() => {
    if (cached) {
      setInfo(cached);
    } else {
      refresh();
    }

    const onInvalidated = () => refresh();
    window.addEventListener(PLAN_CHANGED_EVENT, onInvalidated);

    const onFocus = () => {
      if (!cachedAt || Date.now() - cachedAt > STALE_MS) refresh();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener(PLAN_CHANGED_EVENT, onInvalidated);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return info;
}

export function isPaid(plan: PlanTier): boolean {
  return plan === "silver" || plan === "gold";
}

export function invalidatePlanCache() {
  cached = null;
  cachedAt = 0;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PLAN_CHANGED_EVENT));
  }
}
