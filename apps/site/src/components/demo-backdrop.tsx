import type { ReactNode } from "react";

/** The sky backdrop the Figma boards put glass on, so the blur has something to show. */
export function Backdrop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl flex w-full flex-wrap items-center justify-center gap-4 bg-[linear-gradient(135deg,var(--color-sky-100),var(--color-sky-400)_55%,var(--color-sky-700))] p-4 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
