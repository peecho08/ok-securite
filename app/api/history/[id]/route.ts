import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id;
  if (!orgId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: entry } = await supabaseAdmin()
    .from("history")
    .select("*")
    .eq("id", id)
    .eq("org_id", orgId)
    .single();

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: entry.id,
    taskId: entry.task_id,
    taskTitle: entry.task_title,
    taskIcon: entry.task_icon,
    workerName: entry.worker_name,
    workerCompany: entry.worker_company ?? null,
    siteName: entry.site_name ?? null,
    completedAt: entry.completed_at,
    checkedCount: entry.checked_count,
    totalCount: entry.total_count,
    notes: entry.notes ?? null,
    imageUrl: entry.image_url ?? null,
    pdfUrl: entry.pdf_url ?? null,
  });
}

const patchSchema = z.object({
  pdfUrl: z.string().url(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("history")
    .update({ pdf_url: parsed.data.pdfUrl })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to update history pdf_url:", error.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
