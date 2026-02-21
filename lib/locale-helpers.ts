import { tasks } from "@/data/tasks";
import { categoryLabels, categoryLabelsEn, type TaskCategory, type PhaseGroup } from "@/types";
import type { Locale } from "./i18n";

export type Task = (typeof tasks)[number];

export function localTitle(task: Task, locale: Locale) {
  return (locale === "en" && task.titleEn) ? task.titleEn : task.title;
}

export function localDesc(task: Task, locale: Locale) {
  return (locale === "en" && task.descriptionEn) ? task.descriptionEn : task.description;
}

export function localCatLabel(cat: TaskCategory, locale: Locale) {
  return locale === "en" ? categoryLabelsEn[cat] : categoryLabels[cat];
}

export function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Merge "pendant" phase items into "avant", returning only avant + fin phases. */
export function mergePhases(phases: PhaseGroup[]): PhaseGroup[] {
  const avant = phases.find((p) => p.phase === "avant");
  const pendant = phases.find((p) => p.phase === "pendant");
  const fin = phases.find((p) => p.phase === "fin");

  const merged: PhaseGroup[] = [];
  if (avant || pendant) {
    merged.push({
      phase: "avant",
      title: avant?.title ?? pendant!.title,
      items: [...(avant?.items ?? []), ...(pendant?.items ?? [])],
    });
  }
  if (fin) merged.push(fin);
  return merged;
}
