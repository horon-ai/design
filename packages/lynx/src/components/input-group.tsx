import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";
import type { NodesRef } from "@lynx-js/types/background";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** The keyboard types a Lynx input understands, the `type` attribute set. */
type LynxInputType = "text" | "number" | "digit" | "password" | "tel" | "email";

/** The confirm key labels a Lynx input accepts. */
type LynxConfirmType = "send" | "search" | "go" | "done" | "next";

/** Height rung of the group and its segments: `sm` 32px, `md` 40px, `lg` 48px. */
export type InputGroupSize = ControlSize;

/** Props of {@link InputGroup}: the input's own props plus the segments around it. */
export type InputGroupProps = {
  /**
   * Segment before the input: `<Select variant="segment" />` or `<Combobox variant="segment" />`
   * for a choice such as a country code, or `<InputGroupSegment>` for fixed text.
   */
  prefix?: ReactNode;
  /** Segment after the input, such as a currency select. */
  suffix?: ReactNode;
  /** Height and text rung: 32/40/48px, matching a standalone `Input`. @default "md" */
  size?: InputGroupSize;
  /** Paints the danger border on the whole group and marks the input invalid. */
  invalid?: boolean;
  /** Solid (default) or glass, as on `Input`. @default "solid" */
  surface?: InputSurface;
  /**
   * Extra classes for the box that wraps the segments and the input. The members react takes from
   * `ComponentProps`, `"className"`, `"prefix"` and `"size"`, are explicit props here.
   */
  className?: string;
  /** Inline style, merged onto the box's own. */
  style?: CSSProperties;
  /** The text the caller owns; a change is written into the native editor with `setValue`. */
  value?: string;
  /** The text the field starts with when the caller does not own it. */
  defaultValue?: string;
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /** The kind of keyboard and text the field wants. @default text */
  type?: LynxInputType;
  /** Caps the text length. Lynx inputs default to 140 when this is omitted. */
  maxLength?: number;
  /** Confirm key label on the soft keyboard. */
  confirmType?: LynxConfirmType;
  /** Blocks editing of the input and dims the segments. @default false */
  disabled?: boolean;
  /** Keeps the text selectable and focusable but not editable. */
  readOnly?: boolean;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Called with the new text after every edit; a disabled or read-only group never calls it. */
  onChange?: (value: string) => void;
  /**
   * Called with the new text after every edit, the same moment as `onChange`. React's Base UI input
   * also reports why the value changed; a Lynx group only changes through its own `bindinput`, so the
   * second argument is always `{ reason: "input" }` and stays optional. A disabled or read-only group
   * never calls it.
   */
  onValueChange?: (value: string, eventDetails?: { reason: "input" }) => void;
  /** Called when the input takes focus; the group draws its focus ring on this. */
  onFocus?: () => void;
  /** Called when the input loses focus. */
  onBlur?: () => void;
  /** Called with the text when the soft keyboard's confirm key is pressed. */
  onConfirm?: (value: string) => void;
};

/** What a segment reads from the group it sits in. */
type InputGroupContextValue = {
  /** Height rung the group was given. */
  size: InputGroupSize;
  /** Whether the group is disabled, so segments can dim and drop their own interactivity. */
  disabled: boolean;
  /** Surface the group uses, so a segment and the box stay the same material. */
  surface: InputSurface;
};

/** Lets a segment (select, combobox or fixed text) take the group's size, disabled state and surface. */
const InputGroupContext = createContext<InputGroupContextValue | null>(null);

/**
 * The group a segment sits in, or null outside an `InputGroup`. `Select` and `Combobox` call it in their
 * `segment` variant to pick the right height, padding and disabled look without a prop of their own.
 *
 * @returns The `{ size, disabled, surface }` of the enclosing group, or `null` when there is none.
 */
export function useInputGroup() {
  return useContext(InputGroupContext);
}

const sizeClass: Record<InputGroupSize, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

/** The input's own padding, the same 12/14/20px as a standalone `Input`. */
const inputPaddingClass: Record<InputGroupSize, string> = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-5",
};

/**
 * The tinted segment look, shared by `InputGroupSegment` and the `segment` variant of `Select` and `Combobox`.
 *
 * Lynx text properties do not inherit, so the type rung is kept for parity and a segment's own text carries
 * the matching `text-*` class — the `Select`/`Combobox` segment variant already does.
 */
export const inputGroupSegmentClass: Record<InputGroupSize, string> = {
  sm: "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-sm text-text-primary",
  md: "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-md text-text-primary",
  lg: "relative flex h-full shrink-0 items-center gap-1.5 bg-overlay-ink-4 px-4 text-body-lg text-text-primary",
};

/** The ring Lynx draws where react draws its 2px offset outline. */
const FOCUS_RING = { boxShadow: "0 0 0 2px var(--color-text-brand)" };

/**
 * Lynx's engine paints the placeholder from this variable; react's `placeholder:text-…` utility cannot run, so
 * the variable is set as a custom property through the class list, which Lynx inherits to the placeholder.
 */
const PLACEHOLDER_CLASS = "[-x-placeholder-color:var(--color-text-placeholder)]";

/** The only part of a Lynx input event a field reads. */
type LynxTextEvent = { detail: { value: string } };

