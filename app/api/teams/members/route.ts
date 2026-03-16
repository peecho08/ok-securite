import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id")
      .eq("id", userId)
      .single();

    if (!profile?.org_id) {
      return Response.json({ members: [], org: null });
    }

    const { data: org } = await supabaseAdmin()
      .from("organizations")
      .select("*")
      .eq("id", profile.org_id)
      .single();

    const { data: members } = await supabaseAdmin()
      .from("org_members")
      .select("*, profiles(id, full_name, email, avatar_url, role)")
      .eq("org_id", profile.org_id)
      .order("joined_at", { ascending: true });

    return Response.json({
      org,
      members: (members ?? []).map((m: Record<string, unknown>) => ({
        id: m.id,
        userId: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        profile: m.profiles,
      })),
    });
  } catch (err) {
    console.error("GET /api/teams/members:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { memberId } = await req.json().catch(() => ({ memberId: null }));
    if (!memberId) return Response.json({ error: "Missing memberId" }, { status: 400 });

    const { data: callerMembership } = await supabaseAdmin()
      .from("org_members")
      .select("org_id, role")
      .eq("user_id", userId)
      .single();

    if (!callerMembership || !["supervisor", "admin"].includes(callerMembership.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: target } = await supabaseAdmin()
      .from("org_members")
      .select("id, org_id, user_id")
      .eq("id", memberId)
      .single();

    if (!target || target.org_id !== callerMembership.org_id) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    if (target.user_id === userId) {
      return Response.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    await supabaseAdmin().from("org_members").delete().eq("id", memberId);

    await supabaseAdmin()
      .from("profiles")
      .update({ org_id: null, updated_at: new Date().toISOString() })
      .eq("id", target.user_id);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/teams/members:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
