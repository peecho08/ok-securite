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
import { categoryLabelsEn, type TaskCategory } from "@/types";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug, "en");
  if (!category) return {};

  const label = categoryLabelsEn[category];
  const frSlug = getCategorySlug(category, "fr");

  return {
    title: `${label} — CNESST Safety Checklists | OK Sécurité`,
    description: `CNESST safety checklists for ${label.toLowerCase()} in construction in Québec. Compliant with Québec's Construction Safety Code.`,
    alternates: {
      canonical: `https://ok-securite.com/en/checklists/category/${slug}`,
      languages: {
        "fr-CA": `https://ok-securite.com/checklists/categorie/${frSlug}`,
        "en-CA": `https://ok-securite.com/en/checklists/category/${slug}`,
      },
    },
    openGraph: {
      title: `${label} — CNESST Checklists`,
      description: `All CNESST safety checklists for ${label.toLowerCase()}.`,
      url: `https://ok-securite.com/en/checklists/category/${slug}`,
      locale: "en_CA",
    },
  };
}

export function generateStaticParams() {
  return getAllCategorySlugs("en").map((slug) => ({ category: slug }));
}

export default async function CategoryEnPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug, "en");
  if (!category) notFound();

  return (
    <>
      <CategoryJsonLd category={category} locale="en" />
      <CategoryLanding category={category} locale="en" />
    </>
  );
}
