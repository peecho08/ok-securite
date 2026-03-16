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

// ── Worker name ──────────────────────────────────────────────────

const NAME_KEY = key("worker-name");

export function getWorkerName(): string {
  const s = safeStorage();
  return s ? s.getItem(NAME_KEY) || "" : "";
}

export function setWorkerName(name: string) {
  safeStorage()?.setItem(NAME_KEY, name);
}

// ── Supervisor email ─────────────────────────────────────────────

const EMAIL_KEY = key("supervisor-email");

export function getSupervisorEmail(): string {
  const s = safeStorage();
  return s ? s.getItem(EMAIL_KEY) || "" : "";
}

export function setSupervisorEmail(email: string) {
  const s = safeStorage();
  if (!s) return;
  if (email) s.setItem(EMAIL_KEY, email);
  else s.removeItem(EMAIL_KEY);
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

export function clearRoleChoiceDone() {
  safeStorage()?.removeItem(ROLE_CHOICE_DONE_KEY);
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

// ── Team tasks (employer-selected tasks for the team) ─────────────

const TEAM_TASKS_KEY = key("team-tasks");

export function getTeamTasks(): string[] {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(TEAM_TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setTeamTasks(ids: string[]) {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(TEAM_TASKS_KEY, JSON.stringify(ids));
  } catch { /* quota exceeded — ignore */ }
}

// ── Worker onboarding ─────────────────────────────────────────────

const WORKER_ONBOARDING_KEY = key("worker-onboarding-done");

export function getWorkerOnboardingDone(): boolean {
  const s = safeStorage();
  return s ? s.getItem(WORKER_ONBOARDING_KEY) === "1" : false;
}

export function setWorkerOnboardingDone() {
  safeStorage()?.setItem(WORKER_ONBOARDING_KEY, "1");
}

export function clearWorkerOnboardingDone() {
  safeStorage()?.removeItem(WORKER_ONBOARDING_KEY);
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
  notes?: string;
  imageUrl?: string;
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

// ── Last selected site (remembers last picker choice) ─────────────

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

// ── Custom checklists (supervisor-created) ─────────────────────────

import type { Task, Checklist } from "@/types";

const CUSTOM_TASKS_KEY = key("custom-tasks");
const CUSTOM_CHECKLISTS_KEY = key("custom-checklists");

export function getCustomTasks(): Task[] {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(CUSTOM_TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCustomChecklists(): Record<string, Checklist> {
  const s = safeStorage();
  if (!s) return {};
  try {
    const raw = s.getItem(CUSTOM_CHECKLISTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCustomChecklist(taskId: string): Checklist | null {
  return getCustomChecklists()[taskId] ?? null;
}

export function saveCustomTask(task: Task, checklist: Checklist) {
  const s = safeStorage();
  if (!s) return;
  try {
    const tasks = getCustomTasks().filter((t) => t.id !== task.id);
    tasks.push(task);
    s.setItem(CUSTOM_TASKS_KEY, JSON.stringify(tasks));

    const cls = getCustomChecklists();
    cls[task.id] = checklist;
    s.setItem(CUSTOM_CHECKLISTS_KEY, JSON.stringify(cls));
  } catch { /* quota exceeded */ }
}

export function deleteCustomTask(id: string) {
  const s = safeStorage();
  if (!s) return;
  try {
    const tasks = getCustomTasks().filter((t) => t.id !== id);
    s.setItem(CUSTOM_TASKS_KEY, JSON.stringify(tasks));

    const cls = getCustomChecklists();
    delete cls[id];
    s.setItem(CUSTOM_CHECKLISTS_KEY, JSON.stringify(cls));
  } catch { /* ignore */ }
}

// ── Fresh start (demo) ────────────────────────────────────────────

/** Clears worker/demo data for a fresh presentation, keeping employer config. */
export function resetAllForFreshStart(): void {
  const s = safeStorage();
  if (!s) return;
  const prefix = `${PREFIX}:`;
  const preserve = new Set([
    key("team-tasks"),
    key("team-name"),
    key("supervisor-org-id"),
    key("invite-token"),
    key("dashboard-secret"),
    key("worker-name"),
    key("company-website"),
    key("company-logo"),
    key("supervisor-email"),
    key("lang"),
    key("last-site-id"),
    key("custom-tasks"),
    key("custom-checklists"),
  ]);
  try {
    const keys: string[] = [];
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k && k.startsWith(prefix) && !preserve.has(k)) keys.push(k);
    }
    keys.forEach((k) => s.removeItem(k));
  } catch { /* ignore */ }
}

