import { ArrowUp, Microphone, Plus } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";

import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

export type ComposerProps = {
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

/**
 * Figma `Composer` (63:462): a regular-glass pill with an attach button, the
 * message field, and a voice button that turns into the ink send button once
 * there is text.
 */
export function Composer({
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
        "relative flex items-center gap-2 overflow-clip rounded-full border border-glass-rim-strong bg-glass-regular p-2 motion-colors",
        className,
      )}
    >
      <LiquidGlass tier="regular" />
      <IconButton type="button" icon={<Plus />} label="Attach" onClick={onAttach} disabled={disabled} />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
        className="relative min-w-0 flex-1 bg-transparent text-body-md text-text-primary outline-none placeholder:text-text-placeholder"
      />
      {value.trim() ? (
        <IconButton type="submit" variant="primary" icon={<ArrowUp />} label="Send" disabled={disabled} />
      ) : (
        <IconButton
          type="button"
          icon={<Microphone className="text-text-secondary" />}
          label="Voice input"
          onClick={onVoice}
          disabled={disabled}
        />
      )}
    </form>
  );
}
