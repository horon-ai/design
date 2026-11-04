import type { ReactNode } from "react";

/** The sky backdrop the Figma boards put glass on, so the blur has something to show. */
export function Backdrop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex w-full flex-wrap items-center justify-center gap-4 rounded-2xl bg-linear-to-br from-sky-100 via-sky-400 to-sky-700 p-4 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
