import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const MARKETING_HOSTS = new Set([
  "ok-chantier.com",
  "www.ok-chantier.com",
  "ok-chantier.vercel.app",
  "ok-securite.com",
  "www.ok-securite.com",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/my-team(.*)",
  "/my-sites(.*)",
  "/my-checklists(.*)",
  "/create-team(.*)",
  "/create-checklist(.*)",
  "/confirm(.*)",
  "/history(.*)",
  "/tasks(.*)",
  "/sites(.*)",
  "/join(.*)",
  "/bien-etre(.*)",
  "/api/scan(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const { pathname } = request.nextUrl;

  if (MARKETING_HOSTS.has(hostname) && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.rewrite(url);
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|pdf)).*)",
    "/(api|trpc)(.*)",
  ],
};
