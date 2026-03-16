"use client";

import { useEffect, useState } from "react";
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

export function usePlan(): PlanInfo {
  const [info, setInfo] = useState<PlanInfo>(cached ?? DEFAULT);

  useEffect(() => {
    if (cached) {
      setInfo(cached);
      return;
    }

    let cancelled = false;
    fetch("/api/plan")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const result: PlanInfo = { ...data, loading: false };
        cached = result;
        setInfo(result);
      })
      .catch(() => {
        if (!cancelled) setInfo({ ...DEFAULT, loading: false });
      });

    return () => { cancelled = true; };
  }, []);

  return info;
}

export function isPaid(plan: PlanTier): boolean {
  return plan === "silver" || plan === "gold";
}

export function invalidatePlanCache() {
  cached = null;
}
