import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = (await req.json()) as { plan: string };
  if (!plan || !(plan in PLANS)) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planConfig = PLANS[plan as PlanId];

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("org_id, email")
    .eq("id", userId)
    .single();

  if (!profile?.org_id) {
    return Response.json({ error: "Create a team first" }, { status: 400 });
  }

  const { data: existingSub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("org_id", profile.org_id)
    .single();

  let customerId = existingSub?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email ?? undefined,
      metadata: {
        org_id: profile.org_id,
        clerk_user_id: userId,
      },
    });
    customerId = customer.id;
  }

  const origin = req.headers.get("origin") || "https://app.ok-chantier.com";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${origin}/plans?success=true`,
    cancel_url: `${origin}/plans?canceled=true`,
    metadata: {
      org_id: profile.org_id,
      plan,
    },
  });

  return Response.json({ url: session.url });
}
