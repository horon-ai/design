import { type ComponentProps, type ReactNode, useRef, useState } from "react";

import { cn } from "../lib/cn";
import { useActiveIndicator } from "../hooks/use-active-indicator";

/** One option in a `FilterBar`. */
export type FilterBarItem = {
  /** Stable value reported through `onValueChange` and compared with `value`. */
  value: string;
  /** Visible chip text; normally a short noun such as `All` or `Agents`. */
  label: ReactNode;
  /** Count shown after the label, such as 4. Omit to hide the slot. */
  count?: number;
  /** Disables just this option: 40% opacity, not clickable. */
  disabled?: boolean;
};

/** Props of {@link FilterBar}: the options and the selection, controlled or uncontrolled. */
export type FilterBarProps = Omit<ComponentProps<"div">, "onChange" | "defaultValue"> & {
  /** Options in display order; the first one is the initial selection when `defaultValue` is omitted. */
  items: FilterBarItem[];
  /** Controlled selection. Pass `onValueChange` to hear about clicks. */
  value?: string;
  /** Initial selection when uncontrolled. @default items[0].value */
  defaultValue?: string;
  /** Called with the clicked option's `value`; clicks on the already-selected option still fire. */
  onValueChange?: (value: string) => void;
};

/**
 * Paper `Filter bar` (Agents N2): a 5% ink pill track with 30px options; the selected option sits on a sliding 10% ink pill.
 * The pills never wrap, so a screen too narrow for all of them scrolls the track sideways instead of widening the page.
 * The track keeps its intrinsic width (and so stays centred by its parent) unless that width exceeds the box.
 *
 * Selection is controlled through `value` or uncontrolled from `defaultValue`, which falls back to the first
 * item. The group is a `radiogroup` labelled by `aria-label` (`Filter` when omitted), each option a
 * `<button role="radio" aria-checked>`; the background pill is measured by the active option and hides when
 * none matches, and it lands without animating on the first paint. There is no roving tab index: every enabled
 * option is a tab stop, and Space or Enter selects it.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { FilterBar } from "@horon-ai/react";
 *
 * function Example() {
 *   const [scope, setScope] = useState("all");
 *   return (
 *     <FilterBar
 *       aria-label="Scope"
 *       value={scope}
 *       onValueChange={setScope}
 *       items={[
 *         { value: "all", label: "All", count: 12 },
 *         { value: "agents", label: "Agents", count: 4 },
 *         { value: "archived", label: "Archived", disabled: true },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function FilterBar({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  "aria-label": ariaLabel = "Filter",
  ...props
}: FilterBarProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? inner;
  const track = useRef<HTMLDivElement>(null);
  const { rect, animate } = useActiveIndicator(track, '[aria-checked="true"]');

  return (
    <div
      ref={track}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex max-w-full min-w-0 items-center gap-0.5 overflow-x-auto rounded-full bg-overlay-ink-5 p-[3px]",
        className,
      )}
      {...props}
    >
      {rect && (
        <span
          aria-hidden
          className={cn("absolute rounded-full bg-overlay-ink-10", animate && "motion-indicator")}
          style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        />
      )}
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={item.disabled}
            onClick={() => {
              setInner(item.value);
              onValueChange?.(item.value);
            }}
            className={cn(
              "relative flex h-7.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 whitespace-nowrap motion-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand disabled:cursor-not-allowed disabled:opacity-40",
              active ? "text-text-primary" : "text-text-secondary hover:bg-overlay-ink-5 hover:text-text-primary",
            )}
          >
            <span className="text-label-md">{item.label}</span>
            {item.count !== undefined && <span className="text-caption text-text-secondary">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
