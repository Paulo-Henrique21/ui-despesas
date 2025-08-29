import { ensureApiAwake } from "./ensureApiAwake";

export async function apiFetch(
  path: string,
  init?: RequestInit,
  retryOnSleep = true
) {
  const url = `/api/bff/${path.replace(/^\//, "")}`;
  let res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });

  if ((res.status === 503 || res.status === 502) && retryOnSleep) {
    const awake = await ensureApiAwake();
    if (awake) {
      res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        ...init,
      });
    }
  }
  return res;
}
