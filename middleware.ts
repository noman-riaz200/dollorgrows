import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Allow all auth routes to be public
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // Allow public settings endpoint
  if (request.nextUrl.pathname === "/api/settings/public") {
    return NextResponse.next();
  }

  // Block admin routes for non-admins
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Check if user is blocked
  if (token?.status === "blocked") {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Account blocked. Contact support." }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/auth/signin?error=blocked", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/admin/:path*", "/auth/:path*"],
};
