import { useState, type ReactNode } from "@lynx-js/react";

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

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the entry
 * lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string };
};

/** The group's accessible name, kept out of the main prop block because react only had it as an inherited `div` attribute. */
type FilterBarLabel = {
  /** Accessible name of the group; defaults to `Filter`. */
  "aria-label"?: string;
};

/**
 * Props of {@link FilterBar}: the options and the selection, controlled or uncontrolled. React spread
 * the remaining `div` attributes and dropped `onChange`/`defaultValue` because they clash with its own
 * selection props; Lynx has no DOM node to forward them to, so only `className` carries over.
 */
export type FilterBarProps = Omit<PortedElementProps["div"], "onChange" | "defaultValue"> & {
  /** Options in display order; the first one is the initial selection when `defaultValue` is omitted. */
  items: FilterBarItem[];
  /** Controlled selection. Pass `onValueChange` to hear about clicks. */
  value?: string;
  /** Initial selection when uncontrolled. @default items[0].value */
  defaultValue?: string;
  /** Called with the clicked option's `value`; clicks on the already-selected option still fire. */
  onValueChange?: (value: string) => void;
  /** Extra classes on the track. */
  className?: string;
} & FilterBarLabel;

/**
 * Paper `Filter bar` (Agents N2): a 5% ink pill track with 30px options; the selected option sits on a sliding 10% ink pill.
 * The pills never wrap, so a screen too narrow for all of them scrolls the track sideways instead of widening the page.
 *
 * Selection is controlled through `value` or uncontrolled from `defaultValue`, which falls back to the first
 * item. Lynx has no `radiogroup` role or `aria-checked`, so the track is an accessibility element named by
 * `aria-label` and each option reports the `selected` trait while it is the one chosen. The background pill is
 * measured by the active option through `useActiveIndicator` and hides when none matches; it lands without
 * animating on the first paint. A disabled option never selects.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { FilterBar } from "@horon-ai/lynx";
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
export function FilterBar({ items, value, defaultValue, onValueChange, className, "aria-label": ariaLabel = "Filter" }: FilterBarProps) {
  const [inner, setInner] = useState<string | undefined>(defaultValue ?? items[0]?.value);
  const selected = value ?? inner;
  const activeIndex = items.findIndex((item) => item.value === selected);
  const { rect, animate, bindTrack, bindItem } = useActiveIndicator(activeIndex);

  return (
    <view
      className={cn("relative inline-flex max-w-full min-w-0 flex-row items-center rounded-full bg-overlay-ink-5 p-[3px]", className)}
      accessibility-element
      accessibility-role-description="radiogroup"
      accessibility-label={ariaLabel}
    >
      <scroll-view scroll-orientation="horizontal" className="max-w-full">
        <view className="relative flex flex-row items-center gap-0.5" bindlayoutchange={bindTrack}>
          {rect ? (
            <view
              className={cn("absolute rounded-full bg-overlay-ink-10", animate && "motion-indicator")}
              style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
              accessibility-elements-hidden
            />
          ) : null}
          {items.map((item, index) => {
            const active = item.value === selected;
            return (
              <view
                key={item.value}
                className={cn(
                  "relative flex h-[30px] shrink-0 flex-row items-center gap-1.5 whitespace-nowrap rounded-full px-4 motion-colors",
                  active ? "text-text-primary" : "text-text-secondary",
                  item.disabled && "opacity-40",
                )}
                bindtap={() => {
                  if (item.disabled) return;
                  setInner(item.value);
                  onValueChange?.(item.value);
                }}
                accessibility-element
                accessibility-traits="button"
                accessibility-role-description="radio"
                accessibility-label={typeof item.label === "string" ? item.label : item.value}
                accessibility-value={active ? "checked" : "unchecked"}
                {...bindItem(index)}
              >
                <text className={cn("text-trim text-label-md", active ? "text-text-primary" : "text-text-secondary")}>{item.label}</text>
                {item.count !== undefined ? <text className="text-trim text-caption text-text-secondary">{item.count}</text> : null}
              </view>
            );
          })}
        </view>
      </scroll-view>
    </view>
  );
}
