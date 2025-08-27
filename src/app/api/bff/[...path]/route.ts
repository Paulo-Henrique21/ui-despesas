import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

function targetUrl(pathname: string, search: string) {
  // troca /api/bff/... -> /api/...
  const upstreamPath = pathname.replace(/^\/api\/bff\/?/, "/api/");
  const u = new URL(API_BASE);
  u.pathname = upstreamPath;
  u.search = search;
  return u.toString();
}

async function handler(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL not set" },
      { status: 500 }
    );
  }

  const url = targetUrl(req.nextUrl.pathname, req.nextUrl.search);
  const cookie = req.headers.get("cookie") || undefined;

  const init: RequestInit = {
    method: req.method,
    redirect: "manual",
    cache: "no-store",
    headers: {
      // só repasse o que importa; evita problemas de decodificação
      ...(req.headers.get("content-type")
        ? { "content-type": req.headers.get("content-type")! }
        : {}),
      ...(cookie ? { cookie } : {}),
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.arrayBuffer();
    init.body = Buffer.from(body);
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { message: "upstream_unreachable" },
      { status: 502 }
    );
  }

  const bytes = new Uint8Array(await upstream.arrayBuffer());

  const res = new NextResponse(bytes, {
    status: upstream.status,
    headers: {
      // defina explicitamente; NÃO copie content-encoding/transfer-encoding
      "content-type":
        upstream.headers.get("content-type") ||
        "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

  // Traduz Set-Cookie para o domínio da UI
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) {
    const rewritten = setCookie
      .replace(/Domain=[^;]+;?\s*/gi, "") // remove Domain
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"); // Lax para same-origin
    res.headers.append("set-cookie", rewritten);
  }

  return res;
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
