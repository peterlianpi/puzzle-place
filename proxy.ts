import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
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
      console.log(
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
     * - api/auth (handled by Better Auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
