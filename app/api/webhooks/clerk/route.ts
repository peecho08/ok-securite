import { Webhook } from "svix";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { wipeUser } from "@/lib/supabase/wipe-user";

interface ClerkUserEvent {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
  type: string;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkUserEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    const { type, data } = evt;
    const email = data.email_addresses?.[0]?.email_address ?? null;
    const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

    if (type === "user.created") {
      await supabaseAdmin().from("profiles").insert({
        id: data.id,
        email,
        full_name: fullName,
        avatar_url: data.image_url,
        role: null,
        updated_at: new Date().toISOString(),
      });
    }

    if (type === "user.updated") {
      await supabaseAdmin()
        .from("profiles")
        .update({
          email,
          full_name: fullName,
          avatar_url: data.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    }

    if (type === "user.deleted") {
      await wipeUser(data.id);
    }
  } catch (err) {
    console.error("Clerk webhook DB error:", err);
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
