import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getPlanLimits } from "@/lib/stripe";
import { z } from "zod";

const createSiteSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
});

const updateSiteSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id")
      .eq("id", userId)
      .single();

    if (!profile?.org_id) {
      return Response.json({ sites: [] });
    }

    const { data: sites } = await supabaseAdmin()
      .from("sites")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: false });

    return Response.json({ sites: sites ?? [] });
  } catch (err) {
    console.error("GET /api/teams/sites:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id, role")
      .eq("id", userId)
      .single();

    if (!profile?.org_id) {
      return Response.json({ error: "No team" }, { status: 400 });
    }

    if (profile.role !== "supervisor") {
      return Response.json({ error: "Only supervisors can add sites" }, { status: 403 });
    }

    const { data: sub } = await supabaseAdmin()
      .from("subscriptions")
      .select("plan, status")
      .eq("org_id", profile.org_id)
      .single();

    const plan = (!sub || sub.status === "canceled") ? "free" : sub.plan;
    const limits = getPlanLimits(plan);

    const { count } = await supabaseAdmin()
      .from("sites")
      .select("*", { count: "exact", head: true })
      .eq("org_id", profile.org_id);

    if ((count ?? 0) >= limits.sites) {
      return Response.json({ error: "site_limit" }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, lat, lng } = body;

    if (!name?.trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const { data: site, error } = await supabaseAdmin()
      .from("sites")
      .insert({
        org_id: profile.org_id,
        name: name.trim(),
        address: address?.trim() || null,
        lat: lat ?? null,
        lng: lng ?? null,
        active: true,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/teams/sites insert:", error.message);
      return Response.json({ error: "Failed to create site" }, { status: 500 });
    }

    return Response.json({ site });
  } catch (err) {
    console.error("POST /api/teams/sites:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id, role")
      .eq("id", userId)
      .single();

    if (!profile?.org_id || profile.role !== "supervisor") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...patch } = body;

    if (!id) {
      return Response.json({ error: "Site ID required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from("sites")
      .update(patch)
      .eq("id", id)
      .eq("org_id", profile.org_id);

    if (error) {
      console.error("PATCH /api/teams/sites:", error.message);
      return Response.json({ error: "Failed to update site" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/teams/sites:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin()
      .from("profiles")
      .select("org_id, role")
      .eq("id", userId)
      .single();

    if (!profile?.org_id || profile.role !== "supervisor") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Site ID required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from("sites")
      .delete()
      .eq("id", id)
      .eq("org_id", profile.org_id);

    if (error) {
      console.error("DELETE /api/teams/sites:", error.message);
      return Response.json({ error: "Failed to delete site" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/teams/sites:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
