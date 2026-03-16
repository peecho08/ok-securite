import { auth } from "@clerk/nextjs/server";
import { getProfileServer, getOrgLimitsServer } from "@/lib/db-server";
import { getPlanLimits } from "@/lib/stripe";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await getProfileServer(userId);
    if (!profile?.org_id) {
      return Response.json({ plan: "free", ...getPlanLimits("free") });
    }

    const limits = await getOrgLimitsServer(profile.org_id);
    return Response.json(limits);
  } catch (err) {
    console.error("GET /api/plan:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
