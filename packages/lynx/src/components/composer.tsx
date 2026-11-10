import { useEffect, useRef, useState } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { IconButton } from "./icon-button";

/** Height and text rung of the composer: `sm` 32px, `md` 40px, `lg` 48px, shared with the other controls. */
export type ComposerSize = ControlSize;
/** `solid` is the opaque bordered pill; `glass` is the veil field for imagery and glass panels. */
export type ComposerSurface = "solid" | "glass";

/** Props for {@link Composer}: the message value, the send callback and the two side actions. */
export type ComposerProps = {
  /** Rung of the field and its icon buttons. @default "md" */
  size?: ComposerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: ComposerSurface;
  /** Field placeholder; it doubles as the `aria-label` because the field has no visible label. @default "Message" */
  placeholder?: string;
  /** Controlled text. Leave it out to let the composer own the value and still report changes. */
  value?: string;
  /** Starting text of the uncontrolled composer. @default "" */
  defaultValue?: string;
  /** Fires on every keystroke with the next full text, controlled or not. */
  onValueChange?: (value: string) => void;
  /** Fires with the full (untrimmed) text when the send button is pressed; whitespace-only text blocks the submit. The field is cleared after. */
  onSubmit?: (value: string) => void;
  /** Fires when the plus button is pressed; the composer itself opens nothing. */
  onAttach?: () => void;
  /** Fires when the microphone button is pressed, i.e. while the field is empty. */
  onVoice?: () => void;
  /** Disables the field and both icon buttons without changing the layout. */
  disabled?: boolean;
  /** Extra classes on the form, merged after the surface and size classes. */
  className?: string;
};

const sizeClass: Record<ComposerSize, string> = {
  sm: "gap-1.5 p-1.5",
  md: "gap-2 p-2",
  lg: "gap-2.5 p-2.5",
};

/** Lynx's `<textarea>` has no intrinsic single-line height, so the rung sets it. */
const fieldHeight: Record<ComposerSize, number> = { sm: 20, md: 20, lg: 24 };

const textClass: Record<ComposerSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/**
 * Lynx's engine paints the placeholder from this variable, which the class list sets so the engine
 * inherits it into the field.
 */
const PLACEHOLDER_CLASS = "[-x-placeholder-color:var(--color-text-placeholder)]";

/** The only part of a Lynx textarea event the composer reads. */
type LynxTextEvent = { detail: { value: string } };

/**
 * Figma `Composer` (63:462): a regular-glass pill with an attach button, the
 * message field, and a voice button that turns into the ink send button once
 * there is text.
 *
 * Lynx has no `form`, so Enter (the soft keyboard's send key) and the send button share one submit
 * path; a value that is only whitespace blocks the send and leaves the typed text in place. The last
 * slot swaps between the voice button (empty field) and the primary send button, and only the visible
 * one is mounted, because Lynx does not match React's `inert` or `data-hidden` selectors.
 *
 * @example
 * ```tsx
 * <Composer
 *   placeholder="Ask anything"
 *   onAttach={() => openFilePicker()}
 *   onVoice={() => startDictation()}
 *   onSubmit={(text) => sendMessage(text)}
 * />
 * ```
 */
export function Composer({
  size = "md",
  surface = "solid",
  placeholder = "Message",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onAttach,
  onVoice,
  disabled,
  className,
}: ComposerProps) {
  const [valueState, setValueState] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const value = valueProp ?? valueState;
  const node = useRef<NodesRef | null>(null);
  /** Bumped after a send, so the native editor is emptied even when the caller owns the value. */
  const [clears, setClears] = useState(0);

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

  // After a send the field shows the value the composer now holds: empty while it
  // owns the text, or the parent's value when the parent owns it (react re-rendered
  // the same prop). The native editor does not follow that, so it is written here.
  useEffect(() => {
    if (clears === 0) return;
    writeNative(valueProp ?? "");
  }, [clears, valueProp]);
  const setValue = (next: string) => {
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next);
  };
  const submit = () => {
    if (!value.trim()) return;
    onSubmit?.(value);
    setValue("");
    setClears((count) => count + 1);
  };
  const canSubmit = value.trim() !== "";

  return (
    <view
      className={cn(
        "motion-colors relative flex min-w-0 max-w-full flex-row items-center overflow-hidden rounded-full",
        surface === "glass"
          ? "veil-field"
          : cn("border bg-bg-surface", focused ? "border-border-strong" : "border-border-default"),
        sizeClass[size],
        className,
      )}
    >
      <IconButton
        size={size}
        icon={<Icon name="Plus" color="text-secondary" />}
        label="Attach"
        onClick={onAttach}
        disabled={disabled}
      />
      <textarea
        className={cn(
          "relative min-w-0 flex-1",
          textClass[size],
          PLACEHOLDER_CLASS,
          disabled ? "text-text-disabled" : "text-text-primary",
        )}
        style={{ height: `${fieldHeight[size]}px` }}
        default-value={defaultValue}
        ref={node}
        placeholder={placeholder}
        confirm-type="send"
        maxlines={1}
        disabled={disabled}
        accessibility-element
        accessibility-label={placeholder}
        bindfocus={() => setFocused(true)}
        bindblur={() => setFocused(false)}
        bindinput={(event: LynxTextEvent) => {
          if (disabled) return;
          setValue(event.detail.value);
        }}
        bindconfirm={() => {
          if (disabled) return;
          submit();
        }}
      />
      {canSubmit ? (
        <IconButton
          size={size}
          variant="primary"
          icon={<Icon name="ArrowUp" />}
          label="Send"
          onClick={submit}
          disabled={disabled}
        />
      ) : (
        <IconButton
          size={size}
          icon={<Icon name="Microphone" color="text-secondary" />}
          label="Voice input"
          onClick={onVoice}
          disabled={disabled}
        />
      )}
    </view>
  );
}
