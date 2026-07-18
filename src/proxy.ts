import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Try to grab the better-auth session cookie.
  // Better auth cookies are usually prefixed with 'better-auth.session_token'
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Define paths that require authentication
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/planner") ||
    request.nextUrl.pathname.startsWith("/assistant") ||
    request.nextUrl.pathname.startsWith("/items");

  // Define paths that are strictly for unauthenticated users
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (isProtectedRoute && !sessionCookie) {
    // Redirect to login if trying to access protected routes without a session
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && sessionCookie) {
    // Redirect to dashboard if trying to access login/register with an active session
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/planner/:path*",
    "/assistant/:path*",
    "/items/:path*",
    "/login",
    "/register",
  ],
};
