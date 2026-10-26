import { CaretDown } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** The solid panel that hosts the Figma Agents blocks (Agent tasks 112:797): surface fill, 24px radius, 16px padding. */
export function AgentPanel({ className, ...props }: WithClass<ComponentProps<"section">>) {
  return (
    <section
      className={cn(
        "flex flex-col items-stretch gap-3 rounded-[24px] border border-border-default bg-bg-surface px-4 pt-4 pb-2",
        className,
      )}
      {...props}
    />
  );
}

export type ComposerChipProps = WithClass<ComponentProps<"button">> & {
  /** 18px tile initial (bots) or a 14px icon (projects). */
  leading?: ReactNode;
  tileClassName?: string;
};

/** A 30px 5% ink picker chip with a 12px caret, used for the bot and project in the task composer. */
export function ComposerChip({ leading, tileClassName, className, children, ...props }: ComposerChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-5 pr-2.5 pl-2 text-label-sm text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {typeof leading === "string" ? (
        <span
          className={cn(
            "flex size-4.5 items-center justify-center rounded-[5px] text-label-sm text-text-inverse",
            tileClassName ?? "bg-interactive-primary",
          )}
        >
          {leading}
        </span>
      ) : (
        <span className="flex text-text-secondary [&>svg]:size-3.5">{leading}</span>
      )}
      {children}
      <CaretDown aria-hidden className="size-3 text-text-secondary" />
    </button>
  );
}

export type TaskComposerProps = {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** Picker chips, usually two `ComposerChip`s. */
  pickers?: ReactNode;
  onStart?: () => void;
  startLabel?: string;
  className?: string;
};

/** Figma task `Composer` (Agent tasks 112:797): a 4% ink box, 18px radius, with pickers, ⌘↵ hint and Start. */
export function TaskComposer({
  placeholder = "Describe a task for a bot",
  value,
  onValueChange,
  pickers,
  onStart,
  startLabel = "Start",
  className,
}: TaskComposerProps) {
  return (
    <div className={cn("flex flex-col gap-3.5 rounded-[18px] bg-overlay-ink-4 pt-3.5 pr-3.5 pb-2.5 pl-4", className)}>
      <textarea
        rows={1}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.metaKey) onStart?.();
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="resize-none bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
      />
      <div className="flex items-center gap-1.5">
        {pickers}
        <span className="flex-1" />
        <Kbd>⌘</Kbd>
        <Kbd>↵</Kbd>
        <button
          type="button"
          onClick={onStart}
          className="flex h-8 shrink-0 cursor-pointer items-center rounded-full bg-interactive-primary px-3 text-label-sm text-text-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}
