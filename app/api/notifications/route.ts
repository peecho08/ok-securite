import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: notifications } = await supabaseAdmin()
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    const { count: unreadCount } = await supabaseAdmin()
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    return Response.json({
      notifications: notifications ?? [],
      unreadCount: unreadCount ?? 0,
    });
  } catch (err) {
    console.error("GET /api/notifications:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid().optional(),
  markAll: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const { id, markAll } = parsed.data;

    if (markAll) {
      await supabaseAdmin()
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
    } else if (id) {
      await supabaseAdmin()
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", userId);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/notifications:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
