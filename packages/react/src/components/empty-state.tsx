import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** Props for {@link EmptyState}: an optional illustration, the copy and one action. */
export type EmptyStateProps = {
  /** 140px illustration, such as a mascot pose. The slot is square and the child is stretched to fill it. */
  illustration?: ReactNode;
  /** Heading, rendered as a `title-md` balanced paragraph. */
  title: ReactNode;
  /** Supporting copy under the heading, `body-md` secondary text across the full column width. */
  description?: ReactNode;
  /** Action under the text, usually a `Button`. */
  action?: ReactNode;
  /** Extra classes on the column, merged after the width, spacing and entry animation. */
  className?: string;
};

/**
 * Figma `Empty state` (64:485): centered 140px mascot, title-md heading, body-md text, action.
 *
 * A 360px-max column with a rise-in animation and no border or fill, so it drops into a card, a panel body
 * or an empty table area without drawing its own surface.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   illustration={<img src="/mascots/horon-mascot-welcome.webp" alt="" />}
 *   title="Meet your first bot"
 *   description="Give it a role and a task. It keeps working after you close the laptop."
 *   action={<Button>Create a bot</Button>}
 * />
 * ```
 */
export function EmptyState({ illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex w-full max-w-90 motion-rise flex-col items-center gap-3 px-6 py-8 text-center", className)}
    >
      {illustration && (
        <div className="flex size-35 shrink-0 items-center justify-center [&>*]:size-full">{illustration}</div>
      )}
      <p className="text-title-md text-balance text-text-primary">{title}</p>
      {description && <p className="self-stretch text-body-md text-pretty text-text-secondary">{description}</p>}
      {action && <div className="mt-4 flex">{action}</div>}
    </div>
  );
}