/** The change-event details a Lynx input reports: every edit comes from the field's own `bindinput`. */
const INPUT_CHANGE = { reason: "input" } as const;

/** Whether a slot is a bare string, which has to be placed inside a `<text>` to paint on Lynx. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Input group` (60:429): a glass or solid field split into a select segment and an input segment, in three sizes.
 *
 * One box drawn from `fieldBoxClass` holds the optional `prefix`, the input and the optional `suffix`, with a
 * 1px hairline between them; the hairlines turn danger-red with `invalid` and dim with the group's `disabled`.
 * The group renders its own input, so pass `placeholder`/`value`/`onChange` (and `onValueChange`, which
 * reports the same string with a change reason) as props rather than children. Size,
 * disabled state and surface go to the segments through the group context, which is why a `Select` or
 * `Combobox` with `variant="segment"` matches without extra props.
 *
 * @example
 * ```tsx
 * import { InputGroup, InputGroupSegment } from "@horon-ai/lynx";
 *
 * function Website() {
 *   return (
 *     <InputGroup
 *       prefix={<InputGroupSegment>https://</InputGroupSegment>}
 *       placeholder="horon.ai"
 *       size="md"
 *     />
 *   );
 * }
 * ```
 */
export function InputGroup({
  prefix,
  suffix,
  size = "md",
  invalid,
  surface = "solid",
  className,
  style,
  value,
  defaultValue,
  placeholder,
  type = "text",
  maxLength,
  confirmType,
  disabled = false,
  readOnly = false,
  id,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  onConfirm,
}: InputGroupProps) {
  const [focused, setFocused] = useState(false);
  const boxSurface =
    surface === "glass"
      ? cn(fieldBoxClass.glass, disabled && "opacity-60")
      : cn(fieldBoxClass[surface], disabled && "border-border-default bg-bg-subtle", invalid && "border-border-danger");
  const divider = cn(
    "relative h-full w-px shrink-0",
    invalid ? "bg-border-danger" : "bg-border-default",
    disabled && "opacity-60",
  );
  const node = useRef<NodesRef | null>(null);
  const context = useMemo(() => ({ size, disabled, surface }), [size, disabled, surface]);

  useEffect(() => {
    if (value === undefined) return;
    const element = node.current;
    if (!element) return;
    try {
      element.invoke({ method: "setValue", params: { value } }).exec();
    } catch {
      // The render-test element API has no native methods; the emitted value is what the test asserts.
    }
  }, [value]);

  const handleInput = (event: LynxTextEvent) => {
    if (disabled || readOnly) return;
    onChange?.(event.detail.value);
    onValueChange?.(event.detail.value, INPUT_CHANGE);
  };

  return (
    <InputGroupContext.Provider value={context}>
      <view
        className={cn(fieldBoxClass.base, sizeClass[size], boxSurface, className)}
        style={{ ...(focused ? FOCUS_RING : undefined), ...style }}
      >
        {prefix ? (
          <>
            {prefix}
            <view className={divider} accessibility-element={false} />
          </>
        ) : null}
        <view className={cn("relative flex h-full min-w-0 flex-1 items-center", inputPaddingClass[size])}>
          <input
            id={id}
            className={cn(
              fieldBoxClass.text,
              fieldTextClass[size],
              PLACEHOLDER_CLASS,
              disabled && "text-text-disabled",
            )}
            default-value={defaultValue}
            placeholder={placeholder}
            type={type}
            maxlength={maxLength}
            confirm-type={confirmType}
            disabled={disabled}
            readonly={readOnly}
            ref={node}
            bindinput={handleInput}
            bindfocus={() => {
              setFocused(true);
              onFocus?.();
            }}
            bindblur={() => {
              setFocused(false);
              onBlur?.();
            }}
            bindconfirm={(event: LynxTextEvent) => {
              if (disabled || readOnly) return;
              onConfirm?.(event.detail.value);
            }}
          />
        </view>
        {suffix ? (
          <>
            <view className={divider} accessibility-element={false} />
            {suffix}
          </>
        ) : null}
      </view>
    </InputGroupContext.Provider>
  );
}

/** Props of {@link InputGroupSegment}: its content and extra classes. */
type InputGroupSegmentProps = {
  /** Extra classes for the segment. */
  className?: string;
  /** Segment content: short text, or text plus an icon sized by the segment's rung. */
  children: ReactNode;
};

/**
 * Part of {@link InputGroup}. A fixed-text segment, such as a unit or a `https://` prefix. Takes the group's
 * size (falling back to `md` outside a group), sits on the 4% ink tint, and dims when the group is disabled.
 *
 * A bare string child is placed in a `<text>` with the rung's type classes, because Lynx does not paint text
 * outside a text element and does not inherit font properties from the segment view.
 */
export function InputGroupSegment({ className, children }: InputGroupSegmentProps) {
  const group = useInputGroup();
  const size = group?.size ?? "md";
  return (
    <view className={cn(inputGroupSegmentClass[size], group?.disabled && "opacity-60", className)}>
      {isPlainText(children) ? (
        <text className={cn(fieldTextClass[size], "text-text-primary")}>{children}</text>
      ) : (
        children
      )}
    </view>
  );
}
