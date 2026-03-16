import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Profile, Subscription } from "@/lib/supabase/types";
import { type PlanTier, type PlanLimits, getPlanLimits } from "@/lib/stripe";

export async function getProfileServer(userId: string): Promise<Profile | null> {
  const { data } = await supabaseAdmin()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfileRoleServer(
  userId: string,
  role: "worker" | "supervisor"
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("profiles")
    .upsert(
      { id: userId, role, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
  if (error) console.error("updateProfileRoleServer:", error.message);
}

export async function getOrgSubscriptionServer(orgId: string): Promise<Subscription | null> {
  const { data } = await supabaseAdmin()
    .from("subscriptions")
    .select("*")
    .eq("org_id", orgId)
    .single();
  return data;
}

export async function getOrgPlanServer(orgId: string): Promise<PlanTier> {
  const sub = await getOrgSubscriptionServer(orgId);
  if (!sub || sub.status === "canceled") return "free";
  return sub.plan as PlanTier;
}

export async function getOrgLimitsServer(orgId: string): Promise<PlanLimits & { plan: PlanTier }> {
  const plan = await getOrgPlanServer(orgId);
  return { ...getPlanLimits(plan), plan };
}

export async function checkLimitServer(
  orgId: string,
  resource: "sites" | "customChecklists" | "teamMembers",
  currentCount: number
): Promise<{ allowed: boolean; plan: PlanTier; limit: number }> {
  const plan = await getOrgPlanServer(orgId);
  const limits = getPlanLimits(plan);
  const limit = limits[resource];
  return { allowed: currentCount < limit, plan, limit };
}
