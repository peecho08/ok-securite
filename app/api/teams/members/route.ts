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
