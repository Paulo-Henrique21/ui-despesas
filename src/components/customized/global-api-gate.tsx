"use client";
import { useEffect, useState } from "react";

const WAKE_WAIT_URL = "/api/bff/health?wait=1&ms=120000"; // espera até 2 min
const WAKE_PING_URL = "/api/bff/health?wait=0";            // ping rápido

export function GlobalApiGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // dispara um ping “fire-and-forget” só para começar a acordar
      fetch(WAKE_PING_URL, { cache: "no-store" }).catch(() => {});

      try {
        // aqui ficamos esperando a API acordar de fato
        const res = await fetch(WAKE_WAIT_URL, { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) setReady(true);
        else setErr(`Servidor não respondeu (status ${res.status}).`);
      } catch {
        if (!cancelled) setErr("Falha de rede ao acordar servidor.");
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (!ready) {
    // Tela de “acordando” enquanto a API não ficou 200
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2
                          border-muted-foreground/30 border-t-foreground" />
          <p className="text-sm text-muted-foreground">Acordando servidor…</p>
          {err && (
            <p className="text-xs text-destructive/80 max-w-xs">
              {err} Tente novamente em alguns segundos.
              <button onClick={() => location.reload()} className="ml-2 underline">
                Recarregar
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
