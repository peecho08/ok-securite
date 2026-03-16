import { auth, clerkClient } from "@clerk/nextjs/server";
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

    const mapped = (members ?? []).map((m: Record<string, unknown>) => ({
      id: m.id,
      userId: m.user_id as string,
      role: m.role,
      joinedAt: m.joined_at,
      profile: m.profiles as { id: string; full_name: string | null; email: string | null; avatar_url: string | null; role: string | null } | null,
    }));

    const missing = mapped.filter((m) => !m.profile?.full_name && !m.profile?.email);
    if (missing.length > 0) {
      try {
        const clerk = await clerkClient();
        await Promise.all(
          missing.map(async (m) => {
            try {
              const user = await clerk.users.getUser(m.userId);
              const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || null;
              const email = user.emailAddresses?.[0]?.emailAddress ?? null;
              if (fullName || email) {
                const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
                if (fullName) update.full_name = fullName;
                if (email) update.email = email;
                await supabaseAdmin().from("profiles").update(update).eq("id", m.userId);
                m.profile = { ...(m.profile ?? { id: m.userId, avatar_url: null, role: null, full_name: null, email: null }), full_name: fullName, email };
              }
            } catch { /* skip individual member failures */ }
          })
        );
      } catch { /* skip clerk failures */ }
    }

    return Response.json({ org, members: mapped });
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

    const { data: target, error: targetErr } = await supabaseAdmin()
      .from("org_members")
      .select("id, org_id, user_id")
      .eq("id", memberId)
      .single();

    if (targetErr || !target) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    const { data: callerMembership, error: callerErr } = await supabaseAdmin()
      .from("org_members")
      .select("org_id, role")
      .eq("user_id", userId)
      .eq("org_id", target.org_id)
      .single();

    if (callerErr || !callerMembership || !["supervisor", "admin"].includes(callerMembership.role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (target.user_id === userId) {
      return Response.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    const { error: deleteErr } = await supabaseAdmin()
      .from("org_members")
      .delete()
      .eq("id", memberId);

    if (deleteErr) {
      console.error("DELETE org_members:", deleteErr);
      return Response.json({ error: "Failed to remove member" }, { status: 500 });
    }

    const { error: profileErr } = await supabaseAdmin()
      .from("profiles")
      .update({ org_id: null, updated_at: new Date().toISOString() })
      .eq("id", target.user_id);

    if (profileErr) {
      console.error("UPDATE profiles.org_id:", profileErr);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/teams/members:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
