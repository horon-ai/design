import type { ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";

/** Text slots take a string so the token classes can sit on a `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

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
 * or an empty table area without drawing its own surface. `text-balance`/`text-pretty` have no Lynx
 * equivalent, so the same centering comes from `text-center` alone.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   illustration={<image src="/mascots/horon-mascot-welcome.webp" />}
 *   title="Meet your first bot"
 *   description="Give it a role and a task. It keeps working after you close the laptop."
 *   action={<Button>Create a bot</Button>}
 * />
 * ```
 */
export function EmptyState({ illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <view
      className={cn(
        "flex w-full max-w-[360px] motion-rise flex-col items-center gap-3 px-6 py-8 text-center",
        className,
      )}
    >
      {illustration ? (
        <view className="flex size-[140px] shrink-0 items-center justify-center">{illustration}</view>
      ) : null}
      <view className="w-full">
        {isPlainText(title) ? <text className="text-title-md text-center text-text-primary">{title}</text> : title}
      </view>
      {description ? (
        <view className="w-full self-stretch">
          {isPlainText(description) ? (
            <text className="text-body-md text-center text-text-secondary">{description}</text>
          ) : (
            description
          )}
        </view>
      ) : null}
      {action ? <view className="mt-4 flex flex-row">{action}</view> : null}
    </view>
  );
}
