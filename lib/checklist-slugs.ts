import { tasks } from "@/data/tasks";
import { categoryLabelsEn, type TaskCategory } from "@/types";
import type { Locale } from "./i18n";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Task slug maps (built once at module load) ─────────

const taskEnSlugs = new Map<string, string>();
const taskEnSlugToId = new Map<string, string>();

for (const task of tasks) {
  if (task.category === "custom") continue;
  const enSlug = task.titleEn ? slugify(task.titleEn) : task.id;
  taskEnSlugs.set(task.id, enSlug);
  taskEnSlugToId.set(enSlug, task.id);
}

// ── Category slug maps ─────────────────────────────────

const CATEGORIES: TaskCategory[] = [
  "gros-oeuvre",
  "structure",
  "enveloppe",
  "mecanique",
  "finition",
  "equipement",
  "situation",
];

const categoryEnSlugs: Record<string, string> = {};
const categoryEnSlugToKey: Record<string, TaskCategory> = {};

for (const key of CATEGORIES) {
  const slug = slugify(categoryLabelsEn[key]);
  categoryEnSlugs[key] = slug;
  categoryEnSlugToKey[slug] = key;
}

// ── Public API ─────────────────────────────────────────

export function getTaskSlug(taskId: string, locale: Locale): string {
  return locale === "en" ? (taskEnSlugs.get(taskId) ?? taskId) : taskId;
}

export function getTaskBySlug(slug: string, locale: Locale) {
  const taskId = locale === "en" ? (taskEnSlugToId.get(slug) ?? slug) : slug;
  return tasks.find((t) => t.id === taskId);
}

export function getCategorySlug(category: string, locale: Locale): string {
  return locale === "en" ? (categoryEnSlugs[category] ?? category) : category;
}

export function getCategoryBySlug(
  slug: string,
  locale: Locale,
): TaskCategory | undefined {
  if (locale === "en") return categoryEnSlugToKey[slug];
  return CATEGORIES.includes(slug as TaskCategory)
    ? (slug as TaskCategory)
    : undefined;
}

export function getTasksForCategory(category: TaskCategory) {
  return tasks.filter((t) => t.category === category);
}

export function getAllCategories(): TaskCategory[] {
  return CATEGORIES;
}

export function getTaskPath(taskId: string, locale: Locale): string {
  const slug = getTaskSlug(taskId, locale);
  return locale === "en" ? `/en/checklists/${slug}` : `/checklists/${slug}`;
}

export function getCategoryPath(category: string, locale: Locale): string {
  const slug = getCategorySlug(category, locale);
  const segment = locale === "en" ? "category" : "categorie";
  return locale === "en"
    ? `/en/checklists/${segment}/${slug}`
    : `/checklists/${segment}/${slug}`;
}

export function getChecklistsBasePath(locale: Locale): string {
  return locale === "en" ? "/en/checklists" : "/checklists";
}

export function getAllTaskSlugs(locale: Locale): string[] {
  return tasks
    .filter((t) => t.category !== "custom")
    .map((t) => getTaskSlug(t.id, locale));
}

export function getAllCategorySlugs(locale: Locale): string[] {
  return CATEGORIES.map((c) => getCategorySlug(c, locale));
}
