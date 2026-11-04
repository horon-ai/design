import { Toggle } from "@base-ui/react/toggle";
import { Check } from "@phosphor-icons/react";
import { type ComponentProps, useState } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type ChipSize = ControlSize;

export type ChipProps = Omit<ComponentProps<typeof Toggle>, "className"> & {
  /** `md` is the 32px Figma Chip; `sm` is 28px and `lg` 36px. */
  size?: ChipSize;
  className?: string;
};

const sizeClass: Record<ChipSize, string> = {
  sm: "h-7 px-2.5 text-label-sm",
  md: "h-8 px-3 text-label-md",
  lg: "h-9 px-3.5 text-label-lg",
};

/** The slot is 0px wide until pressed, then opens to icon + the label gap (6 / 8 / 10px). */
const checkSlotClass: Record<ChipSize, string> = {
  sm: "group-data-pressed:w-[1.125rem]",
  md: "group-data-pressed:w-[1.375rem]",
  lg: "group-data-pressed:w-[1.625rem]",
};

const checkIconClass: Record<ChipSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

/** Figma `Chip` (61:302): a 32px solid toggle, no glass; selected shows a check, the brand border and brand text. */
export function Chip({ size = "md", className, children, onPressedChange, ...props }: ChipProps) {
  // The exit animation only plays after the first toggle, so a chip that mounts unpressed never flashes the check.
  const [toggled, setToggled] = useState(false);
  return (
    <Toggle
      className={cn(
        "group relative inline-flex shrink-0 motion-press cursor-pointer items-center justify-center rounded-full border whitespace-nowrap",
        sizeClass[size],
        "border-border-default bg-bg-surface text-text-primary hover:not-data-disabled:bg-bg-subtle",
        "data-pressed:border-border-brand data-pressed:text-text-brand",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      onPressedChange={(pressed, eventDetails) => {
        setToggled(true);
        onPressedChange?.(pressed, eventDetails);
      }}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "relative flex w-0 shrink-0 overflow-hidden transition-[width] duration-150 ease-out",
          checkSlotClass[size],
        )}
      >
        <Check
          className={cn(
            "opacity-0 group-data-pressed:animate-pop-in",
            checkIconClass[size],
            toggled && "animate-pop-out group-data-pressed:animate-pop-in",
          )}
        />
      </span>
      <span className="relative text-trim">{children}</span>
    </Toggle>
  );
}
