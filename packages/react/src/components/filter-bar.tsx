import { type ComponentProps, type ReactNode, useRef, useState } from "react";

import { cn } from "../lib/cn";
import { useActiveIndicator } from "../lib/use-active-indicator";

export type FilterBarItem = {
  value: string;
  label: ReactNode;
  /** Count shown after the label, such as 4. */
  count?: number;
  disabled?: boolean;
};

export type FilterBarProps = Omit<ComponentProps<"div">, "onChange" | "defaultValue"> & {
  items: FilterBarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/** Paper `Filter bar` (Agents N2): a 5% ink pill track with 30px options; the selected option sits on a sliding 10% ink pill. */
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
      className={cn("relative inline-flex items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]", className)}
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
              "motion-colors relative flex h-7.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-text-brand disabled:cursor-not-allowed disabled:opacity-50",
              active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
            )}
          >
            <span className="text-[14px]/[20px] font-medium">{item.label}</span>
            {item.count !== undefined && <span className="text-[12px]/[18px] text-text-secondary">{item.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
