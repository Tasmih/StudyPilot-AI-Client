import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Try to grab the better-auth session cookie.
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Define paths that strictly require authentication
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/planner") ||
    request.nextUrl.pathname.startsWith("/assistant") ||
    request.nextUrl.pathname.startsWith("/items");

  if (isProtectedRoute && !sessionCookie) {
    // Redirect to login if trying to access protected routes without a session
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow all other public routes (like /, /login, /register, /about) to render normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/planner/:path*",
    "/assistant/:path*",
    "/items/:path*",
  ],
};
