const PREFIX = "okchantier";

function key(...parts: string[]) {
  return `${PREFIX}:${parts.join(":")}`;
}

// ── Checklist progress (persists until finished or deleted) ──────

function progressKey(taskId: string) {
  return key("progress", taskId);
}

export function loadProgress(taskId: string): string[] {
  try {
    const raw = localStorage.getItem(progressKey(taskId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProgress(taskId: string, checkedIds: string[]) {
  try {
    localStorage.setItem(progressKey(taskId), JSON.stringify(checkedIds));
  } catch { /* quota exceeded — ignore */ }
}

export function clearProgress(taskId: string) {
  try {
    localStorage.removeItem(progressKey(taskId));
  } catch { /* ignore */ }
}

export function getActiveTaskProgress(): { taskId: string; checkedIds: string[] }[] {
  const results: { taskId: string; checkedIds: string[] }[] = [];
  const prefix = `${PREFIX}:progress:`;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        const taskId = k.slice(prefix.length);
        if (taskId.includes(":")) continue; // skip legacy date-keyed entries
        const raw = localStorage.getItem(k);
        const checkedIds: string[] = raw ? JSON.parse(raw) : [];
        if (checkedIds.length > 0) {
          results.push({ taskId, checkedIds });
        }
      }
    }
  } catch { /* ignore */ }
  return results;
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
