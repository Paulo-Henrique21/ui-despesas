import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
const TIMEOUT_MS  = 15_000;  // timeout por tentativa
const MAX_WAIT_MS = 60_000;  // espera total (acordar API free pode levar 30–60s)

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pingOnce(): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`${API_BASE}/health`, {
      cache: "no-store",
      signal: ctrl.signal,
    });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Acorda a API: tenta até MAX_WAIT_MS com backoff. */
async function wakeApi(wait: boolean): Promise<boolean> {
  if (!wait) {
    // dispara de leve e sai (para pre-warm sem bloquear)
    pingOnce().catch(() => {});
    return false;
  }
  const deadline = Date.now() + MAX_WAIT_MS;
  let delay = 1000; // 1s → 2s → 4s → 8s (cap)

  while (Date.now() < deadline) {
    if (await pingOnce()) return true;
    await sleep(delay);
    delay = Math.min(delay * 2, 8000);
  }
  return false;
}

export async function GET(req: NextRequest) {
  const wait = req.nextUrl.searchParams.get("wait") !== "0"; // default: espera
  const ok = await wakeApi(wait);

  return NextResponse.json(
    { ok },
    {
      status: ok ? 200 : 504,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
