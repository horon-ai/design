import { Button as BaseButton } from "@base-ui/react/button";
import { Children, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ButtonVariant = "primary" | "glass" | "solid" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonCommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon; sized 16px (sm, md) or 20px (lg) and colored like the label. */
  icon?: ReactNode;
  className?: string;
};

/** Anchor attributes a button element does not have; they only reach the DOM when `href` is set. */
type ButtonAnchorProps = Pick<ComponentProps<"a">, "href" | "target" | "rel" | "download">;

/**
 * One flat prop type rather than a union of button props and anchor props: a caller that forwards the
 * component's props (`Omit<ComponentProps<typeof Button>, "variant" | "size">`) needs a single object
 * type. `keyof` of a union is only the keys both branches share, so `type` vanished there and the
 * caller's `type="button"` failed to type-check.
 *
 * `href` still switches the render to a real anchor, and the anchor drops everything a button-only prop
 * means there: `type`, `disabled`, `name`, `value`, the `form*` family and Base UI's own props. They stay
 * assignable while `href` is set — forbidding them needs the two-branch union that caused the bug — but
 * they never reach the DOM, where `<a disabled>` would render as an inert attribute.
 */
export type ButtonProps = ButtonCommonProps & ButtonAnchorProps & Omit<ComponentProps<typeof BaseButton>, "className">;

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-label-md [&_svg]:size-4",
  md: "h-10 gap-2 px-4 text-label-lg [&_svg]:size-4",
  lg: "h-12 gap-2 px-5 text-label-lg [&_svg]:size-5",
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-interactive-primary text-interactive-on-primary hover:not-data-disabled:bg-interactive-primary-hover active:not-data-disabled:bg-interactive-primary-pressed",
  glass:
    "bg-glass-clear text-text-primary hover:not-data-disabled:bg-glass-clear-hover active:not-data-disabled:bg-glass-clear-pressed",
  solid:
    "border border-border-default bg-bg-surface text-text-primary hover:not-data-disabled:bg-bg-subtle active:not-data-disabled:bg-interactive-secondary-hover",
  danger:
    "bg-interactive-danger text-interactive-on-danger hover:not-data-disabled:bg-interactive-danger-hover active:not-data-disabled:bg-interactive-danger",
  link: "h-auto gap-1.5 rounded-sm px-1 text-label-sm text-text-secondary motion-colors hover:not-data-disabled:text-text-primary aria-[current=page]:text-text-primary aria-[current=true]:text-text-primary [&_svg]:size-3.5",
};

/** Figma `Button` (55:339): Primary, Glass, Solid and Danger in three sizes, plus a text-only `link` variant (size-independent). */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  href,
  target,
  rel,
  download,
  ...props
}: ButtonProps) {
  const classes = cn(
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none",
    variant === "link" ? "" : "motion-press rounded-full",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
    variant !== "link" && sizeClass[size],
    // Paper's small buttons are 32px tall. Paint the 44px reach without moving the control;
    // the reach is an invisible box, so it never needs clipping.
    variant !== "link" &&
      size !== "lg" &&
      "relative after:absolute after:top-1/2 after:left-1/2 after:min-h-11 after:min-w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
    variantClass[variant],
    className,
  );

  // Preflight makes every `svg` a block box, so an icon passed as a child (rather than through `icon`)
  // started a second line and the label clipped. Element children get a row at the button's own gap.
  // Text-only labels keep the exact single-span markup they had, so their `text-trim` centring is intact.
  const hasElementChild = Children.toArray(children).some(
    (child) => typeof child !== "string" && typeof child !== "number",
  );

  const content = (
    <>
      {variant === "glass" && <LiquidGlass />}
      {icon && <span className="relative flex shrink-0">{icon}</span>}
      <span
        className={cn(
          "relative",
          variant !== "link" && "text-trim",
          hasElementChild && "inline-flex items-center gap-[inherit]",
        )}
      >
        {children}
      </span>
    </>
  );

  if (href !== undefined) {
    // An anchor takes none of the button-only attributes, and React would write them to the DOM where
    // they do nothing (`<a disabled>` is inert). They stop here. `type` is a button type in this prop
    // type, not an anchor MIME type, so it stops too, as do Base UI's own props.
    const {
      type: _type,
      style,
      render: _render,
      nativeButton: _native,
      focusableWhenDisabled: _focus,
      disabled: _disabled,
      form: _form,
      formAction: _formAction,
      formEncType: _formEncType,
      formMethod: _formMethod,
      formNoValidate: _formNoValidate,
      formTarget: _formTarget,
      name: _name,
      value: _value,
      ...anchorProps
    } = props;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        download={download}
        style={typeof style === "function" ? undefined : style}
        className={classes}
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- what is left is anchor attributes; Base UI types them against `<button>`
        {...(anchorProps as Omit<ComponentProps<"a">, "className" | "href">)}
      >
        {content}
      </a>
    );
  }

  return (
    <BaseButton className={classes} {...props}>
      {content}
    </BaseButton>
  );
}
