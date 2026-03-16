import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const BUCKET = "checklist-pdfs";

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

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const path = `${userId}/${Date.now()}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin().storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    console.error("PDF upload error:", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin().storage
    .from(BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({ url: urlData.publicUrl });
}
