import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!; // ex.: https://api-despesas.onrender.com

function targetUrl(req: NextRequest, path: string[]) {
  const qs = req.nextUrl.searchParams.toString();
  const suffix = path.join("/"); // ex.: expenses/has-any
  return `${API_BASE}/api/${suffix}${qs ? `?${qs}` : ""}`;
}

async function proxy(req: NextRequest, path: string[]) {
  const url = targetUrl(req, path);

  // Encaminha headers necessários (especialmente o cookie da UI).
  const headers: Record<string, string> = {};
  const cookie = req.headers.get("cookie");
  if (cookie) headers.cookie = cookie;
  const ct = req.headers.get("content-type");
  if (ct) headers["content-type"] = ct;

  // Corpo apenas para métodos com body
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  const apiRes = await fetch(url, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
  });

  // Passa o corpo/headers/status de volta
  const resHeaders = new Headers(apiRes.headers);

  // Se a API definir Set-Cookie (ex.: login/refresh), reescreve para cookie do host da UI
  const setCookie = apiRes.headers.get("set-cookie");
  if (setCookie) {
    const rewritten = setCookie
      .replace(/Domain=[^;]+;?\s*/gi, "")        // remove Domain=.onrender.com
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"); // agora é same-origin
    resHeaders.set("set-cookie", rewritten);
  }

  // Evita cache
  resHeaders.set("Cache-Control", "no-store");

  return new NextResponse(apiRes.body, {
    status: apiRes.status,
    headers: resHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path);
}
