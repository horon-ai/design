import { CaretDown } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { useDevice } from "../hooks/use-device";
import { usePlatform } from "../hooks/use-platform";
import { cn } from "../lib/cn";
import { isModKey } from "../lib/platform";
import { Kbd } from "./kbd";

/** Drops the base type's `className` so the panel can own it. */
type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged onto the root element. */
  className?: string;
};

/**
 * The solid panel that hosts the Figma Agents blocks (Agent tasks 112:797): surface fill, 24px radius, 16px padding.
 *
 * @example
 * ```tsx
 * <AgentPanel filter={<FilterBar items={[{ value: "all", label: "All" }]} />}>
 *   <TaskComposer onStart={start} pickers={<ComposerChip leading="R">Researcher</ComposerChip>} />
 * </AgentPanel>
 * ```
 */
export function AgentPanel({
  className,
  filter,
  children,
  ...props
}: WithClass<ComponentProps<"section">> & {
  /** Filter slot under the panel top, such as a `FilterBar`. */ filter?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col items-stretch gap-3 rounded-xl border border-border-default bg-bg-surface px-5 pt-4 pb-2",
        className,
      )}
      {...props}
    >
      {filter && <div className="flex">{filter}</div>}
      {children}
    </section>
  );
}

/** Props for {@link ComposerChip}: a leading tile letter or icon, its fill, and the usual button props. */
export type ComposerChipProps = WithClass<ComponentProps<"button">> & {
  /** 16px tile initial (bots) or a 14px icon (projects). */
  leading?: ReactNode;
  /** Tile fill, defaulting to the brand; pass a sky or neutral shade to match the bot it stands for. */
  tileClassName?: string;
};

/**
 * A 30px 5% ink picker chip with a 12px caret, used for the bot and project in the task composer.
 * Part of {@link TaskComposer}; the chip is a plain button, so it needs its own `onClick` or menu wiring.
 */
export function ComposerChip({ leading, tileClassName, className, children, ...props }: ComposerChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-5 pr-2.5 pl-2 text-label-sm text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {typeof leading === "string" ? (
        <span
          className={cn(
            "flex size-4 items-center justify-center rounded-xs text-label-sm text-text-inverse",
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

/** Props for {@link TaskComposer}: the draft text, picker chips, the start handler and the labels. */
export type TaskComposerProps = {
  /** Placeholder of the textarea; also its accessible name. @default "Describe a task for a bot" */
  placeholder?: string;
  /** Controlled draft text; leave undefined and pass `onValueChange` to lift the text, or omit both for a free draft. */
  value?: string;
  /** Fires on every keystroke with the next text, so the caller can hold the draft. */
  onValueChange?: (value: string) => void;
  /** Picker chips, usually two `ComposerChip`s. */
  pickers?: ReactNode;
  /** Fires on the Start button and on Mod+Enter; the composer does not clear the draft itself. */
  onStart?: () => void;
  /** Label of the start button. @default "Start" */
  startLabel?: string;
  /** Extra classes merged onto the box, for margins or width overrides. */
  className?: string;
};

/**
 * Figma task `Composer` (Agent tasks 112:797): a 4% ink box, 20px radius, with pickers, a key hint and Start.
 *
 * The textarea starts at one row and grows with its content up to 160px (`max-h-40`) before it scrolls.
 * Mod+Enter submits: ⌘Enter on macOS and iOS, Ctrl+Enter on Windows, Linux and Android. The hint is a
 * `Kbd keys="Mod+Enter"` chip, so it draws the same OS keys, and it is hidden on touch devices that have
 * no hovering fine pointer.
 *
 * @example
 * ```tsx
 * <TaskComposer
 *   value={draft}
 *   onValueChange={setDraft}
 *   onStart={start}
 *   pickers={<ComposerChip leading="R">Researcher</ComposerChip>}
 * />
 * ```
 */
export function TaskComposer({
  placeholder = "Describe a task for a bot",
  value,
  onValueChange,
  pickers,
  onStart,
  startLabel = "Start",
  className,
}: TaskComposerProps) {
  const { os } = usePlatform();
  const { keyboardHints } = useDevice();
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-xl bg-overlay-ink-4 px-4 pt-3.5 pb-2.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
        className,
      )}
    >
      <textarea
        rows={1}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && isModKey(event, os)) onStart?.();
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field-sizing-content max-h-40 min-h-5.5 w-full resize-none overflow-y-auto bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
      />
      <div className="flex flex-wrap items-center gap-1.5">
        {pickers && <span className="flex min-w-0 flex-wrap items-center gap-1.5">{pickers}</span>}
        <span className="min-w-0 flex-1" />
        {keyboardHints && <Kbd keys="Mod+Enter" />}
        <button
          type="button"
          onClick={onStart}
          className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center rounded-full bg-interactive-primary px-3.5 text-label-sm text-text-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}
