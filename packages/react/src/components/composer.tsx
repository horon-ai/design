import { ArrowUp, Microphone, Plus } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";

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
  /** Fires with the full (untrimmed) text when the form submits, from Enter or the send button; whitespace-only text blocks the submit. The field is cleared after. */
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

const textClass: Record<ComposerSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/**
 * Figma `Composer` (63:462): a regular-glass pill with an attach button, the
 * message field, and a voice button that turns into the ink send button once
 * there is text.
 *
 * A real `form`, so Enter submits and the browser handles implicit submission; a value that is only
 * whitespace blocks the send and leaves the typed text in place. The last slot swaps between the voice
 * button (empty field) and the primary send button (`motion-swap`), and only the visible one is focusable.
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
  const value = valueProp ?? valueState;
  const setValue = (next: string) => {
    if (valueProp === undefined) setValueState(next);
    onValueChange?.(next);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value);
    setValue("");
  };
  const canSubmit = value.trim() !== "";
  return (
    <form
      onSubmit={submit}
      className={cn(
        "relative flex max-w-full min-w-0 items-center overflow-clip rounded-full motion-colors has-[input:focus-visible]:border-border-strong",
        "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-text-brand",
        surface === "glass" ? "veil-field" : "border border-border-default bg-bg-surface",
        sizeClass[size],
        className,
      )}
    >
      <IconButton
        type="button"
        size={size}
        icon={<Plus className="text-text-secondary" />}
        label="Attach"
        onClick={onAttach}
        disabled={disabled}
      />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
        className={cn(
          "relative min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder disabled:text-text-disabled",
          textClass[size],
        )}
      />
      <span className="motion-swap">
        <span data-hidden={!canSubmit || undefined} inert={!canSubmit}>
          <IconButton
            type="submit"
            size={size}
            variant="primary"
            icon={<ArrowUp />}
            label="Send"
            disabled={disabled}
            tabIndex={canSubmit ? undefined : -1}
          />
        </span>
        <span data-hidden={canSubmit || undefined} inert={canSubmit}>
          <IconButton
            type="button"
            size={size}
            icon={<Microphone className="text-text-secondary" />}
            label="Voice input"
            onClick={onVoice}
            disabled={disabled}
            tabIndex={canSubmit ? -1 : undefined}
          />
        </span>
      </span>
    </form>
  );
}
