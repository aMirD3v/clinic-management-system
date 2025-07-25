import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Define role-based access control
    const roleAccess: Record<string, string[]> = {
      RECEPTION: ["/clinic/reception", "/api/clinic/reception", "/api/students"],
      NURSE: ["/clinic/nurse", "/api/clinic/nurse", "/api/students"],
      DOCTOR: ["/clinic/doctor", "/api/clinic/doctor", "/api/students"],
      LABORATORY: ["/clinic/laboratory", "/api/clinic/laboratory", "/api/students"],
      PHARMACY: ["/clinic/pharmacy", "/api/clinic/pharmacy", "/api/students"],
      STOCK_MANAGER: ["/stock-manager", "/api/stock", "/api/notifications"],
    };

    // Allow access to login page for all
    if (pathname === "/login") {
      return NextResponse.next();
    }

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token.role as string;

    // Check if the user's role is allowed to access the current path
    const allowedPaths = roleAccess[userRole] || [];
    const isAllowed = allowedPaths.some(path => {
      if (path.endsWith("/")) {
        return pathname.startsWith(path);
      } else {
        return pathname === path || pathname.startsWith(`${path}/`);
      }
    });

    // If the user is not allowed, redirect to their respective dashboard or a forbidden page
    if (!isAllowed) {
      switch (userRole) {
        case "RECEPTION":
          return NextResponse.redirect(new URL("/clinic/reception", req.url));
        case "NURSE":
          return NextResponse.redirect(new URL("/clinic/nurse", req.url));
        case "DOCTOR":
          return NextResponse.redirect(new URL("/clinic/doctor", req.url));
        case "LABORATORY":
          return NextResponse.redirect(new URL("/clinic/laboratory", req.url));
        case "PHARMACY":
          return NextResponse.redirect(new URL("/clinic/pharmacy", req.url));
        case "STOCK_MANAGER":
          return NextResponse.redirect(new URL("/stock-manager/dashboard", req.url));
        default:
          return NextResponse.redirect(new URL("/login", req.url)); // Fallback for unknown roles
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*) "],
};
