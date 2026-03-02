"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { getSite, updateSite, removeSite, getHistory, type ConstructionSite, type HistoryEntry } from "@/lib/storage";
import { TaskIcon } from "@/components/task-icon";
import { ArrowLeft, Copy, Check, MapPin, ExternalLink, Trash2 } from "lucide-react";

function MapPreview({ lat, lng, address, dark }: { lat?: number; lng?: number; address?: string; dark?: boolean }) {
  const tiles = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  if (lat && lng) {
    const doc = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9/dist/leaflet.js"><\/script>
<style>*{margin:0;padding:0}#m{height:100vh;width:100vw}
.leaflet-control-attribution{display:none!important}</style>
</head><body><div id="m"></div><script>
var m=L.map('m',{zoomControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,keyboard:false}).setView([${lat},${lng}],15);
L.tileLayer('${tiles}',{subdomains:'abcd',maxZoom:19}).addTo(m);
L.circleMarker([${lat},${lng}],{radius:7,fillColor:'#22c55e',color:'#fff',weight:2.5,fillOpacity:1}).addTo(m);
<\/script></body></html>`;
    return (
      <iframe
        srcDoc={doc}
        className="h-44 w-full border-0"
        loading="lazy"
        title="Map"
        sandbox="allow-scripts"
      />
    );
  }

  if (address) {
    const doc = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9/dist/leaflet.js"><\/script>
<style>*{margin:0;padding:0}#m{height:100vh;width:100vw}
.leaflet-control-attribution{display:none!important}</style>
</head><body><div id="m"></div><script>
var m=L.map('m',{zoomControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,keyboard:false}).setView([46.8,-71.2],6);
L.tileLayer('${tiles}',{subdomains:'abcd',maxZoom:19}).addTo(m);
<\/script></body></html>`;
    return (
      <div className="relative h-44 w-full overflow-hidden">
        <iframe srcDoc={doc} className="h-full w-full border-0 opacity-30" loading="lazy" title="Map" sandbox="allow-scripts" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm backdrop-blur-sm dark:bg-neutral-800/90 dark:text-neutral-400">
            <MapPin className="mr-1 inline h-3.5 w-3.5" />
            {address}
          </span>
        </div>
      </div>
    );
  }

  return null;
}

