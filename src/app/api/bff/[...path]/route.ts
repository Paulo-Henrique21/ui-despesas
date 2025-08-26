// app/api/bff/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

function targetUrl(req: NextRequest, path: string[]) {
  const qs = req.nextUrl.searchParams.toString();
  const suffix = path.join("/"); // ex.: users/login
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL não definido no front");
  return `${API_BASE}/api/${suffix}${qs ? `?${qs}` : ""}`;
}

async function proxy(req: NextRequest, path: string[]) {
  try {
    const url = targetUrl(req, path);

    // Headers que queremos repassar
    const headers: Record<string, string> = {};
    const cookie = req.headers.get("cookie");
    if (cookie) headers.cookie = cookie;
    const ct = req.headers.get("content-type");
    if (ct) headers["content-type"] = ct;

    // Body apenas para métodos com payload
    const init: RequestInit = {
      method: req.method,
      headers,
      cache: "no-store",
    };
    if (!["GET", "HEAD"].includes(req.method)) {
      init.body = await req.text(); // lê como texto p/ evitar lock do stream
    }

    const apiRes = await fetch(url, init);

    // Copia headers (exceto Set-Cookie, que tratamos abaixo)
    const resHeaders = new Headers();
    apiRes.headers.forEach((v, k) => {
      if (k.toLowerCase() !== "set-cookie") resHeaders.set(k, v);
    });

    // Reescreve Set-Cookie vindo da API para virar cookie do host da UI
    const setCookie = apiRes.headers.get("set-cookie");
    if (setCookie) {
      const rewritten = setCookie
        .replace(/Domain=[^;]+;?\s*/gi, "")
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
      // usar casing correto + append (p/ múltiplos cookies)
      resHeaders.append("Set-Cookie", rewritten);
    }
    resHeaders.set("Cache-Control", "no-store");

    // Evita stream issues: devolve como texto
    const bodyText = await apiRes.text();
    return new NextResponse(bodyText, {
      status: apiRes.status,
      headers: resHeaders,
    });
  } catch (err: any) {
    // Logará no console do Render (serviço do front)
    console.error("BFF error:", err);
    return NextResponse.json(
      { message: "BFF proxy error", error: String(err) },
      { status: 502 }
    );
  }
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
