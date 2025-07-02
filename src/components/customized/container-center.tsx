import { ReactNode } from "react";
export function ContainerCenter({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="max-w-5xl w-full h-full">
        <div className="container grid h-full max-w-full">{children}</div>
      </div>
    </div>
  );
}
