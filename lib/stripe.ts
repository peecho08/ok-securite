import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const PLANS = {
  silver: {
    name: "Silver",
    get priceId() { return process.env.STRIPE_SILVER_PRICE_ID!; },
  },
  gold: {
    name: "Gold",
    get priceId() { return process.env.STRIPE_GOLD_PRICE_ID!; },
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type PlanTier = "free" | PlanId;

export interface PlanLimits {
  customChecklists: number;
  sites: number;
  teamMembers: number;
  dashboard: boolean;
  prioritySupport: boolean;
  branding: boolean;
}

// During early access, free tier gets full access (same as gold).
// Revert to restricted limits when paid plans go live.
export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    customChecklists: Infinity,
    sites: Infinity,
    teamMembers: Infinity,
    dashboard: true,
    prioritySupport: false,
    branding: false,
  },
  silver: {
    customChecklists: 10,
    sites: 3,
    teamMembers: 10,
    dashboard: true,
    prioritySupport: false,
    branding: false,
  },
  gold: {
    customChecklists: Infinity,
    sites: Infinity,
    teamMembers: Infinity,
    dashboard: true,
    prioritySupport: true,
    branding: true,
  },
};

export function getPlanLimits(plan: PlanTier): PlanLimits {
  return PLAN_LIMITS[plan];
}
