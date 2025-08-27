"use client";
import { useEffect, useState } from "react";

const API = 'https://api-despesas.onrender.com'

async function pingBff(): Promise<boolean> {
  try {
    const r = await fetch("/api/bff/health?wait=0", { cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

export default function ApiBootGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop = false;

    // 1) “Cutucão” direto na API (acorda mesmo sem CORS)
    fetch(`${API}/health`, { mode: "no-cors" }).catch(() => {});

    // 2) Poll no BFF até ficar ok
    const loop = async () => {
      while (!stop) {
        const ok = await pingBff();
        if (ok) {
          setReady(true);
          return;
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    };
    loop();

    return () => {
      stop = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="animate-pulse text-xl font-semibold">Acordando servidor…</div>
          <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos na camada gratuita do Render.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
