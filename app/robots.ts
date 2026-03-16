import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/sign-in",
        "/sign-up",
        "/dashboard",
        "/my-team",
        "/my-sites",
        "/my-checklists",
        "/create-team",
        "/create-checklist",
        "/join/",
        "/tasks/",
        "/confirm/",
        "/history",
        "/bien-etre",
      ],
    },
    sitemap: "https://ok-securite.com/sitemap.xml",
  };
}
