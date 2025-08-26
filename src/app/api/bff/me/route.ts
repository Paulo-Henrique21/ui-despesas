// src/app/api/bff/me/route.ts
import { NextRequest, NextResponse } from "next/server";

const SLEEP_MS = 1000;         // 1s entre tentativas
const MAX_WAIT_MS = 15000;     // espera total ~15s para "acordar" a API
const TIMEOUT_MS = 12000;      // timeout de cada request

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function wakeApi(apiBase: string) {
  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${apiBase}/health`, {
        cache: "no-store",
        headers: { accept: "text/plain" },
      });
      if (r.ok) return;
    } catch {
      /* ignora e segue tentando */
    }
    await sleep(SLEEP_MS);
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ac.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL!;
  const cookie = req.headers.get("cookie") || "";

  // 1ª tentativa
  let apiRes: Response;
  try {
    apiRes = await fetchWithTimeout(`${apiBase}/api/users/profile`, {
      method: "GET",
      headers: {
        cookie,                  // repassa o token da UI para a API
        accept: "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });
  } catch {
    // erro de rede → trata como 503 para acionar wake+retry
    apiRes = new Response(null, { status: 503 });
  }

  // Se a API estiver dormindo/instável, acorda e tenta de novo
  if ([502, 503, 504].includes(apiRes.status)) {
    await wakeApi(apiBase);
    try {
      apiRes = await fetchWithTimeout(`${apiBase}/api/users/profile`, {
        method: "GET",
        headers: {
          cookie,
          accept: "application/json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      });
    } catch {
      // mantém o status de erro se falhar novamente
      apiRes = new Response(null, { status: 503 });
    }
  }

  // Tenta ler JSON sem quebrar se vier vazio
  const data = await apiRes
    .json()
    .catch(() => ({} as unknown));

  // Devolve sempre JSON e sem cache
  return new NextResponse(JSON.stringify(data), {
    status: apiRes.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
