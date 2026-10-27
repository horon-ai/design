import type { ReactNode } from "react";

import { cn } from "../lib/cn";

export type EmptyStateProps = {
  /** 140px illustration, such as a mascot pose. */
  illustration?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Action under the text, usually a `Button`. */
  action?: ReactNode;
  className?: string;
};

/** Figma `Empty state` (64:485): centered 140px mascot, title-md heading, body-md text, action. */
export function EmptyState({ illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-90 animate-[tab-panel-in_240ms_var(--ease-out-quint)] flex-col items-center gap-3 px-6 py-8 text-center",
        className,
      )}
    >
      {illustration && (
        <div className="flex size-35 shrink-0 items-center justify-center [&>*]:size-full">{illustration}</div>
      )}
      <p className="text-title-md text-text-primary">{title}</p>
      {description && <p className="text-body-md text-text-secondary">{description}</p>}
      {action && <div className="mt-1 flex">{action}</div>}
    </div>
  );
}
