"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { getSites, addSite, removeSite, type ConstructionSite } from "@/lib/storage";
import { PlaceAutocomplete } from "@/components/address-autocomplete";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";

export default function MySitesPage() {
  const { t } = useLocale();
  const [sites, setSites] = useState<ConstructionSite[]>([]);
  const [showAddSite, setShowAddSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAddress, setNewSiteAddress] = useState("");
  const [newSiteLat, setNewSiteLat] = useState<number | undefined>();
  const [newSiteLng, setNewSiteLng] = useState<number | undefined>();

  useEffect(() => {
    setSites(getSites());
  }, []);

  function handleAddSite() {
    const name = newSiteName.trim();
    if (!name) return;
    const site: ConstructionSite = {
      id: Math.random().toString(36).slice(2, 12),
      name,
      address: newSiteAddress.trim() || undefined,
      lat: newSiteLat,
      lng: newSiteLng,
      active: true,
      createdAt: new Date().toISOString(),
    };
    addSite(site);
    setSites(getSites());
    setNewSiteName("");
    setNewSiteAddress("");
    setNewSiteLat(undefined);
    setNewSiteLng(undefined);
    setShowAddSite(false);
  }

  function handleRemoveSite(id: string) {
    removeSite(id);
    setSites(getSites());
  }

  return (
    <div className="relative z-[2] mx-auto min-h-dvh w-full max-w-3xl bg-white shadow-sm dark:bg-neutral-900 dark:shadow-none">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/95 px-5 py-4 backdrop-blur dark:bg-neutral-900/95 sm:px-8">
        <Link
          href="/"
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
                disabled={!newSiteName.trim()}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {t("site.add")}
              </button>
            </div>
          </div>
        )}

        {sites.length > 0 && (
          <div className="space-y-2">
            {sites.map((site) => {
              const active = site.active !== false;
              return (
                <div
                  key={site.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <Link
                    href={`/sites/${site.id}`}
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
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary" : "bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"}`}>
                    {active ? t("siteDetail.active") : t("siteDetail.inactive")}
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
              );
            })}
          </div>
        )}

        {sites.length === 0 && !showAddSite && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-neutral-600" />
            <p className="text-sm text-gray-500 dark:text-neutral-400">{t("site.empty")}</p>
          </div>
        )}

        {!showAddSite && (
          <button
            type="button"
            onClick={() => setShowAddSite(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300 ${sites.length > 0 ? "mt-3" : ""}`}
          >
            <Plus className="h-4 w-4" />
            {t("site.add")}
          </button>
        )}
      </main>
    </div>
  );
}
