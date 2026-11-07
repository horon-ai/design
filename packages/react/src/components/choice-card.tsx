import { Radio as BaseRadio } from "@base-ui/react/radio";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
/**
 * Props for {@link ChoiceCard}: a radio root plus the card's own title, description and badge slots.
 * `value`, `disabled` and the other radio props pass straight through to the Base UI radio root.
 */
export type ChoiceCardProps = Omit<ComponentProps<typeof BaseRadio.Root>, "className" | "children" | "title"> & {
  /** Card heading on the title line; `label-md` semibold primary text, wrapped onto as many lines as the card width allows. */
  title: ReactNode;
  /** Optional second line under the title, rendered as `caption` secondary text. */
  description?: ReactNode;
  /** Pill at the end of the title line, e.g. "Recommended": 22px, 8px padding, 18% sky with brand text (Paper Mobile connection). */
  badge?: ReactNode;
  /** `brand` (default) is 18% sky with brand text; `neutral` is 6% ink with secondary text. @default "brand" */
  badgeTone?: "brand" | "neutral";
  /** Extra classes on the card root, merged after the layout, border and state classes. */
  className?: string;
};

/**
 * Paper `Choice card` (1VXM-0 selected, 1VXR-0 default): a 252px solid card, padding 14, radius 16, gap 12,
 * with a 1px default border that turns brand when selected; no glass.
 * Use inside `RadioGroup`. The 18px radio is a ring: 1.5px grey when off, a 5px ink ring around an 8px core when on.
 *
 * The card is a Base UI radio root, so it belongs to a single-select group: arrow keys move the selection,
 * `value` / `defaultValue` on the group pick the card, and `disabled` drops the card to 40% opacity and blocks
 * the click. The radio mark is decorative; the accessible name is the card's own text.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="team">
 *   <ChoiceCard value="solo" title="Solo" description="One workspace for yourself." />
 *   <ChoiceCard
 *     value="team"
 *     title="Team"
 *     description="Shared bots, memory and billing."
 *     badge="Recommended"
 *   />
 * </RadioGroup>
 * ```
 */
export function ChoiceCard({ title, description, badge, badgeTone = "brand", className, ...props }: ChoiceCardProps) {
  return (
    <BaseRadio.Root
      className={cn(
        "group relative flex w-full max-w-[252px] cursor-pointer items-start gap-3 overflow-clip rounded-2xl border border-border-default bg-bg-surface p-3.5 text-left motion-colors data-checked:border-border-brand data-unchecked:hover:border-border-strong",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="relative mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-dashed motion-colors group-data-checked:border-interactive-primary group-data-checked:shadow-[inset_0_0_0_3.5px_var(--color-interactive-primary)]"
      >
        <BaseRadio.Indicator className="size-2 animate-pop-in rounded-full bg-interactive-on-primary data-unchecked:hidden" />
      </span>
      <span className="relative flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2.5">
          <span className="min-w-0 flex-1 text-label-md font-semibold text-text-primary">{title}</span>
          {badge && (
            <span
              className={cn(
                "inline-flex h-[22px] shrink-0 items-center rounded-full px-2 text-label-sm",
                badgeTone === "brand" ? "bg-accent-sky-500-18 text-text-brand" : "bg-overlay-ink-6 text-text-secondary",
              )}
            >
              {badge}
            </span>
          )}
        </span>
        {description && <span className="text-caption text-text-secondary">{description}</span>}
      </span>
    </BaseRadio.Root>
  );
}
