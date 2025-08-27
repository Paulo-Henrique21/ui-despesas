"use client";
import { useEffect, useState } from "react";

type Status = "checking" | "ready" | "error";

export default function ApiReadyGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // espera o BFF dizer que a API está de pé
        const res = await fetch("/api/bff/health?wait=1", { cache: "no-store" });
        if (!cancelled) setStatus(res.ok ? "ready" : "error");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "ready") return <>{children}</>;

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="text-2xl">😴 Não consegui acordar o servidor</div>
        <p className="text-sm opacity-80">
          Tente novamente. Em planos gratuitos, o servidor pode levar ~30–60s para iniciar.
        </p>
        <button
          onClick={() => location.reload()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // estado "checking"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <div className="text-lg">Acordando o servidor…</div>
      <p className="text-sm opacity-80">Isso pode levar até 1 minuto na versão gratuita.</p>
    </div>
  );
}
