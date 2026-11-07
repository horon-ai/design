import { Input as BaseInput } from "@base-ui/react/input";
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldTextClass, type InputSurface } from "./input";

/** Height rung of the group and its segments: `sm` 32px, `md` 40px, `lg` 48px. */
export type InputGroupSize = ControlSize;

/** Props of {@link InputGroup}: the input's own props plus the segments around it. */
export type InputGroupProps = Omit<ComponentProps<typeof BaseInput>, "className" | "prefix" | "size"> & {
  /**
   * Segment before the input: `<Select variant="segment" />` or `<Combobox variant="segment" />`
   * for a choice such as a country code, or `<InputGroupSegment>` for fixed text.
   */
  prefix?: ReactNode;
  /** Segment after the input, such as a currency select. */
  suffix?: ReactNode;
  /** Height and text rung: 32/40/48px, matching a standalone `Input`. @default "md" */
  size?: InputGroupSize;
  /** Paints the danger border on the whole group and marks the input `aria-invalid`. */
  invalid?: boolean;
  /** Solid (default) or glass, as on `Input`. @default "solid" */
  surface?: InputSurface;
  /** Extra classes for the box that wraps the segments and the input. */
  className?: string;
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

/** The tinted segment look, shared by `InputGroupSegment` and the `segment` variant of `Select` and `Combobox`. */
export const inputGroupSegmentClass: Record<InputGroupSize, string> = {
  sm: "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-sm text-text-primary [&_svg]:size-4 [&_svg]:text-text-secondary",
  md: "relative flex h-full shrink-0 items-center gap-1 bg-overlay-ink-4 px-3 text-body-md text-text-primary [&_svg]:size-4 [&_svg]:text-text-secondary",
  lg: "relative flex h-full shrink-0 items-center gap-1.5 bg-overlay-ink-4 px-4 text-body-lg text-text-primary [&_svg]:size-5 [&_svg]:text-text-secondary",
};

const divider =
  "relative h-full w-px shrink-0 bg-border-default group-data-invalid:bg-border-danger group-data-disabled:bg-border-default/60";

/**
 * Figma `Input group` (60:429): a glass or solid field split into a select segment and an input segment, in three sizes.
 *
 * One box drawn from `fieldBoxClass` holds the optional `prefix`, the input and the optional `suffix`, with a
 * 1px hairline between them; the hairlines turn danger-red with `invalid` and dim with the group's `disabled`.
 * The group renders its own Base UI input, so pass `placeholder`/`value`/`onChange` as props rather than
 * children. Size, disabled state and surface go to the segments through `InputGroupContext`, which is why a
 * `Select` or `Combobox` with `variant="segment"` matches without extra props.
 *
 * @example
 * ```tsx
 * import { InputGroup, InputGroupSegment } from "@horon-ai/react";
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
  disabled = false,
  ...props
}: InputGroupProps) {
  const context = useMemo(() => ({ size, disabled, surface }), [size, disabled, surface]);
  return (
    <InputGroupContext value={context}>
      <div
        className={cn(fieldBoxClass.base, "group", sizeClass[size], fieldBoxClass[surface], className)}
        data-invalid={invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
      >
        {prefix && (
          <>
            {prefix}
            <span aria-hidden className={divider} />
          </>
        )}
        <div className={cn("relative flex h-full min-w-0 flex-1 items-center", inputPaddingClass[size])}>
          <BaseInput
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={cn(fieldBoxClass.text, fieldTextClass[size])}
            {...props}
          />
        </div>
        {suffix && (
          <>
            <span aria-hidden className={divider} />
            {suffix}
          </>
        )}
      </div>
    </InputGroupContext>
  );
}

/**
 * Part of {@link InputGroup}. A fixed-text segment, such as a unit or a `https://` prefix. Takes the group's
 * size (falling back to `md` outside a group), sits on the 4% ink tint, and dims its text when the group is
 * disabled.
 */
// prettier-ignore
export function InputGroupSegment({ className, children }: {
  /** Extra classes for the segment. */
  className?: string;
  /** Segment content: short text, or text plus an icon sized by the segment's rung. */
  children: ReactNode;
}) {
  const group = useInputGroup();
  return (
    <div
      className={cn(inputGroupSegmentClass[group?.size ?? "md"], "group-data-disabled:text-text-disabled", className)}
    >
      {children}
    </div>
  );
}
