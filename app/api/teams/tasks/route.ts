import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  orgId: z.string().uuid(),
  taskIds: z.array(z.string()),
});

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const { orgId, taskIds } = parsed.data;

    const { data: member } = await supabaseAdmin()
      .from("org_members")
      .select("role")
      .eq("org_id", orgId)
      .eq("user_id", userId)
      .single();

    if (!member || !["supervisor", "admin"].includes(member.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabaseAdmin()
      .from("organizations")
      .update({ team_tasks: taskIds })
      .eq("id", orgId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/teams/tasks:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
