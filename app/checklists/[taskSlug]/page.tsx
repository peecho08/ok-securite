import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskLanding, TaskJsonLd } from "@/components/checklist-landing";
import {
  getTaskBySlug,
  getAllTaskSlugs,
  getTaskSlug,
} from "@/lib/checklist-slugs";
import { categoryLabels, type TaskCategory } from "@/types";

type Props = { params: Promise<{ taskSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { taskSlug } = await params;
  const task = getTaskBySlug(taskSlug, "fr");
  if (!task) return {};

  const enSlug = getTaskSlug(task.id, "en");
  const catLabel = categoryLabels[task.category as TaskCategory];

  return {
    title: `${task.title} — Liste de vérification CNESST | OK Sécurité`,
    description: `${task.description}. Liste de vérification conforme aux normes CNESST pour la construction au Québec. Catégorie : ${catLabel}.`,
    alternates: {
      canonical: `https://ok-securite.com/checklists/${taskSlug}`,
      languages: {
        "fr-CA": `https://ok-securite.com/checklists/${taskSlug}`,
        "en-CA": `https://ok-securite.com/en/checklists/${enSlug}`,
      },
    },
    openGraph: {
      title: `${task.title} — Vérification CNESST`,
      description: task.description,
      url: `https://ok-securite.com/checklists/${taskSlug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllTaskSlugs("fr").map((slug) => ({ taskSlug: slug }));
}

export default async function TaskPage({ params }: Props) {
  const { taskSlug } = await params;
  const task = getTaskBySlug(taskSlug, "fr");
  if (!task) notFound();

  return (
    <>
      <TaskJsonLd task={task} locale="fr" />
      <TaskLanding task={task} locale="fr" />
    </>
  );
}
