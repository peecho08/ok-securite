import { tasks } from "@/data/tasks";
import { categoryLabels, categoryLabelsEn, type TaskCategory } from "@/types";
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
