// src/lib/wakeApi.ts
export async function wakeApi(
  { maxMs = 15000, stepMs = 1500 }: { maxMs?: number; stepMs?: number } = {}
) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch("/api/bff/health?wait=1", { cache: "no-store" });
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, stepMs));
  }
  return false;
}
