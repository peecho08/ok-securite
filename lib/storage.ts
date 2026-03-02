const PREFIX = "okchantier";

function key(...parts: string[]) {
  return `${PREFIX}:${parts.join(":")}`;
}

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// ── Checklist progress (persists until finished or deleted) ──────

export interface ProgressData {
  checked: string[];
  na: string[];
}

function progressKey(taskId: string) {
  return key("progress", taskId);
}

function parseProgress(raw: string | null): ProgressData {
  if (!raw) return { checked: [], na: [] };
  const parsed = JSON.parse(raw);
  // Backward compat: old format was a flat string[]
  if (Array.isArray(parsed)) return { checked: parsed, na: [] };
  return { checked: parsed.checked ?? [], na: parsed.na ?? [] };
}

export function loadProgress(taskId: string): ProgressData {
  const s = safeStorage();
  if (!s) return { checked: [], na: [] };
  try {
    return parseProgress(s.getItem(progressKey(taskId)));
  } catch {
    return { checked: [], na: [] };
  }
}

export function saveProgress(taskId: string, data: ProgressData) {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(progressKey(taskId), JSON.stringify(data));
  } catch { /* quota exceeded — ignore */ }
}

export function clearProgress(taskId: string) {
  const s = safeStorage();
  if (!s) return;
  try {
    s.removeItem(progressKey(taskId));
  } catch { /* ignore */ }
}

export function getActiveTaskProgress(): { taskId: string; checkedIds: string[]; naIds: string[] }[] {
  const results: { taskId: string; checkedIds: string[]; naIds: string[] }[] = [];
  const s = safeStorage();
  if (!s) return results;
  const prefix = `${PREFIX}:progress:`;
  try {
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k && k.startsWith(prefix)) {
        const taskId = k.slice(prefix.length);
        if (taskId.includes(":")) continue;
        const data = parseProgress(s.getItem(k));
        if (data.checked.length > 0 || data.na.length > 0) {
          results.push({ taskId, checkedIds: data.checked, naIds: data.na });
        }
      }
    }
  } catch { /* ignore */ }
  return results;
}

// ── App unlock (password gate) ────────────────────────────────────

const UNLOCK_KEY = key("unlocked");

export function isUnlocked(): boolean {
  const s = safeStorage();
  return s ? s.getItem(UNLOCK_KEY) === "1" : false;
}

export function setUnlocked() {
  safeStorage()?.setItem(UNLOCK_KEY, "1");
}

// ── Worker name ──────────────────────────────────────────────────

const NAME_KEY = key("worker-name");

export function getWorkerName(): string {
  const s = safeStorage();
  return s ? s.getItem(NAME_KEY) || "" : "";
}

export function setWorkerName(name: string) {
  safeStorage()?.setItem(NAME_KEY, name);
}

// ── Favorites ────────────────────────────────────────────────────

const FAVORITES_KEY = key("favorites");

