// app/api/bff/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

function upstreamUrlFor(pathname: string, search: string) {
  // pega o que vem depois de /api/bff/
  const prefix = "/api/bff/";
  const i = pathname.indexOf(prefix);
  const sub = pathname.slice(i + prefix.length); // ex.: "expenses/monthly" ou "health"

  // health é na raiz; demais ficam em /api/...
  const base = sub.startsWith("health") ? "" : "api/";
  return `${API_BASE}/${base}${sub}${search}`;
}

async function proxy(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json({ message: "API base is not configured" }, { status: 500 });
  }

  const url = new URL(req.url);
  const upstream = upstreamUrlFor(url.pathname, url.search);

  const headers = new Headers();
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);

  const token = req.cookies.get("token")?.value;
  if (token) headers.set("cookie", `token=${token}`);

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.text() : undefined;

  let apiRes: Response;
  try {
    apiRes = await fetch(upstream, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (err: any) {
    // API provavelmente está dormindo/offline
    return NextResponse.json(
      { sleeping: true, message: "Upstream unavailable" },
      { status: 503, headers: { "cache-control": "no-store", "x-bff-upstream": "down" } }
    );
  }

  // Monta headers de resposta (sem compressão/tamanho)
  const resHeaders = new Headers();
  apiRes.headers.forEach((v, k) => {
    const low = k.toLowerCase();
    if (low === "set-cookie") return;
    if (low === "content-encoding") return;
    if (low === "content-length") return;
    if (low === "transfer-encoding") return;
    resHeaders.set(k, v);
  });

  const setCookie = apiRes.headers.get("set-cookie");
  if (setCookie) {
    const rewritten = setCookie
      .replace(/Domain=[^;]+;?\s*/gi, "")
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
    resHeaders.append("Set-Cookie", rewritten);
  }

  resHeaders.set("cache-control", "no-store");
  resHeaders.set("content-type", apiRes.headers.get("content-type") || "application/json");

  // stream: melhor TTFB
  return new NextResponse(apiRes.body, { status: apiRes.status, headers: resHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });
}
