// app/api/bff/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";          // garante Node runtime (não Edge)
export const dynamic = "force-dynamic";   // evita cache do Next

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

/**
 * Proxy genérico: encaminha /api/bff/<...> para <API_BASE>/api/<...>
 * - Repassa método, corpo e content-type
 * - Lê o cookie "token" da UI e envia como Cookie para a API
 * - Remove headers de compressão do upstream (Content-Encoding/Length/Transfer-Encoding)
 *   para evitar ERR_CONTENT_DECODING_FAILED no browser
 * - Reescreve Set-Cookie do upstream para o domínio da UI (sem Domain, SameSite=Lax)
 */
async function proxy(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "API base is not configured" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);

  // subpath depois de /api/bff/
  const bffPrefix = "/api/bff/";
  const i = url.pathname.indexOf(bffPrefix);
  const subpath = url.pathname.slice(i + bffPrefix.length); // ex.: "expenses/monthly"

  // monta URL da API: <API_BASE>/api/<subpath>?<search>
  const upstreamUrl = `${API_BASE}/api/${subpath}${url.search}`;

  // prepara headers para o upstream
  const upstreamHeaders = new Headers();

  // repassa content-type se existir
  const ct = req.headers.get("content-type");
  if (ct) upstreamHeaders.set("content-type", ct);

  // pega o cookie "token" do domínio da UI e envia para a API
  const token = req.cookies.get("token")?.value;
  if (token) {
    upstreamHeaders.set("cookie", `token=${token}`);
  }

  // corpo apenas para métodos que têm body
  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.text() : undefined;

  const apiRes = await fetch(upstreamUrl, {
    method,
    headers: upstreamHeaders,
    body,
    // nada de credentials aqui: é server→server
    cache: "no-store",
    redirect: "manual",
  });

  // Copia headers do upstream, mas remove os de compressão/tamanho
  const resHeaders = new Headers();
  apiRes.headers.forEach((v, k) => {
    const low = k.toLowerCase();
    if (low === "set-cookie") return;            // tratamos abaixo
    if (low === "content-encoding") return;      // evita decode duplo no browser
    if (low === "content-length") return;
    if (low === "transfer-encoding") return;
    resHeaders.set(k, v);
  });

  // Reescreve Set-Cookie do upstream (se existir) para o domínio da UI
  const setCookie = apiRes.headers.get("set-cookie");
  if (setCookie) {
    // remove Domain=..., e troca SameSite=None -> Lax (same-origin via BFF)
    const rewritten = setCookie
      .replace(/Domain=[^;]+;?\s*/gi, "")
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
    resHeaders.append("Set-Cookie", rewritten);
  }

  // Desliga cache e garante content-type
  resHeaders.set("cache-control", "no-store");
  resHeaders.set(
    "content-type",
    apiRes.headers.get("content-type") || "application/json"
  );

  // O fetch do Node já descomprime — devolvemos como texto
  const bodyText = await apiRes.text();

  return new NextResponse(bodyText, {
    status: apiRes.status,
    headers: resHeaders,
  });
}

// Exporta todos os métodos que vamos suportar
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

// Opcional: responde rapidamente a OPTIONS (não costuma ser necessário para same-origin)
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });
}
