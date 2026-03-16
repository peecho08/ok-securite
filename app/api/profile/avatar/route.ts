import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateProfileAvatarServer } from "@/lib/db-server";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BUCKET = "avatars";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/avatar.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const storage = supabaseAdmin().storage;

  const { data: existingFiles } = await storage.from(BUCKET).list(userId);
  if (existingFiles?.length) {
    const toRemove = existingFiles.map((f) => `${userId}/${f.name}`);
    await storage.from(BUCKET).remove(toRemove);
  }

  const { error } = await storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    console.error("Avatar upload error:", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: urlData } = storage.from(BUCKET).getPublicUrl(path);
  const avatarUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  await updateProfileAvatarServer(userId, avatarUrl);

  return NextResponse.json({ avatar_url: avatarUrl });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = supabaseAdmin().storage;
  const { data: existingFiles } = await storage.from(BUCKET).list(userId);
  if (existingFiles?.length) {
    const toRemove = existingFiles.map((f) => `${userId}/${f.name}`);
    await storage.from(BUCKET).remove(toRemove);
  }

  await updateProfileAvatarServer(userId, null);

  return NextResponse.json({ avatar_url: null });
}
