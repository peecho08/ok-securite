import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskLanding, TaskJsonLd } from "@/components/checklist-landing";
import {
  getTaskBySlug,
  getAllTaskSlugs,
  getTaskSlug,
} from "@/lib/checklist-slugs";
import { categoryLabelsEn, type TaskCategory } from "@/types";

type Props = { params: Promise<{ taskSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskSlug } = await params;
  const task = getTaskBySlug(taskSlug, "en");
  if (!task) return {};

  const frSlug = getTaskSlug(task.id, "fr");
  const catLabel = categoryLabelsEn[task.category as TaskCategory];

  return {
    title: `${task.titleEn ?? task.title} — CNESST Safety Checklist | OK Sécurité`,
    description: `${task.descriptionEn ?? task.description}. CNESST-compliant safety checklist for construction in Québec. Category: ${catLabel}.`,
    alternates: {
      canonical: `https://ok-securite.com/en/checklists/${taskSlug}`,
      languages: {
        "fr-CA": `https://ok-securite.com/checklists/${frSlug}`,
        "en-CA": `https://ok-securite.com/en/checklists/${taskSlug}`,
      },
    },
    openGraph: {
      title: `${task.titleEn ?? task.title} — CNESST Checklist`,
      description: task.descriptionEn ?? task.description,
      url: `https://ok-securite.com/en/checklists/${taskSlug}`,
      locale: "en_CA",
    },
  };
}

export function generateStaticParams() {
  return getAllTaskSlugs("en").map((slug) => ({ taskSlug: slug }));
}

export default async function TaskEnPage({ params }: Props) {
  const { taskSlug } = await params;
  const task = getTaskBySlug(taskSlug, "en");
  if (!task) notFound();

  return (
    <>
      <TaskJsonLd task={task} locale="en" />
      <TaskLanding task={task} locale="en" />
    </>
  );
}
