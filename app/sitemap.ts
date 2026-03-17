import type { MetadataRoute } from "next";
import { tasks } from "@/data/tasks";
import {
  getAllCategories,
  getTaskSlug,
  getCategorySlug,
} from "@/lib/checklist-slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ok-securite.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/home`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/comment-ca-marche`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/plans`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Checklist index pages ────────────────────────────
  const checklistIndexes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/checklists`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/en/checklists`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // ── Category pages ───────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = getAllCategories().flatMap(
    (cat) => [
      {
        url: `${baseUrl}/checklists/categorie/${getCategorySlug(cat, "fr")}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/en/checklists/category/${getCategorySlug(cat, "en")}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
    ],
  );

  // ── Individual task pages ────────────────────────────
  const taskPages: MetadataRoute.Sitemap = tasks
    .filter((t) => t.category !== "custom")
    .flatMap((t) => [
      {
        url: `${baseUrl}/checklists/${getTaskSlug(t.id, "fr")}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/en/checklists/${getTaskSlug(t.id, "en")}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ]);

  return [
    ...staticPages,
    ...checklistIndexes,
    ...categoryPages,
    ...taskPages,
  ];
}
