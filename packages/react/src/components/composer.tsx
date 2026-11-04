import { ArrowUp, Microphone, Plus } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { IconButton } from "./icon-button";

export type ComposerSize = ControlSize;
export type ComposerSurface = "solid" | "glass";

export type ComposerProps = {
  size?: ComposerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. */
  surface?: ComposerSurface;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onAttach?: () => void;
  onVoice?: () => void;
  disabled?: boolean;
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
  return (
    <form
      onSubmit={submit}
      className={cn(
        "relative flex items-center overflow-clip rounded-full motion-colors",
        surface === "glass" ? "veil-field" : "border border-border-default bg-bg-surface",
        sizeClass[size],
        className,
      )}
    >
      <IconButton type="button" size={size} icon={<Plus />} label="Attach" onClick={onAttach} disabled={disabled} />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
        className={cn(
          "relative min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder",
          textClass[size],
        )}
      />
      {value.trim() ? (
        <IconButton
          key="send"
          type="submit"
          size={size}
          variant="primary"
          icon={<ArrowUp />}
          label="Send"
          disabled={disabled}
          className="animate-pop-in"
        />
      ) : (
        <IconButton
          key="voice"
          type="button"
          size={size}
          className="animate-pop-in"
          icon={<Microphone className="text-text-secondary" />}
          label="Voice input"
          onClick={onVoice}
          disabled={disabled}
        />
      )}
    </form>
  );
}
