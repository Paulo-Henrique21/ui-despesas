import { NextRequest, NextResponse } from "next/server";
const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL!;
  const url = new URL(req.url);
  const wait = url.searchParams.get("wait")==="1";
  const maxMs = Number(url.searchParams.get("ms") ?? 120000);
  const start = Date.now();

  const tryOnce = async () => {
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), 12000);
    try {
      const r = await fetch(`${apiBase}/health`, {
        headers: { "accept-encoding": "identity" }, // evita double-gzip
        cache: "no-store",
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (r.status === 200) return { ok:true, status:200 };
      if ([502,521,522,523].includes(r.status)) return { ok:false, status:r.status };
      return { ok:false, status:r.status };
    } catch {
      clearTimeout(t);
      return { ok:false, status:0 };
    }
  };

  if (!wait) {
    const r = await tryOnce();
    return NextResponse.json({ ok:r.ok, status:r.status }, { status: r.ok?200:503 });
  }

  let attempt = 0;
  while (Date.now() - start < maxMs) {
    const r = await tryOnce();
    if (r.ok) return NextResponse.json({ ok:true }, { status:200 });
    attempt += 1;
    await sleep(Math.min(1000*attempt, 10000)); // backoff
  }
  return NextResponse.json({ ok:false, reason:"timeout" }, { status:504 });
}
