import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id;
  if (!orgId) {
    return NextResponse.json({ recentActivity: [], totalCompleted: 0, weekCompleted: 0, topWorkers: [], weekDays: [] });
  }

  const { data: allHistory } = await supabaseAdmin()
    .from("history")
    .select("*")
    .eq("org_id", orgId)
    .order("completed_at", { ascending: false })
    .limit(500);

  const entries = allHistory ?? [];

  const recentActivity = entries.slice(0, 20).map((e) => ({
    id: e.id,
    taskId: e.task_id,
    taskTitle: e.task_title,
    taskIcon: e.task_icon,
    workerName: e.worker_name,
    siteName: e.site_name,
    completedAt: e.completed_at,
    checkedCount: e.checked_count,
    totalCount: e.total_count,
    notes: e.notes ?? null,
    imageUrl: e.image_url ?? null,
    pdfUrl: e.pdf_url ?? null,
  }));

  const totalCompleted = entries.length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekEntries = entries.filter(
    (e) => new Date(e.completed_at) >= weekAgo
  );
  const weekCompleted = weekEntries.length;

  const workerCounts: Record<string, number> = {};
  for (const e of entries) {
    const name = e.worker_name || "—";
    workerCounts[name] = (workerCounts[name] || 0) + 1;
  }
  const topWorkers = Object.entries(workerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const e of weekEntries) {
    const day = new Date(e.completed_at).toISOString().slice(0, 10);
    if (day in dayMap) dayMap[day]++;
  }
  const weekDays = Object.entries(dayMap).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({
    recentActivity,
    totalCompleted,
    weekCompleted,
    topWorkers,
    weekDays,
  });
}
