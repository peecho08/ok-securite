import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CategoryLanding,
  CategoryJsonLd,
} from "@/components/checklist-landing";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  getCategorySlug,
} from "@/lib/checklist-slugs";
import { categoryLabels, type TaskCategory } from "@/types";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug, "fr");
  if (!category) return {};

  const label = categoryLabels[category];
  const enSlug = getCategorySlug(category, "en");

  return {
    title: `${label} — Listes de vérification CNESST | OK Sécurité`,
    description: `Listes de vérification CNESST pour les travaux de ${label.toLowerCase()} en construction au Québec. Conformes au Code de sécurité pour les travaux de construction.`,
    alternates: {
      canonical: `https://ok-securite.com/checklists/categorie/${slug}`,
      languages: {
        "fr-CA": `https://ok-securite.com/checklists/categorie/${slug}`,
        "en-CA": `https://ok-securite.com/en/checklists/category/${enSlug}`,
      },
    },
    openGraph: {
      title: `${label} — Vérifications CNESST`,
      description: `Toutes les listes de vérification CNESST pour ${label.toLowerCase()}.`,
      url: `https://ok-securite.com/checklists/categorie/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllCategorySlugs("fr").map((slug) => ({ category: slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug, "fr");
  if (!category) notFound();

  return (
    <>
      <CategoryJsonLd category={category} locale="fr" />
      <CategoryLanding category={category} locale="fr" />
    </>
  );
}
