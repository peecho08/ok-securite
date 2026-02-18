const PREFIX = "okchantier";

function key(...parts: string[]) {
  return `${PREFIX}:${parts.join(":")}`;
}

// ── Checklist progress (keyed by taskId + today's date) ──────────

function todayKey(taskId: string) {
  const d = new Date().toISOString().slice(0, 10);
  return key("progress", taskId, d);
}

export function loadProgress(taskId: string): string[] {
  try {
    const raw = localStorage.getItem(todayKey(taskId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProgress(taskId: string, checkedIds: string[]) {
  try {
    localStorage.setItem(todayKey(taskId), JSON.stringify(checkedIds));
  } catch { /* quota exceeded — ignore */ }
}

export function clearProgress(taskId: string) {
  try {
    localStorage.removeItem(todayKey(taskId));
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
