import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(200).trim(),
  taskIds: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Team name is required" }, { status: 400 });
    }

    const { name, taskIds } = parsed.data;

    const { data: org, error: orgError } = await supabaseAdmin()
      .from("organizations")
      .insert({ name, created_by: userId })
      .select()
      .single();

    if (orgError) {
      return Response.json({ error: orgError.message }, { status: 500 });
    }

    await supabaseAdmin().from("org_members").insert({
      org_id: org.id,
      user_id: userId,
      role: "supervisor",
    });

    const user = await currentUser();
    const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || null : null;
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

    const profileUpdate: Record<string, unknown> = {
      org_id: org.id,
      role: "supervisor",
      updated_at: new Date().toISOString(),
    };
    if (fullName) profileUpdate.full_name = fullName;
    if (email) profileUpdate.email = email;

    await supabaseAdmin()
      .from("profiles")
      .update(profileUpdate)
      .eq("id", userId);

    await supabaseAdmin().from("subscriptions").upsert(
      {
        org_id: org.id,
        plan: "free",
        status: "active",
      },
      { onConflict: "org_id" }
    );

    if (taskIds && taskIds.length > 0) {
      await supabaseAdmin()
        .from("organizations")
        .update({ team_tasks: taskIds })
        .eq("id", org.id);
    }

    return Response.json({
      org,
      inviteUrl: `/app/join/${org.invite_token}`,
    });
  } catch (err) {
    console.error("POST /api/teams/create:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
