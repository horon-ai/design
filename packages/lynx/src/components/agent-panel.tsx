import { useEffect, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";
import type { CSSProperties } from "@lynx-js/types";

import { useDevice } from "../hooks/use-device";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/**
 * Props of the native surface react spread onto a `button`. Lynx has no button element, so only the
 * members a caller uses are declared here and forwarded to the `view` that draws the chip.
 */
type PortedButtonAttributes = {
  /** Runs when the chip is tapped; a disabled chip never runs it. */
  onClick?: () => void;
  /** Blocks interaction and dims the chip to 40%. */
  disabled?: boolean;
  /** Kept for call-site parity. Lynx has no form submission, so it is inert. */
  type?: "button" | "submit" | "reset";
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the chip's own. */
  style?: CSSProperties;
  /** Accessible name when the visible label is not the whole name. */
  "aria-label"?: string;
};

/** Props of the native `section` react spread onto the panel; Lynx has no such element, so it is a `view`. */
type PortedSectionAttributes = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the panel's own. */
  style?: CSSProperties;
};

/** Drops the base type's `className` so the panel can own it. */
type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged onto the root element. */
  className?: string;
};

/**
 * The solid panel that hosts the Figma Agents blocks (Agent tasks 112:797): surface fill, 24px radius,
 * 16px padding.
 *
 * Lynx has no `<section>`, so the panel is a `view` and the only section attributes it can honour are
 * `id` and `style`.
 *
 * @example
 * ```tsx
 * import { AgentPanel, ComposerChip, TaskComposer } from "@horon-ai/lynx";
 *
 * <AgentPanel filter={<FilterBar items={[{ value: "all", label: "All" }]} />}>
 *   <TaskComposer onStart={start} pickers={<ComposerChip leading="R">Researcher</ComposerChip>} />
 * </AgentPanel>
 * ```
 */
