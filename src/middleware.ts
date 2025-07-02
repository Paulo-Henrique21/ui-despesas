import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isPrivateRoute = request.nextUrl.pathname.startsWith("/private");

  if (!token && isPrivateRoute) {
    // Não autenticado → redireciona para login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthRoute) {
    // Já autenticado → redireciona da página de login para área privada
    return NextResponse.redirect(new URL("/private", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/private/:path*", "/auth/:path*"],
  };
  