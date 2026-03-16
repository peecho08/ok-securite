import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = supabaseAdmin();

    await Promise.all([
      db.from("notifications").delete().eq("user_id", userId),
      db.from("checklist_progress").delete().eq("user_id", userId),
      db.from("history").delete().eq("user_id", userId),
      db.from("favorites").delete().eq("user_id", userId),
      db.from("reports").delete().eq("user_id", userId),
    ]);

    await db.from("org_members").delete().eq("user_id", userId);
    await db.from("profiles").delete().eq("id", userId);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/account/delete:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