export function AgentPanel({
  className,
  filter,
  children,
  id,
  style,
}: WithClass<PortedSectionAttributes> & {
  /** Filter slot under the panel top, such as a `FilterBar`. */ filter?: ReactNode;
  /** Panel content, usually a `TaskComposer` and its task rows. */
  children?: ReactNode;
}) {
  return (
    <view
      className={cn(
        "flex min-w-0 flex-col items-stretch gap-3 rounded-[24px] border border-border-default bg-bg-surface px-5 pb-2 pt-4",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {filter ? <view className="flex flex-row">{filter}</view> : null}
      {children}
    </view>
  );
}

/** Props for {@link ComposerChip}: a leading tile letter or icon, its fill, and the usual button props. */
export type ComposerChipProps = WithClass<PortedButtonAttributes> & {
  /** 16px tile initial (bots) or a 14px icon (projects). */
  leading?: ReactNode;
  /** Tile fill, defaulting to the brand; pass a sky or neutral shade to match the bot it stands for. */
  tileClassName?: string;
  /** The chip label, drawn after the leading tile. */
  children?: ReactNode;
};

/**
 * A 30px 5% ink picker chip with a 12px caret, used for the bot and project in the task composer.
 * Part of {@link TaskComposer}; the chip is a plain button, so it needs its own `onClick` or menu wiring.
 *
 * Lynx has no `<button>`, so the chip is a `view` announced with the button trait, and a string
 * `leading` becomes the 16px tile while any node is drawn at 14px beside the label.
 *
 * @example
 * ```tsx
 * import { ComposerChip, Icon } from "@horon-ai/lynx";
 *
 * <ComposerChip leading="C">Chief of staff</ComposerChip>
 * <ComposerChip leading={<Icon name="Folder" />}>Horon HQ</ComposerChip>
 * ```
 */
export function ComposerChip({
  leading,
  tileClassName,
  className,
  children,
  onClick,
  disabled,
  type: _type,
  id,
  style,
  "aria-label": ariaLabel,
}: ComposerChipProps) {
  return (
    <view
      className={cn(
        "motion-press flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-5 pl-2 pr-2.5",
        disabled ? "opacity-40" : "active:bg-overlay-ink-10",
        className,
      )}
      style={style}
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-label={ariaLabel}
      {...(id === undefined ? {} : { id })}
    >
      {typeof leading === "string" ? (
        <view
          className={cn(
            "flex size-4 flex-row items-center justify-center rounded-[5px]",
            tileClassName ?? "bg-interactive-primary",
          )}
        >
          <text className="text-label-sm text-text-inverse">{leading}</text>
        </view>
      ) : leading ? (
        <view className="flex shrink-0 flex-row items-center justify-center">{leading}</view>
      ) : null}
      {typeof children === "string" || typeof children === "number" ? (
        <text className="text-label-sm text-text-primary">{children}</text>
      ) : (
        children
      )}
      <Icon name="CaretDown" size={12} color="text-secondary" />
    </view>
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

/** Lynx's engine paints the placeholder from this variable, which the class list sets on the field. */
const PLACEHOLDER_CLASS = "[-x-placeholder-color:var(--color-text-secondary)]";

/** The ring Lynx draws where react drew its 2px offset outline on the composer box. */
const FOCUS_RING = { boxShadow: "0 0 0 2px var(--color-text-brand)" };

/** The only part of a Lynx textarea event the composer reads. */
type LynxTextEvent = { detail: { value: string } };

/**
 * Figma task `Composer` (Agent tasks 112:797): a 4% ink box, 20px radius, with pickers, a key hint and Start.
 *
 * React's textarea grew with its content (`field-sizing-content`); Lynx sizes the editor by `maxlines`, so the
 * field holds one line and scrolls past five. Mod+Enter submits through `bindconfirm` (the engine's confirm
 * key) — ⌘Enter on macOS and iOS, Ctrl+Enter on Windows, Linux and Android — and the hint is a
 * `Kbd keys="Mod+Enter"` chip, hidden on touch devices that show no keyboard hints.
 *
 * Lynx's `<textarea>` has no controlled `value` attribute, so a changed `value` prop is written into the
 * native editor through `setValue`, the same path `Composer` takes.
 *
 * @example
 * ```tsx
 * import { ComposerChip, TaskComposer } from "@horon-ai/lynx";
 *
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
  value: valueProp,
  onValueChange,
  pickers,
  onStart,
  startLabel = "Start",
  className,
}: TaskComposerProps) {
  const [valueState, setValueState] = useState("");
  const [focused, setFocused] = useState(false);
  const { keyboardHints } = useDevice();
  const node = useRef<NodesRef | null>(null);
  const value = valueProp ?? valueState;

  /** Writes text into the native editor; the render-test element has no native method to call. */
  const writeNative = (next: string) => {
    const element = node.current;
    if (!element) return;
    try {
      element.invoke({ method: "setValue", params: { value: next } }).exec();
    } catch {
      // Nothing to write in a test host; the component's own state is the observable.
    }
  };

  // A controlled value can change without an input event, and the editor keeps
  // its own text, so the prop is written back through the native `setValue`.
  useEffect(() => {
    if (valueProp === undefined) return;
    writeNative(valueProp);
  }, [valueProp]);

  const setValue = (next: string) => {
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next);
  };

  return (
    <view
      className={cn("motion-colors flex flex-col gap-3.5 rounded-xl bg-overlay-ink-4 px-4 pb-2.5 pt-3.5", className)}
      style={focused ? FOCUS_RING : undefined}
    >
      <textarea
        className={cn("w-full text-body-sm text-text-primary", PLACEHOLDER_CLASS)}
        style={{ minHeight: "22px", maxHeight: "160px" }}
        default-value={value}
        ref={node}
        placeholder={placeholder}
        maxlines={5}
        accessibility-element
        accessibility-label={placeholder}
        bindfocus={() => setFocused(true)}
        bindblur={() => setFocused(false)}
        bindinput={(event: LynxTextEvent) => setValue(event.detail.value)}
        bindconfirm={() => onStart?.()}
      />
      <view className="flex flex-row flex-wrap items-center gap-1.5">
        {pickers ? <view className="flex min-w-0 flex-row flex-wrap items-center gap-1.5">{pickers}</view> : null}
        <view className="min-w-0 flex-1" />
        {keyboardHints ? <Kbd keys="Mod+Enter" /> : null}
        <view
          className="motion-press flex h-[30px] shrink-0 flex-row items-center rounded-full bg-interactive-primary px-3.5 active:bg-interactive-primary-hover"
          bindtap={onStart}
          accessibility-element
          accessibility-traits="button"
        >
          <text className="text-label-sm text-text-inverse">{startLabel}</text>
        </view>
      </view>
    </view>
  );
}
