import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { APP_URL } from "@/lib/urls";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id")
      .eq("id", userId)
      .single();

    if (!profile?.org_id) {
      return Response.json({ error: "No organization" }, { status: 400 });
    }

    const { data: sub } = await supabaseAdmin()
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("org_id", profile.org_id)
      .single();

    if (!sub?.stripe_customer_id) {
      return Response.json({ error: "No subscription" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || APP_URL;

    const session = await getStripe().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/plans`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("POST /api/stripe/portal:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
