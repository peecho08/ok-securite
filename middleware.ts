import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/app/dashboard(.*)",
  "/app/my-team(.*)",
  "/app/my-sites(.*)",
  "/app/my-checklists(.*)",
  "/app/create-team(.*)",
  "/app/create-checklist(.*)",
  "/app/confirm(.*)",
  "/app/history(.*)",
  "/app/tasks(.*)",
  "/app/sites(.*)",
  "/app/join(.*)",
  "/app/bien-etre(.*)",
  "/api/scan(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/__clerk")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
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
