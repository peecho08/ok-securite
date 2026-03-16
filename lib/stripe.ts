import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  silver: {
    name: "Silver",
    priceId: process.env.STRIPE_SILVER_PRICE_ID!,
  },
  gold: {
    name: "Gold",
    priceId: process.env.STRIPE_GOLD_PRICE_ID!,
  },
} as const;

export type PlanId = keyof typeof PLANS;
