export async function ensureApiAwake(timeoutMs = 25_000, intervalMs = 1000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch("/api/bff/health", { cache: "no-store" });
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
