import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.org_id;
        const plan = session.metadata?.plan || "silver";
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (orgId) {
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
          const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;
          const status = subscription.status === "trialing" ? "trialing" : "active";

          await supabaseAdmin().from("subscriptions").upsert(
            {
              org_id: orgId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan,
              status,
              current_period_end: new Date(periodEnd * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "org_id" }
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const periodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;
        const { data: sub } = await supabaseAdmin()
          .from("subscriptions")
          .select("org_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (sub) {
          const statusMap: Record<string, string> = {
            active: "active",
            past_due: "past_due",
            canceled: "canceled",
            trialing: "trialing",
          };
          await supabaseAdmin()
            .from("subscriptions")
            .update({
              status: statusMap[subscription.status] || "active",
              current_period_end: new Date(periodEnd * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin()
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as unknown as { subscription: string | null }).subscription;
        if (subscriptionId) {
          await supabaseAdmin()
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }
    }
  } catch (err) {
    console.error(`Stripe webhook error (${event.type}):`, err);
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
