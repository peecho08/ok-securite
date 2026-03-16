import { NextRequest, NextResponse } from "next/server";

const MARKETING_HOSTS = new Set([
  "ok-chantier.com",
  "www.ok-chantier.com",
  "ok-chantier.vercel.app",
]);

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const { pathname } = request.nextUrl;

  if (MARKETING_HOSTS.has(hostname)) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
