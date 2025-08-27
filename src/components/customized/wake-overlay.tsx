// src/components/WakeOverlay.tsx
export function WakeOverlay({ msg = "Acordando servidor..." }: { msg?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
      <div className="rounded-xl border p-6 shadow-lg">
        <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent mx-auto" />
        <div className="text-sm text-muted-foreground">{msg}</div>
      </div>
    </div>
  );
}
