import type { ReactNode } from "@lynx-js/react";

/**
 * Demo-only helper, not a component: the sky the glass sits on, so the frost
 * fill and the veil ring have something to show. Lynx has one scheme class per
 * root, so this keeps a single gradient instead of react's `dark:` pair.
 *
 * The `backdrop` demo file has no component slug, so `scripts/integrate.ts`
 * never registers it in the gallery.
 */
export function Backdrop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <view
      className={`flex w-full flex-row flex-wrap items-center justify-center gap-4 rounded-2xl bg-[linear-gradient(135deg,var(--color-sky-100),var(--color-sky-400)_55%,var(--color-sky-700))] p-4 ${className}`}
    >
      {children}
    </view>
  );
}
