import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id")
      .eq("id", userId)
      .single();

    if (!profile?.org_id) {
      return Response.json({ inTeam: false, orgId: null, teamName: null, teamTasks: [] });
    }

    const { data: org } = await supabaseAdmin()
      .from("organizations")
      .select("id, name, team_tasks")
      .eq("id", profile.org_id)
      .single();

    if (!org) {
      return Response.json({ inTeam: false, orgId: null, teamName: null, teamTasks: [] });
    }

    return Response.json({
      inTeam: true,
      orgId: org.id,
      teamName: org.name,
      teamTasks: org.team_tasks ?? [],
    });
  } catch (err) {
    console.error("GET /api/profile/team-check:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
