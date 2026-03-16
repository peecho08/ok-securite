import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyChecklistCompleted } from "@/lib/notifications";
import { z } from "zod";

const completeSchema = z.object({
  taskId: z.string().min(1),
  taskTitle: z.string().min(1),
  taskIcon: z.string().optional(),
  workerName: z.string().optional(),
  siteName: z.string().optional(),
  siteId: z.string().optional(),
  checkedCount: z.number().int().min(0),
  totalCount: z.number().int().min(1),
  location: z.string().optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = completeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { taskId, taskTitle, taskIcon, workerName, siteName, siteId, checkedCount, totalCount } = parsed.data;

  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("org_id, full_name")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id ?? null;
  const displayName = workerName || profile?.full_name || "Unknown";

  const { error: insertError } = await supabaseAdmin().from("history").insert({
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
    completed_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Failed to insert history:", insertError.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  try {
    await notifyChecklistCompleted(userId, taskTitle, displayName, orgId);
  } catch (err) {
    console.error("Failed to notify supervisors:", err);
  }

  return NextResponse.json({ ok: true });
}
