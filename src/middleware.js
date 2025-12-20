import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/signin",
  "/verify-request",
  "/api/auth",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Allow API routes (auth is handled inside each API route)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Not logged in -> go to signin
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // ✅ Allow pending page for logged-in users (prevents redirect loop)
  if (pathname.startsWith("/pending")) {
    return NextResponse.next();
  }

    // Allow pending users to access ONLY: /pending and /profile
  if (token.status !== "APPROVED" && token.role !== "ADMIN") {
    if (pathname.startsWith("/profile") || pathname.startsWith("/pending")) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = "/pending";
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
