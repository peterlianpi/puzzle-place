import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { Logger } from "@/lib/logger";

// Protected routes requiring authentication
const protectedRoutes = [
  /^\/dashboard/,
  /^\/my-events/,
  /^\/events\/[^\/]+$/,
  /^\/my-events\/[^\/]+$/,
  /^\/user\//,
];

// Auth pages requiring authentication
const authProtectedRoutes = ["/auth/change-password", "/auth/profile"];

// Public auth pages that redirect if authenticated
const authPublicRoutes = ["/auth/login", "/auth/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth checks first - before creating response
  try {
    await Logger.info(`Middleware: Checking session for ${pathname}`);
    const session = await auth.api.getSession({ headers: request.headers });
    await Logger.info(`Middleware: Session found: ${!!session?.user?.id}`);

    const isProtected = protectedRoutes.some((route) => route.test(pathname));
    const isAuthProtected = authProtectedRoutes.includes(pathname);
    const isAuthPublic = authPublicRoutes.includes(pathname);

    if (isProtected || isAuthProtected) {
      if (!session) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (isAuthPublic && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    await Logger.error("Middleware auth check failed", {
      details: JSON.stringify(error),
    });
    // Continue to allow access on error
  }

  // Clone the response
  const res = NextResponse.next();

  // Add security headers
  res.headers.set("X-DNS-Prefetch-Control", "on");

  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Rate limiting for API routes (additional to auth rate limiting)
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Basic rate limiting could be implemented here with Redis/external service
    // For now, just log suspicious activity
    if (
      request.method === "POST" &&
      request.nextUrl.pathname.includes("/auth/")
    ) {
      await Logger.info(
        `Auth API call from IP: ${clientIP} at ${new Date().toISOString()}`
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Note: Removed api/auth exclusion since auth checks may be needed elsewhere
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
