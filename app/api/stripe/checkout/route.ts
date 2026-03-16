import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";
import { APP_URL } from "@/lib/urls";
import { z } from "zod";

const TRIAL_DAYS = 14;

const schema = z.object({
  plan: z.enum(["silver", "gold"]),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { plan } = parsed.data;
    const planConfig = PLANS[plan as PlanId];

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id, email")
      .eq("id", userId)
      .single();

    if (!profile?.org_id) {
      return Response.json({ error: "Create a team first" }, { status: 400 });
    }

    const { data: existingSub } = await supabaseAdmin()
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("org_id", profile.org_id)
      .single();

    if (existingSub?.stripe_subscription_id) {
      return Response.json({ error: "Already subscribed. Manage via billing portal." }, { status: 400 });
    }

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: profile.email ?? undefined,
        metadata: {
          org_id: profile.org_id,
          clerk_user_id: userId,
        },
      });
      customerId = customer.id;
    }

    const origin = req.headers.get("origin") || APP_URL;

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
      },
      success_url: `${origin}/plans?success=true`,
      cancel_url: `${origin}/plans?canceled=true`,
      metadata: {
        org_id: profile.org_id,
        plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("POST /api/stripe/checkout:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
