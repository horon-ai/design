import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";
import { Switch, type SwitchProps } from "./switch";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export type SettingsListProps = WithClass<ComponentProps<"div">> & {
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. */
  surface?: "solid" | "glass";
};

/** Paper `Settings list` (1VD8-0): a 16px-radius card of divided rows, 20px inline padding, solid or thick glass. */
export function SettingsList({ surface = "solid", className, children, ...props }: SettingsListProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-clip rounded-2xl px-5 [&>:not(.liquid-layers)]:relative",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      {children}
    </div>
  );
}

export type SettingsRowProps = Omit<ComponentProps<"div">, "className" | "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Leading slot before the title, usually a `SettingsRowIcon`; the row tightens to 12px gap and 13px block padding. */
  leading?: ReactNode;
  /** Trailing control slot: a `Switch`, a `SettingsKeys` pair, a button. */
  control?: ReactNode;
  className?: string;
};

/** One row: title and subtitle on the left, control on the right, 1px divider except on the last row. */
export function SettingsRow({ title, description, leading, control, className, ...props }: SettingsRowProps) {
  return (
    <div
      className={cn(
        "flex items-center border-b border-border-default last:border-b-0",
        leading ? "gap-3 py-[13px]" : "gap-4 py-4",
        className,
      )}
      {...props}
    >
      {leading}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-label-md text-text-primary">{title}</span>
        {description && <span className="text-body-sm text-text-secondary">{description}</span>}
      </div>
      {control && <div className="flex shrink-0 items-center">{control}</div>}
    </div>
  );
}

/** Paper settings row icon tile: 32px, 9px radius, subtle fill, 16px glyph centered. */
export function SettingsRowIcon({ className, ...props }: WithClass<ComponentProps<"span">>) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-bg-subtle text-text-primary [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/** A `Switch` pre-wired for a row's control slot (md, 44x26). */
export function SettingsSwitch(props: SwitchProps) {
  return <Switch size="md" {...props} />;
}

/** One keycap: 26px high, 6px radius, subtle fill with a 1px hairline (replaces `Kbd` in settings rows). */
export function SettingsKey({ className, children, ...props }: WithClass<ComponentProps<"kbd">>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6.5 items-center rounded-xs border border-border-default bg-bg-subtle px-2 font-sans text-label-sm text-text-primary",
        className,
      )}
      {...props}
    >
      <span className="text-trim">{children}</span>
    </kbd>
  );
}

/** A keycap pair or chord, 4px apart. */
export function SettingsKeys({ className, ...props }: WithClass<ComponentProps<"span">>) {
  return <span className={cn("inline-flex items-center gap-1", className)} {...props} />;
}
