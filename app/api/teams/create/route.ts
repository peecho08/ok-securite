import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name, taskIds } = await req.json();
  if (!name || typeof name !== "string") {
    return Response.json({ error: "Team name is required" }, { status: 400 });
  }

  const { data: org, error: orgError } = await supabaseAdmin
    .from("organizations")
    .insert({ name: name.trim(), created_by: userId })
    .select()
    .single();

  if (orgError) {
    return Response.json({ error: orgError.message }, { status: 500 });
  }

  await supabaseAdmin.from("org_members").insert({
    org_id: org.id,
    user_id: userId,
    role: "supervisor",
  });

  await supabaseAdmin
    .from("profiles")
    .update({ org_id: org.id, role: "supervisor" })
    .eq("id", userId);

  if (Array.isArray(taskIds) && taskIds.length > 0) {
    await supabaseAdmin
      .from("organizations")
      .update({ team_tasks: taskIds })
      .eq("id", org.id);
  }

  return Response.json({
    org,
    inviteUrl: `/join/${org.invite_token}`,
  });
}
