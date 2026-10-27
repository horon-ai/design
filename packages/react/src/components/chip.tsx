import { Toggle } from "@base-ui/react/toggle";
import { Check } from "@phosphor-icons/react";
import { type ComponentProps, useState } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ChipProps = Omit<ComponentProps<typeof Toggle>, "className"> & { className?: string };

/** Figma `Chip` (61:302): a 32px clear-glass toggle; selected shows a check and the brand rim. */
export function Chip({ className, children, onPressedChange, ...props }: ChipProps) {
  // The exit animation only plays after the first toggle, so a chip that mounts unpressed never flashes the check.
  const [toggled, setToggled] = useState(false);
  return (
    <Toggle
      className={cn(
        "group relative inline-flex h-8 shrink-0 motion-press cursor-pointer items-center justify-center overflow-clip rounded-full border px-3 text-label-md whitespace-nowrap",
        "border-transparent bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover",
        "data-pressed:border-border-brand data-pressed:bg-glass-clear-pressed data-pressed:text-text-brand hover:not-data-disabled:data-pressed:bg-glass-clear-pressed",
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
      <LiquidGlass texture />
      <span
        aria-hidden
        className="relative -mr-1.5 flex w-0 shrink-0 overflow-hidden transition-[width,margin] duration-150 ease-out group-data-pressed:mr-0 group-data-pressed:w-[1.375rem]"
      >
        <Check
          className={cn(
            "size-3.5 opacity-0 group-data-pressed:animate-pop-in",
            toggled && "animate-pop-out group-data-pressed:animate-pop-in",
          )}
        />
      </span>
      <span className="relative">{children}</span>
    </Toggle>
  );
}
