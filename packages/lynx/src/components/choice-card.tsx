import { useState, type ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";

/**
 * Props for {@link ChoiceCard}: a radio's own state plus the card's title, description and badge slots.
 * `value`, `checked`, `defaultChecked`, `disabled` and the other radio props keep the names and defaults
 * Base UI's radio root published, spelled out here because Lynx has neither Base UI nor a hidden `<input>`.
 */
export type ChoiceCardProps = {
  /**
   * The value this card reports when picked. Base UI kept it optional, so a card without one is
   * still valid: it selects itself and reports nothing upward.
   */
  value?: string;
  /**
   * Selected state the caller owns. Passing it makes the card controlled: a tap reports the next
   * state through `onCheckedChange` but does not move the card by itself.
   */
  checked?: boolean;
  /** Selected state at first render when the caller does not own it. @default false */
  defaultChecked?: boolean;
  /** Fires with the next state when a tap asks to select the card. */
  onCheckedChange?: (checked: boolean) => void;
  /** Blocks interaction and dims the card to 40%; the mark keeps its state. @default false */
  disabled?: boolean;
  /** Keeps the card reachable but refuses to change the selection. @default false */
  readOnly?: boolean;
  /** Marks the card as required by a form. Accepted for call-site parity; Lynx has no form submission. */
  required?: boolean;
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Card heading on the title line; `label-md` semibold primary text, wrapped onto as many lines as the card width allows. */
  title: ReactNode;
  /** Optional second line under the title, rendered as `caption` secondary text. */
  description?: ReactNode;
  /** Pill at the end of the title line, e.g. "Recommended": 22px, 8px padding, 18% sky with brand text (Paper Mobile connection). */
  badge?: ReactNode;
  /** `brand` (default) is 18% sky with brand text; `neutral` is 6% ink with secondary text. @default "brand" */
  badgeTone?: "brand" | "neutral";
  /**
   * Extra classes on the card root, merged after the layout, border and state classes. React omitted
   * "className", "children" and "title" from the Base UI radio root and put `title` back as its own
   * card slot; the Lynx type declares the same three members directly.
   */
  className?: string;
};

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/** The Figma spring (`--ease-spring`), written out because an inline animation cannot read a variable. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/**
 * Paper `Choice card` (1VXM-0 selected, 1VXR-0 default): a 252px solid card, padding 14, radius 16, gap 12,
 * with a 1px default border that turns brand when selected; no glass.
 *
 * The 18px radio is a ring: 1.5px grey when off, and a brand disc with an 8px inverse core when on.
 * React drew the selected ring as an inset box-shadow; Lynx paints the same disc with the border and
 * background, then pops the core in on the spring.
 *
 * React took the selection from the surrounding Base UI radio group. Lynx has no group context to join,
 * so the card carries the radio's own state props (`checked`, `defaultChecked`, `onCheckedChange`) the
 * way {@link Checkbox} does, and a group of cards is coordinated by the caller holding that state. A
 * controlled card never moves on its own; `disabled` drops it to 40% opacity and blocks the tap.
 *
 * @example
 * ```tsx
 * import { ChoiceCard } from "@horon-ai/lynx";
 *
 * function Plan() {
 *   const [plan, setPlan] = useState("team");
 *   return (
 *     <view className="flex flex-col gap-3">
 *       <ChoiceCard value="solo" title="Solo" description="One workspace for yourself."
 *         checked={plan === "solo"} onCheckedChange={() => setPlan("solo")} />
 *       <ChoiceCard value="team" title="Team" description="Shared bots, memory and billing."
 *         badge="Recommended" checked={plan === "team"} onCheckedChange={() => setPlan("team")} />
 *     </view>
 *   );
 * }
 * ```
 */
export function ChoiceCard({
  value: _value,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  readOnly = false,
  required: _required,
  name: _name,
  id,
  title,
  description,
  badge,
  badgeTone = "brand",
  className,
}: ChoiceCardProps) {
  const [own, setOwn] = useState(defaultChecked);
  const isChecked = checked ?? own;
  const blocked = disabled || readOnly;

  const pick = () => {
    if (blocked) return;
    if (checked === undefined) setOwn(true);
    onCheckedChange?.(true);
  };

  return (
    <view
      className={cn(
        "relative flex w-full max-w-[252px] flex-row items-start gap-3 overflow-hidden rounded-2xl border bg-bg-surface p-3.5 motion-colors",
        isChecked ? "border-border-brand" : "border-border-default",
        !blocked && !isChecked && "active:border-border-strong",
        disabled && "opacity-40",
        className,
      )}
      bindtap={blocked ? undefined : pick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-role-description="radio"
      accessibility-value={isChecked ? "selected" : "unselected"}
      {...(id === undefined ? {} : { id })}
    >
      <view
        className={cn(
          "relative mt-px flex size-[18px] shrink-0 flex-row items-center justify-center rounded-full border-[1.5px] motion-colors",
          isChecked ? "border-interactive-primary bg-interactive-primary" : "border-border-dashed",
        )}
      >
        {isChecked ? (
          <view
            className="size-2 rounded-full bg-interactive-on-primary"
            style={{
              animationName: "pop-in",
              animationDuration: "220ms",
              animationTimingFunction: EASE_SPRING,
              animationFillMode: "both",
            }}
          />
        ) : null}
      </view>
      <view className="relative flex min-w-0 grow flex-col gap-1">
        <view className="flex flex-row items-center gap-2.5">
          {isPlainText(title) ? (
            <text className="min-w-0 grow text-label-md font-semibold text-text-primary">{title}</text>
          ) : (
            <view className="min-w-0 grow">{title}</view>
          )}
          {badge ? (
            <view
              className={cn(
                "flex h-[22px] shrink-0 flex-row items-center rounded-full px-2",
                badgeTone === "brand" ? "bg-accent-sky-500-18" : "bg-overlay-ink-6",
              )}
            >
              {isPlainText(badge) ? (
                <text
                  className={cn(
                    "text-label-sm",
                    badgeTone === "brand" ? "text-text-brand" : "text-text-secondary",
                  )}
                >
                  {badge}
                </text>
              ) : (
                badge
              )}
            </view>
          ) : null}
        </view>
        {description ? (
          isPlainText(description) ? (
            <text className="text-caption text-text-secondary">{description}</text>
          ) : (
            description
          )
        ) : null}
      </view>
    </view>
  );
}
