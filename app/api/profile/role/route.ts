import { auth } from "@clerk/nextjs/server";
import { getProfileServer, updateProfileRoleServer } from "@/lib/db-server";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["worker", "supervisor"]),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response("Invalid role", { status: 400 });
    }

    const profile = await getProfileServer(userId);
    if (profile?.role) {
      return Response.json(
        { error: "Role is permanent and cannot be changed" },
        { status: 403 }
      );
    }

    await updateProfileRoleServer(userId, parsed.data.role);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("POST /api/profile/role:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
