import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/admin",
  "/clinic",
  "/stock-manager",
  "/dashboard",
];

const rolePermissions = {
  ADMIN: [
    "/admin",
    "/dashboard",
    "/api/admin",
    "/api/stock",
    "/api/notifications",
    "/api/clinic",
  ],
  RECEPTION: [
    "/clinic/reception",
    "/api/clinic/reception",
    "/api/students",
  ],
  NURSE: [
    "/clinic/nurse",
    "/api/clinic/nurse",
    "/api/students",
  ],
  DOCTOR: [
    "/clinic/doctor",
    "/api/clinic/doctor",
    "/api/students",
  ],
  LABORATORY: [
    "/clinic/laboratory",
    "/api/clinic/laboratory",
    "/api/students",
  ],
  PHARMACY: [
    "/clinic/pharmacy",
    "/api/clinic/pharmacy",
    "/api/students",
    "/api/stock",
  ],
  STOCK_MANAGER: [
    "/stock-manager",
    "/api/stock",
    "/api/notifications",
  ],
  GENERAL_STAFF: [
    "/dashboard",
    "/api/students",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow access to login and public routes
  if (pathname === "/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow access to static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = token.role as keyof typeof rolePermissions;

  // Check if user has permission for the route
  const hasPermission = rolePermissions[userRole]?.some(allowedPath => 
    pathname.startsWith(allowedPath)
  );

  if (!hasPermission) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects: Record<string, string> = {
      ADMIN: "/admin",
      RECEPTION: "/clinic/reception",
      NURSE: "/clinic/nurse",
      DOCTOR: "/clinic/doctor",
      LABORATORY: "/clinic/laboratory",
      PHARMACY: "/clinic/pharmacy",
      STOCK_MANAGER: "/stock-manager/dashboard",
      GENERAL_STAFF: "/dashboard",
    };

    const redirectUrl = roleRedirects[userRole] || "/login";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};