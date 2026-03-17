import { supabaseAdmin } from "./admin";

const USER_BUCKETS = ["avatars", "checklist-images", "checklist-pdfs"] as const;

async function emptyBucket(bucket: string, userId: string) {
  const storage = supabaseAdmin().storage;
  const { data: files } = await storage.from(bucket).list(userId);
  if (!files?.length) return;

  const paths = files.map((f) => `${userId}/${f.name}`);
  await storage.from(bucket).remove(paths);
}

/**
 * Wipe every Supabase trace of a user: storage files + database rows.
 * The `profiles` delete cascades to org_members, checklist_progress,
 * history, reports, favorites, and notifications via FK constraints.
 */
export async function wipeUser(userId: string) {
  const db = supabaseAdmin();

  await Promise.all(USER_BUCKETS.map((b) => emptyBucket(b, userId)));

  await db.from("org_members").delete().eq("user_id", userId);
  await db.from("profiles").delete().eq("id", userId);
}