function generateFakeActivity(siteName: string): HistoryEntry[] {
  const tasks = [
    { id: "coffrage", title: "Coffrage", icon: "🪵" },
    { id: "coulage-beton", title: "Coulage béton", icon: "🧱" },
    { id: "ferraillage", title: "Ferraillage / Armature", icon: "🔩" },
    { id: "echafaudage", title: "Échafaudage", icon: "🏗️" },
    { id: "electricite", title: "Électricité", icon: "⚡" },
    { id: "soudage", title: "Soudage / Coupage", icon: "🔥" },
  ];
  const workers = [
    { name: "Marc-Antoine", company: "Pomerleau" },
    { name: "Stéphane", company: "EBC Inc." },
    { name: "Jean-Pierre", company: "Groupe Canam" },
    { name: "Luc", company: "Broccolini" },
    { name: "Patrick", company: "Kiewit" },
  ];
  const now = Date.now();
  const DAY = 86400000;
  const entries: HistoryEntry[] = [];

  for (let i = 0; i < 8; i++) {
    const t = tasks[i % tasks.length];
    const w = workers[i % workers.length];
    const total = 10 + Math.floor(Math.random() * 10);
    const date = new Date(now - i * DAY * 0.7);
    date.setHours(7 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
    entries.push({
      taskId: t.id,
      taskTitle: t.title,
      taskIcon: t.icon,
      workerName: w.name,
      workerCompany: w.company,
      checkedCount: total,
      totalCount: total,
      completedAt: date.toISOString(),
      siteName,
    });
  }
  return entries;
}

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const siteId = params.siteId as string;

  const [site, setSite] = useState<ConstructionSite | null>(null);
  const [activity, setActivity] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const s = getSite(siteId);
    setSite(s);
    if (s) {
      const real = getHistory().filter((e) => e.siteName === s.name);
      setActivity(real.length > 0 ? real : generateFakeActivity(s.name));
    }
  }, [siteId]);

  const handleToggleActive = useCallback(() => {
    if (!site) return;
    const next = !(site.active !== false);
    updateSite(site.id, { active: next });
    setSite({ ...site, active: next });
  }, [site]);

  const handleCopyAddress = useCallback(() => {
    if (!site?.address) return;
    void navigator.clipboard.writeText(site.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [site]);

  const handleDelete = useCallback(() => {
    if (!site) return;
    removeSite(site.id);
    router.push("/");
  }, [site, router]);

  const dateLocale = locale === "en" ? "en-CA" : "fr-FR";

  if (!site) {
    return (
      <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
        <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80">
            <ArrowLeft className="h-4 w-4" />
            {t("nav.back")}
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-5">
          <p className="text-gray-500 dark:text-neutral-400">{t("task.notFound")}</p>
        </main>
      </div>
    );
  }

  const isActive = site.active !== false;
  const mapsUrl = site.lat && site.lng
    ? `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`
    : site.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`
      : null;

  return (
    <div className="flex min-h-dvh flex-col dark:bg-neutral-900">
      {/* Header */}
      <div className="safe-area-green-cover" />
      <header className="bg-[var(--color-header)] px-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-5 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors active:text-white">
            <ArrowLeft className="h-4 w-4" />
            {t("nav.back")}
          </Link>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/70 transition-colors active:bg-white/30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors active:bg-white/30"
              >
                {t("nav.back")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors active:bg-red-600"
              >
                {t("siteDetail.deleteConfirm")}
              </button>
            </div>
          )}
        </div>
        <h1 className="mt-3 font-heading text-2xl font-bold text-white">{site.name}</h1>
        {site.address && (
          <p className="mt-1 text-sm text-white/70">{site.address}</p>
        )}
      </header>

      <main className="flex-1 px-5 py-5 sm:px-8">
        {/* Status + info */}
        <section className="mb-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            {/* Active toggle */}
            <button
              type="button"
              onClick={handleToggleActive}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors active:bg-gray-50 dark:active:bg-neutral-700"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">{t("siteDetail.status")}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${isActive ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"}`}>
                {isActive ? t("siteDetail.active") : t("siteDetail.inactive")}
              </span>
            </button>

            {/* Map preview */}
            {(site.lat || site.address) && (
              <div className="border-t border-gray-100 dark:border-neutral-700">
                <MapPreview lat={site.lat} lng={site.lng} address={site.address} dark={theme === "dark"} />
              </div>
            )}

            {/* Address with copy */}
            {site.address && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3.5 dark:border-neutral-700">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 dark:text-neutral-400">{t("siteDetail.address")}</p>
                  <p className="mt-0.5 text-sm text-gray-700 dark:text-neutral-200">{site.address}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="ml-3 flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t("siteDetail.copied") : t("siteDetail.copyAddress")}
                </button>
              </div>
            )}

            {/* Created date */}
            {site.createdAt && (
              <div className="border-t border-gray-100 px-4 py-3.5 dark:border-neutral-700">
                <p className="text-xs text-gray-500 dark:text-neutral-400">{t("siteDetail.createdAt")}</p>
                <p className="mt-0.5 text-sm text-gray-700 dark:text-neutral-200">
                  {new Date(site.createdAt).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}

            {/* Open in Maps */}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-gray-100 px-4 py-3.5 text-sm font-medium text-[var(--color-primary)] transition-colors active:bg-gray-50 dark:border-neutral-700 dark:active:bg-neutral-700"
              >
                <MapPin className="h-4 w-4" />
                {t("siteDetail.openMaps")}
                <ExternalLink className="h-3.5 w-3.5 opacity-50" />
              </a>
            )}
          </div>
        </section>

        {/* Activity */}
        <section className="mb-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
            {t("siteDetail.activity")}
          </h2>
          {activity.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm text-gray-500 dark:text-neutral-400">{t("siteDetail.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((entry, i) => (
                <div
                  key={`${entry.taskId}-${entry.completedAt}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300">
                    <TaskIcon taskId={entry.taskId} className="h-5 w-5" fallback={entry.taskIcon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-semibold leading-tight">{entry.taskTitle}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                      {new Date(entry.completedAt).toLocaleDateString(dateLocale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {entry.workerName ? ` — ${entry.workerName}` : ""}
                      {entry.workerCompany && <span className="text-gray-400 dark:text-neutral-500"> · {entry.workerCompany}</span>}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-green-100 px-2 py-0.5 font-heading text-[10px] font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
                    ✓ {entry.checkedCount}/{entry.totalCount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
