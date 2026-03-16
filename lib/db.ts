"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  Organization,
  OrgMember,
  Site,
  HistoryEntry,
  Report,
  Notification,
  Subscription,
} from "@/lib/supabase/types";

function supabase() {
  return createClient();
}

// ── Profile ────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  const { error } = await supabase()
    .from("profiles")
    .upsert(profile, { onConflict: "id" });
  if (error) console.error("upsertProfile:", error.message);
}

// ── Organizations ──────────────────────────────────────────────────

export async function createOrganization(
  name: string,
  createdBy: string
): Promise<Organization | null> {
  const { data, error } = await supabase()
    .from("organizations")
    .insert({ name, created_by: createdBy })
    .select()
    .single();
  if (error) {
    console.error("createOrganization:", error.message);
    return null;
  }

  await supabase().from("org_members").insert({
    org_id: data.id,
    user_id: createdBy,
    role: "supervisor",
  });

  await supabase()
    .from("profiles")
    .update({ org_id: data.id, role: "supervisor" })
    .eq("id", createdBy);

  return data;
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const { data } = await supabase()
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
  return data;
}

export async function getOrganizationByToken(token: string): Promise<Organization | null> {
  const { data } = await supabase()
    .from("organizations")
    .select("*")
    .eq("invite_token", token)
    .single();
  return data;
}

export async function updateOrganization(orgId: string, patch: Partial<Organization>) {
  const { error } = await supabase()
    .from("organizations")
    .update(patch)
    .eq("id", orgId);
  if (error) console.error("updateOrganization:", error.message);
}

// ── Org Members ────────────────────────────────────────────────────

export async function joinOrganization(orgId: string, userId: string, role = "worker") {
  const { error } = await supabase()
    .from("org_members")
    .upsert({ org_id: orgId, user_id: userId, role }, { onConflict: "org_id,user_id" });
  if (error) console.error("joinOrganization:", error.message);

  await supabase()
    .from("profiles")
    .update({ org_id: orgId })
    .eq("id", userId);
}

export async function getOrgMembers(orgId: string): Promise<(OrgMember & { profile?: Profile })[]> {
  const { data } = await supabase()
    .from("org_members")
    .select("*, profiles(*)")
    .eq("org_id", orgId)
    .order("joined_at", { ascending: true });
  return (data ?? []).map((m: Record<string, unknown>) => ({
    ...m,
    profile: m.profiles as Profile | undefined,
  })) as (OrgMember & { profile?: Profile })[];
}

export async function removeOrgMember(orgId: string, userId: string) {
  const { error } = await supabase()
    .from("org_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);
  if (error) console.error("removeOrgMember:", error.message);
}

// ── Sites ──────────────────────────────────────────────────────────

export async function getOrgSites(orgId: string): Promise<Site[]> {
  const { data } = await supabase()
    .from("sites")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getSiteById(siteId: string): Promise<Site | null> {
  const { data } = await supabase()
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .single();
  return data;
}

export async function createSite(site: Omit<Site, "id" | "created_at">): Promise<Site | null> {
  const { data, error } = await supabase()
    .from("sites")
    .insert(site)
    .select()
    .single();
  if (error) {
    console.error("createSite:", error.message);
    return null;
  }
  return data;
}

export async function updateSite(siteId: string, patch: Partial<Site>) {
  const { error } = await supabase()
    .from("sites")
    .update(patch)
    .eq("id", siteId);
  if (error) console.error("updateSite:", error.message);
}

export async function deleteSite(siteId: string) {
  const { error } = await supabase()
    .from("sites")
    .delete()
    .eq("id", siteId);
  if (error) console.error("deleteSite:", error.message);
}

// ── History ────────────────────────────────────────────────────────

export async function getUserHistory(userId: string, limit = 100): Promise<HistoryEntry[]> {
  const { data } = await supabase()
    .from("history")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getOrgHistory(orgId: string, limit = 100): Promise<HistoryEntry[]> {
  const { data } = await supabase()
    .from("history")
    .select("*")
    .eq("org_id", orgId)
    .order("completed_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function addHistoryEntry(entry: Omit<HistoryEntry, "id">) {
  const { error } = await supabase().from("history").insert(entry);
  if (error) console.error("addHistoryEntry:", error.message);
}

export async function getHistoryById(id: string): Promise<HistoryEntry | null> {
  const { data } = await supabase()
    .from("history")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getSiteHistory(siteName: string, orgId: string): Promise<HistoryEntry[]> {
  const { data } = await supabase()
    .from("history")
    .select("*")
    .eq("org_id", orgId)
    .eq("site_name", siteName)
    .order("completed_at", { ascending: false });
  return data ?? [];
}

// ── Reports ────────────────────────────────────────────────────────

export async function submitReport(report: Omit<Report, "id" | "created_at">) {
  const { error } = await supabase().from("reports").insert(report);
  if (error) console.error("submitReport:", error.message);
}

export async function getOrgReports(orgId: string): Promise<Report[]> {
  const { data } = await supabase()
    .from("reports")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserReportCount(userId: string): Promise<number> {
  const { count } = await supabase()
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

// ── Notifications ──────────────────────────────────────────────────

export async function getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
  const { data } = await supabase()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase()
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}

export async function markNotificationRead(notificationId: string) {
  await supabase()
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  await supabase()
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
}

export async function createNotification(notification: Omit<Notification, "id" | "read" | "created_at">) {
  const { error } = await supabase().from("notifications").insert(notification);
  if (error) console.error("createNotification:", error.message);
}

// ── Subscriptions ──────────────────────────────────────────────────

export async function getOrgSubscription(orgId: string): Promise<Subscription | null> {
  const { data } = await supabase()
    .from("subscriptions")
    .select("*")
    .eq("org_id", orgId)
    .single();
  return data;
}

export async function getOrgPlan(orgId: string): Promise<"free" | "silver" | "gold"> {
  const sub = await getOrgSubscription(orgId);
  if (!sub || sub.status === "canceled") return "free";
  return sub.plan;
}
