import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyTeamJoined } from "@/lib/notifications";
import { checkLimitServer } from "@/lib/db-server";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1).max(100).trim(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invite token is required" }, { status: 400 });
    }

    const { token } = parsed.data;

    const { data: org } = await supabaseAdmin()
      .from("organizations")
      .select("*")
      .eq("invite_token", token)
      .single();

    if (!org) {
      return Response.json({ error: "Invalid invite link" }, { status: 404 });
    }

    const { count: memberCount } = await supabaseAdmin()
      .from("org_members")
      .select("*", { count: "exact", head: true })
      .eq("org_id", org.id);

    const { allowed, plan, limit } = await checkLimitServer(
      org.id,
      "teamMembers",
      memberCount ?? 0
    );

    if (!allowed) {
      return Response.json(
        { error: "team_full", plan, limit },
        { status: 403 }
      );
    }

    await supabaseAdmin()
      .from("profiles")
      .upsert(
        { id: userId, role: "worker", org_id: org.id, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

    const { error: memberError } = await supabaseAdmin()
      .from("org_members")
      .upsert(
        { org_id: org.id, user_id: userId, role: "worker" },
        { onConflict: "org_id,user_id" }
      );

    if (memberError) {
      return Response.json({ error: memberError.message }, { status: 500 });
    }

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    notifyTeamJoined(profile?.full_name || "Nouveau membre", org.id).catch(console.error);

    return Response.json({ org: { id: org.id, name: org.name } });
  } catch (err) {
    console.error("POST /api/teams/join:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
