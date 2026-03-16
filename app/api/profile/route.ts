import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfileServer } from "@/lib/db-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileServer(userId);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: profile.id,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: profile.role,
  });
}
