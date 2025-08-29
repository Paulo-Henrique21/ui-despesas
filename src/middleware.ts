import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isPrivateRoute = request.nextUrl.pathname.startsWith("/private");
  const isRootRoute = request.nextUrl.pathname === "/";

  if (!token && (isPrivateRoute || isRootRoute)) {
    const redirectUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/private", request.url));
  }

  if (token && isRootRoute) {
    return NextResponse.redirect(new URL("/private", request.url));
  }

  if (token && isPrivateRoute) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/private/:path*", "/auth/:path*"],
};
