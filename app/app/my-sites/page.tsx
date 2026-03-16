"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { PlaceAutocomplete } from "@/components/address-autocomplete";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { usePlan } from "@/lib/hooks/use-plan";
import { LimitBanner } from "@/components/upgrade-banner";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

interface SiteRow {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  active: boolean;
  created_at: string;
}

export default function MySitesPage() {
  const { t } = useLocale();
  const planInfo = usePlan();
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSite, setShowAddSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAddress, setNewSiteAddress] = useState("");
  const [newSiteLat, setNewSiteLat] = useState<number | undefined>();
  const [newSiteLng, setNewSiteLng] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch("/api/teams/sites");
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const canAddSite = sites.length < planInfo.sites;
  const atLimit = sites.length >= planInfo.sites && planInfo.sites !== Infinity;

  async function handleAddSite() {
    const name = newSiteName.trim();
    if (!name || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/teams/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address: newSiteAddress.trim() || null,
          lat: newSiteLat ?? null,
          lng: newSiteLng ?? null,
        }),
      });
      if (res.ok) {
        trackEvent("site_created", { site_name: name });
        setNewSiteName("");
        setNewSiteAddress("");
        setNewSiteLat(undefined);
        setNewSiteLng(undefined);
        setShowAddSite(false);
        await fetchSites();
        toast.success(t("toast.siteAdded"));
      } else {
        toast.error(t("toast.error"));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveSite(id: string) {
    const res = await fetch(`/api/teams/sites?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSites((prev) => prev.filter((s) => s.id !== id));
      toast.success(t("toast.siteRemoved"));
    } else {
      toast.error(t("toast.error"));
    }
  }

  return (
    <div className="relative z-[2] mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur dark:bg-neutral-900/95 sm:px-8">
        <Link
          href="/app"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-heading text-lg font-bold">{t("site.title")}</h1>
      </header>

      <main className="px-5 pb-10 sm:px-8">
        {showAddSite && (
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
            <PlaceAutocomplete
              value={newSiteName}
              onChange={setNewSiteName}
              onPlaceSelected={({ name, address, lat, lng }) => {
                setNewSiteName(name);
                setNewSiteAddress(address);
                setNewSiteLat(lat);
                setNewSiteLng(lng);
              }}
              placeholder={t("site.namePlaceholder")}
              autoFocus
              className="mb-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-600"
              onKeyDown={(e) => { if (e.key === "Enter" && newSiteName.trim()) handleAddSite(); }}
            />
            <input
              type="text"
              value={newSiteAddress}
              onChange={(e) => setNewSiteAddress(e.target.value)}
              placeholder={t("site.addressPlaceholder")}
              className="mb-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-neutral-600 dark:bg-neutral-700 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-600"
              onKeyDown={(e) => { if (e.key === "Enter" && newSiteName.trim()) handleAddSite(); }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowAddSite(false); setNewSiteName(""); setNewSiteAddress(""); }}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {t("nav.back")}
              </button>
              <button
                type="button"
                onClick={handleAddSite}
                disabled={!newSiteName.trim() || saving}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {t("site.add")}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-neutral-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-neutral-700" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-neutral-700" />
                </div>
                <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-neutral-700" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {sites.length > 0 && (
              <div className="space-y-2">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <Link
                      href={`/app/sites/${site.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-sm font-semibold leading-tight">{site.name}</p>
                        {site.address && <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-neutral-400">{site.address}</p>}
                      </div>
                    </Link>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${site.active ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" : "bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"}`}>
                      {site.active ? t("siteDetail.active") : t("siteDetail.inactive")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSite(site.id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-neutral-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                      aria-label={t("site.remove")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {sites.length === 0 && !showAddSite && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-neutral-600" />
                <p className="text-sm text-gray-500 dark:text-neutral-400">{t("site.empty")}</p>
              </div>
            )}
          </>
        )}

        {atLimit && (
          <div className="mt-3">
            <LimitBanner messageKey="upgrade.sitesLimit" />
          </div>
        )}

        {!showAddSite && (
          <button
            type="button"
            onClick={() => setShowAddSite(true)}
            disabled={!canAddSite}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300 ${sites.length > 0 ? "mt-3" : ""}`}
          >
            <Plus className="h-4 w-4" />
            {t("site.add")}
          </button>
        )}
      </main>
    </div>
  );
}
