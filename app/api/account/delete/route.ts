import { auth } from "@clerk/nextjs/server";
import { wipeUser } from "@/lib/supabase/wipe-user";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await wipeUser(userId);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/account/delete:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
