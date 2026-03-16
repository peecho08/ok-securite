import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export type BillingInterval = "monthly" | "yearly";

export const PLANS = {
  silver: {
    name: "Silver",
    get priceId() { return process.env.STRIPE_SILVER_PRICE_ID!; },
    get yearlyPriceId() { return process.env.STRIPE_SILVER_YEARLY_PRICE_ID!; },
  },
  gold: {
    name: "Gold",
    get priceId() { return process.env.STRIPE_GOLD_PRICE_ID!; },
    get yearlyPriceId() { return process.env.STRIPE_GOLD_YEARLY_PRICE_ID!; },
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type PlanTier = "free" | PlanId;

export interface PlanLimits {
  customChecklists: number;
  sites: number;
  teamMembers: number;
  dashboard: boolean;
  pdfExport: boolean;
  photoAttachments: boolean;
  emailNotifications: boolean;
  prioritySupport: boolean;
  branding: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    customChecklists: 0,
    sites: 1,
    teamMembers: 3,
    dashboard: false,
    pdfExport: false,
    photoAttachments: false,
    emailNotifications: false,
    prioritySupport: false,
    branding: false,
  },
  silver: {
    customChecklists: 3,
    sites: Infinity,
    teamMembers: 10,
    dashboard: true,
    pdfExport: true,
    photoAttachments: false,
    emailNotifications: true,
    prioritySupport: false,
    branding: false,
  },
  gold: {
    customChecklists: Infinity,
    sites: Infinity,
    teamMembers: Infinity,
    dashboard: true,
    pdfExport: true,
    photoAttachments: true,
    emailNotifications: true,
    prioritySupport: true,
    branding: true,
  },
};

export function getPlanLimits(plan: PlanTier): PlanLimits {
  return PLAN_LIMITS[plan];
}
