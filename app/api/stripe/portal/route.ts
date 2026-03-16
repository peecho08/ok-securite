import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  if (!profile?.org_id) {
    return Response.json({ error: "No organization" }, { status: 400 });
  }

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("org_id", profile.org_id)
    .single();

  if (!sub?.stripe_customer_id) {
    return Response.json({ error: "No subscription" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "https://app.ok-chantier.com";

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/plans`,
  });

  return Response.json({ url: session.url });
}
