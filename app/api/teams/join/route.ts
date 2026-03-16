import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { notifyTeamJoined } from "@/lib/notifications";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();
  if (!token || typeof token !== "string") {
    return Response.json({ error: "Invite token is required" }, { status: 400 });
  }

  const { data: org } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .eq("invite_token", token.trim())
    .single();

  if (!org) {
    return Response.json({ error: "Invalid invite link" }, { status: 404 });
  }

  const { error: memberError } = await supabaseAdmin
    .from("org_members")
    .upsert(
      { org_id: org.id, user_id: userId, role: "worker" },
      { onConflict: "org_id,user_id" }
    );

  if (memberError) {
    return Response.json({ error: memberError.message }, { status: 500 });
  }

  await supabaseAdmin
    .from("profiles")
    .update({ org_id: org.id })
    .eq("id", userId);

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  notifyTeamJoined(profile?.full_name || "Nouveau membre", org.id).catch(console.error);

  return Response.json({ org: { id: org.id, name: org.name } });
}
