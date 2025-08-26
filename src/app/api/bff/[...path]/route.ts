import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

function targetUrl(req: NextRequest, path: string[]) {
  const qs = req.nextUrl.searchParams.toString();
  const suffix = path.join("/");
  return `${API_BASE}/api/${suffix}${qs ? `?${qs}` : ""}`;
}

async function proxy(req: NextRequest, path: string[]) {
  const url = targetUrl(req, path);

  const headers: Record<string, string> = {};
  const cookie = req.headers.get("cookie");
  if (cookie) headers.cookie = cookie;
  const ct = req.headers.get("content-type");
  if (ct) headers["content-type"] = ct;

  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  const apiRes = await fetch(url, { method: req.method, headers, body, cache: "no-store" });

  const resHeaders = new Headers(apiRes.headers);
  const setCookie = apiRes.headers.get("set-cookie");
  if (setCookie) {
    const rewritten = setCookie
      .replace(/Domain=[^;]+;?\s*/gi, "")
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
    resHeaders.set("set-cookie", rewritten);
  }
  resHeaders.set("Cache-Control", "no-store");

  return new NextResponse(apiRes.body, { status: apiRes.status, headers: resHeaders });
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
