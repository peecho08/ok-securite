import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = supabaseAdmin();

    const [profile, history, notifications, progress] = await Promise.all([
      db.from("profiles").select("*").eq("id", userId).single(),
      db.from("history").select("*").eq("user_id", userId).order("completed_at", { ascending: false }),
      db.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      db.from("checklist_progress").select("*").eq("user_id", userId),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: profile.data,
      history: history.data ?? [],
      notifications: notifications.data ?? [],
      checklistProgress: progress.data ?? [],
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="ok-securite-data-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    console.error("GET /api/account/export:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
