const PREFIX = "okchantier";

function key(...parts: string[]) {
  return `${PREFIX}:${parts.join(":")}`;
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
  try {
    return parseProgress(localStorage.getItem(progressKey(taskId)));
  } catch {
    return { checked: [], na: [] };
  }
}

export function saveProgress(taskId: string, data: ProgressData) {
  try {
    localStorage.setItem(progressKey(taskId), JSON.stringify(data));
  } catch { /* quota exceeded — ignore */ }
}

export function clearProgress(taskId: string) {
  try {
    localStorage.removeItem(progressKey(taskId));
  } catch { /* ignore */ }
}

export function getActiveTaskProgress(): { taskId: string; checkedIds: string[]; naIds: string[] }[] {
  const results: { taskId: string; checkedIds: string[]; naIds: string[] }[] = [];
  const prefix = `${PREFIX}:progress:`;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        const taskId = k.slice(prefix.length);
        if (taskId.includes(":")) continue;
        const data = parseProgress(localStorage.getItem(k));
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
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function setUnlocked() {
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch { /* ignore */ }
}

// ── Worker name ──────────────────────────────────────────────────

const NAME_KEY = key("worker-name");

export function getWorkerName(): string {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function setWorkerName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch { /* ignore */ }
}

// ── Favorites ────────────────────────────────────────────────────

const FAVORITES_KEY = key("favorites");

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavorites(ids: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function hasFavorites(): boolean {
  try {
    return localStorage.getItem(FAVORITES_KEY) !== null;
  } catch {
    return false;
  }
}

// ── Color mode (ACQ) ─────────────────────────────────────────────

const COLOR_KEY = key("acq-colors");

export function getAcqColors(): boolean {
  try {
    return localStorage.getItem(COLOR_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAcqColors(on: boolean) {
  try {
    if (on) localStorage.setItem(COLOR_KEY, "1");
    else localStorage.removeItem(COLOR_KEY);
  } catch { /* ignore */ }
}

// ── Language ─────────────────────────────────────────────────────

const LANG_KEY = key("lang");

export function getLanguage(): string {
  try {
    return localStorage.getItem(LANG_KEY) || "fr";
  } catch {
    return "fr";
  }
}

export function setLanguage(lang: string) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch { /* ignore */ }
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
  taskId: string;
  taskTitle: string;
  taskIcon: string;
  workerName: string;
  checkedCount: number;
  totalCount: number;
  completedAt: string; // ISO string
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
    const history = getHistory();
    history.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch { /* ignore */ }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
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

// ── Seed demo data ────────────────────────────────────────────────

const DEMO_SEEDED_KEY = key("demo-seeded");
const DEMO_VERSION = "2";

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

  const currentUser = getWorkerName() || "Claude";
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
        taskId: t.id, taskTitle: t.title, taskIcon: t.icon,
        workerName: currentUser, checkedCount: total, totalCount: total,
        completedAt: date.toISOString(),
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
        taskId: t.id, taskTitle: t.title, taskIcon: t.icon,
        workerName: otherWorkers[w], checkedCount: total, totalCount: total,
        completedAt: date.toISOString(),
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
