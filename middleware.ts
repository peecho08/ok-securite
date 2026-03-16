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

  if (pathname.startsWith("/app/join/")) {
    const { userId } = await auth();
    if (!userId) {
      const signUpUrl = new URL("/sign-up", request.url);
      signUpUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signUpUrl);
    }
    const response = NextResponse.next();
    response.cookies.set("pending_join", pathname, { maxAge: 300, path: "/" });
    return response;
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
