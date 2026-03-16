import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyChecklistCompleted } from "@/lib/notifications";
import { completeChecklistSchema } from "@/lib/schemas";
import { getOrgPlanServer } from "@/lib/db-server";
import { getPlanLimits } from "@/lib/stripe";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = completeChecklistSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { taskId, taskTitle, taskIcon, workerName, siteName, siteId, checkedCount, totalCount, notes, imageUrl } = parsed.data;

  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("org_id, full_name")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id ?? null;
  const displayName = workerName || profile?.full_name || "Unknown";

  const { data: inserted, error: insertError } = await supabaseAdmin().from("history").insert({
    user_id: userId,
    org_id: orgId,
    task_id: taskId,
    task_title: taskTitle,
    task_icon: taskIcon ?? null,
    worker_name: displayName,
    site_id: siteId ?? null,
    site_name: siteName ?? null,
    checked_count: checkedCount,
    total_count: totalCount,
    notes: notes ?? null,
    image_url: imageUrl ?? null,
    completed_at: new Date().toISOString(),
  }).select("id").single();

  if (insertError) {
    console.error("Failed to insert history:", insertError.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  try {
    const plan = orgId ? await getOrgPlanServer(orgId) : "free";
    const limits = getPlanLimits(plan);
    if (limits.emailNotifications) {
      await notifyChecklistCompleted(userId, taskTitle, displayName, orgId);
    }
  } catch (err) {
    console.error("Failed to notify supervisors:", err);
  }

  return NextResponse.json({ ok: true, id: inserted?.id ?? null });
}