export function getFavorites(): string[] {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavorites(ids: string[]) {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function hasFavorites(): boolean {
  const s = safeStorage();
  return s ? s.getItem(FAVORITES_KEY) !== null : false;
}

// ── Role (Worker / Supervisor) — no real auth, localStorage only ───

export type ActiveRole = "worker" | "supervisor";

const ACTIVE_ROLE_KEY = key("active-role");
const ROLE_CHOICE_DONE_KEY = key("role-choice-done");
const SUPERVISOR_ORG_ID_KEY = key("supervisor-org-id");
const TEAM_NAME_KEY = key("team-name");
const INVITE_TOKEN_KEY = key("invite-token");
const DASHBOARD_SECRET_KEY = key("dashboard-secret");
const WORKER_ORG_ID_KEY = key("worker-org-id");

export function getActiveRole(): ActiveRole {
  const s = safeStorage();
  const v = s?.getItem(ACTIVE_ROLE_KEY);
  return v === "supervisor" ? "supervisor" : "worker";
}

export function setActiveRole(role: ActiveRole) {
  safeStorage()?.setItem(ACTIVE_ROLE_KEY, role);
}

export function getRoleChoiceDone(): boolean {
  const s = safeStorage();
  return s ? s.getItem(ROLE_CHOICE_DONE_KEY) === "1" : false;
}

export function setRoleChoiceDone() {
  safeStorage()?.setItem(ROLE_CHOICE_DONE_KEY, "1");
}

export function getSupervisorOrgId(): string | null {
  return safeStorage()?.getItem(SUPERVISOR_ORG_ID_KEY) ?? null;
}

export function setSupervisorOrg(orgId: string, teamName: string, inviteToken: string, dashboardSecret: string) {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(SUPERVISOR_ORG_ID_KEY, orgId);
    s.setItem(TEAM_NAME_KEY, teamName);
    s.setItem(INVITE_TOKEN_KEY, inviteToken);
    s.setItem(DASHBOARD_SECRET_KEY, dashboardSecret);
  } catch { /* ignore */ }
}

export function getTeamName(): string {
  return safeStorage()?.getItem(TEAM_NAME_KEY) || "";
}

export function setTeamName(name: string): void {
  safeStorage()?.setItem(TEAM_NAME_KEY, name);
}

export function getInviteToken(): string | null {
  return safeStorage()?.getItem(INVITE_TOKEN_KEY) ?? null;
}

export function getDashboardSecret(): string | null {
  return safeStorage()?.getItem(DASHBOARD_SECRET_KEY) ?? null;
}

export function getWorkerOrgId(): string | null {
  return safeStorage()?.getItem(WORKER_ORG_ID_KEY) ?? null;
}

export function setWorkerOrgId(orgId: string | null) {
  const s = safeStorage();
  if (!s) return;
  try {
    if (orgId) s.setItem(WORKER_ORG_ID_KEY, orgId);
    else s.removeItem(WORKER_ORG_ID_KEY);
  } catch { /* ignore */ }
}

// ── Language ─────────────────────────────────────────────────────

const LANG_KEY = key("lang");

export function getLanguage(): string {
  const storage = safeStorage();
  if (!storage) return "fr";
  try {
    return storage.getItem(LANG_KEY) || "fr";
  } catch {
    return "fr";
  }
}

export function setLanguage(lang: string) {
  safeStorage()?.setItem(LANG_KEY, lang);
}

// ── Recent tasks ─────────────────────────────────────────────────

const RECENT_KEY = key("recent");
const MAX_RECENT = 5;

export function getRecentTasks(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentTask(taskId: string) {
  try {
    const recent = getRecentTasks().filter((id) => id !== taskId);
    recent.unshift(taskId);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch { /* ignore */ }
}

// ── Completed checklists history ─────────────────────────────────

export interface HistoryEntry {
  id?: string;
  taskId: string;
  taskTitle: string;
  taskIcon: string;
  workerName: string;
  workerCompany?: string;
  checkedCount: number;
  totalCount: number;
  completedAt: string; // ISO string
  siteName?: string;
  location?: string;
}

const HISTORY_KEY = key("history");
const MAX_HISTORY = 100;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistory(entry: HistoryEntry) {
  try {
    if (!entry.id) entry.id = Math.random().toString(36).slice(2, 12);
    const history = getHistory();
    history.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch { /* ignore */ }
}

export function getHistoryEntry(id: string): HistoryEntry | null {
  return getHistory().find((e) => e.id === id) ?? null;
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch { /* ignore */ }
}

// ── Company info ──────────────────────────────────────────────────

const REMOVED_MEMBERS_KEY = key("removed-members");

export function getRemovedMembers(): string[] {
  try {
    return JSON.parse(safeStorage()?.getItem(REMOVED_MEMBERS_KEY) || "[]");
  } catch { return []; }
}

export function addRemovedMember(name: string): void {
  const list = getRemovedMembers();
  if (!list.includes(name)) {
    list.push(name);
    safeStorage()?.setItem(REMOVED_MEMBERS_KEY, JSON.stringify(list));
  }
}

const COMPANY_WEBSITE_KEY = key("company-website");
const COMPANY_LOGO_KEY = key("company-logo");

export function getCompanyWebsite(): string {
  return safeStorage()?.getItem(COMPANY_WEBSITE_KEY) || "";
}

export function setCompanyWebsite(url: string) {
  const s = safeStorage();
  if (!s) return;
  try {
    if (url) s.setItem(COMPANY_WEBSITE_KEY, url);
    else s.removeItem(COMPANY_WEBSITE_KEY);
  } catch { /* ignore */ }
}

export function getCompanyLogo(): string {
  return safeStorage()?.getItem(COMPANY_LOGO_KEY) || "";
}

export function setCompanyLogo(dataUrl: string) {
  const s = safeStorage();
  if (!s) return;
  try {
    if (dataUrl) s.setItem(COMPANY_LOGO_KEY, dataUrl);
    else s.removeItem(COMPANY_LOGO_KEY);
  } catch { /* quota exceeded */ }
}

// ── Construction sites ────────────────────────────────────────────

export interface ConstructionSite {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  active?: boolean;
  createdAt?: string;
}

const LAST_SITE_KEY = key("last-site-id");

export function getLastSiteId(): string {
  return safeStorage()?.getItem(LAST_SITE_KEY) || "";
}

export function setLastSiteId(id: string): void {
  const s = safeStorage();
  if (!s) return;
  if (id) s.setItem(LAST_SITE_KEY, id);
  else s.removeItem(LAST_SITE_KEY);
}

const SITES_KEY = key("construction-sites");

export function getSites(): ConstructionSite[] {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(SITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSite(site: ConstructionSite) {
  const s = safeStorage();
  if (!s) return;
  try {
    const sites = getSites();
    sites.push(site);
    s.setItem(SITES_KEY, JSON.stringify(sites));
  } catch { /* quota exceeded */ }
}

export function getSite(id: string): ConstructionSite | null {
  return getSites().find((s) => s.id === id) ?? null;
}

export function updateSite(id: string, patch: Partial<ConstructionSite>) {
  const s = safeStorage();
  if (!s) return;
  try {
    const sites = getSites().map((site) =>
      site.id === id ? { ...site, ...patch } : site
    );
    s.setItem(SITES_KEY, JSON.stringify(sites));
  } catch { /* ignore */ }
}

export function removeSite(id: string) {
  const s = safeStorage();
  if (!s) return;
  try {
    const sites = getSites().filter((site) => site.id !== id);
    s.setItem(SITES_KEY, JSON.stringify(sites));
  } catch { /* ignore */ }
}

// ── Reports ───────────────────────────────────────────────────────

const REPORTS_KEY = key("reports");

export interface Report {
  taskId: string;
  taskTitle: string;
  severity: string;
  description: string;
  reporter: string;
  timestamp: string;
}

export function getReports(): Report[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getReportCount(): number {
  return getReports().length;
}

// ── Fresh start (demo) ────────────────────────────────────────────

/** Clears all app data for a fresh first-time experience. Use for demo. */
export function resetAllForFreshStart(): void {
  const s = safeStorage();
  if (!s) return;
  const prefix = `${PREFIX}:`;
  try {
    const keys: string[] = [];
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach((k) => s.removeItem(k));
    s.removeItem("ok-chantier:nda-accepted");
  } catch { /* ignore */ }
}

// ── Seed demo data ────────────────────────────────────────────────

const DEMO_SEEDED_KEY = key("demo-seeded");
const DEMO_VERSION = "5";

export function isDemoSeeded(): boolean {
  try {
    return localStorage.getItem(DEMO_SEEDED_KEY) === DEMO_VERSION;
  } catch {
    return false;
  }
}

export function seedDemoData() {
  const demoTasks = [
    { id: "coffrage", title: "Coffrage", icon: "🪵" },
    { id: "coulage-beton", title: "Coulage béton", icon: "🧱" },
    { id: "terrassement", title: "Terrassement / Excavation", icon: "⛏️" },
    { id: "ferraillage", title: "Ferraillage / Armature", icon: "🔩" },
    { id: "echafaudage", title: "Échafaudage", icon: "🏗️" },
    { id: "electricite", title: "Électricité", icon: "⚡" },
    { id: "soudage", title: "Soudage / Coupage", icon: "🔥" },
    { id: "peinture", title: "Peinture", icon: "🖌️" },
    { id: "demolition", title: "Démolition", icon: "🔨" },
    { id: "maconnerie", title: "Maçonnerie / Briquetage", icon: "🧱" },
    { id: "etancheite", title: "Étanchéité", icon: "💧" },
    { id: "carrelage", title: "Carrelage / Céramique", icon: "🔲" },
  ];

  const siteNames = [
    "Résidence Soleil — Québec",
    "Tour Frontenac — Montréal",
    "Complexe Desjardins Phase 3 — Lévis",
    "Pont Laviolette — Trois-Rivières",
    "Condo Cartier — Gatineau",
    "Centre Bell Réno — Montréal",
    "Éco-Quartier Limoilou — Québec",
    "Hôpital Sacré-Cœur — Chicoutimi",
    "Place Laurier Expansion — Sainte-Foy",
    "Usine Rio Tinto — Alma",
    "Barrage Eastmain — Baie-James",
    "Marina de Rimouski — Rimouski",
  ];

  const currentUser = getWorkerName() || "Claude";
  const workerCompanies: Record<string, string> = {
    "Marc-Antoine": "Pomerleau",
    "Stéphane": "EBC Inc.",
    "Jean-Pierre": "Groupe Canam",
    "Luc": "Broccolini",
    "Patrick": "Kiewit",
    "Éric": "Pomerleau",
    "François": "Construction Longer",
    "Mathieu": "Eurovia Québec",
    "Sébastien": "Groupe ABS",
  };
  const otherWorkers = [
    "Marc-Antoine", "Stéphane", "Jean-Pierre", "Luc", "Patrick",
    "Éric", "François", "Mathieu", "Sébastien",
  ];
  const now = Date.now();
  const DAY = 86400000;

  const entries: HistoryEntry[] = [];

  // Current user: most entries (spread over recent days)
  for (let d = 0; d < 8; d++) {
    const count = d === 0 ? 3 : d < 3 ? 2 : 1;
    for (let j = 0; j < count; j++) {
      const t = demoTasks[(d * 3 + j) % demoTasks.length];
      const total = 10 + Math.floor(Math.random() * 10);
      const hour = 7 + j * 3 + Math.floor(Math.random() * 2);
      const date = new Date(now - d * DAY);
      date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      entries.push({
        id: Math.random().toString(36).slice(2, 12),
        taskId: t.id, taskTitle: t.title, taskIcon: t.icon,
        workerName: currentUser, workerCompany: "Pomerleau",
        checkedCount: total, totalCount: total,
        completedAt: date.toISOString(),
        siteName: siteNames[(d * 3 + j) % siteNames.length],
      });
    }
  }

  // Other workers: varying amounts to create a realistic leaderboard
  const otherCounts = [11, 9, 8, 6, 5, 4, 3, 2, 1];
  for (let w = 0; w < otherWorkers.length; w++) {
    const numEntries = otherCounts[w];
    for (let j = 0; j < numEntries; j++) {
      const t = demoTasks[(w * 4 + j) % demoTasks.length];
      const total = 10 + Math.floor(Math.random() * 10);
      const daysAgo = Math.floor(j * 1.5);
      const date = new Date(now - daysAgo * DAY);
      date.setHours(6 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
      entries.push({
        id: Math.random().toString(36).slice(2, 12),
        taskId: t.id, taskTitle: t.title, taskIcon: t.icon,
        workerName: otherWorkers[w], workerCompany: workerCompanies[otherWorkers[w]],
        checkedCount: total, totalCount: total,
        completedAt: date.toISOString(),
        siteName: siteNames[(w * 4 + j) % siteNames.length],
      });
    }
  }

  try {
    entries.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    const existing = getHistory();
    const merged = [...entries, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
    localStorage.setItem(DEMO_SEEDED_KEY, DEMO_VERSION);
  } catch { /* ignore */ }
}
