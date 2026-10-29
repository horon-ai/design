import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Switch, type SwitchProps } from "./switch";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Paper `Settings list` (1VD8-0): a 16px-radius thick-glass card of divided rows, 20px inline padding. */
export function SettingsList({ className, ...props }: WithClass<ComponentProps<"div">>) {
  return <div className={cn("flex flex-col overflow-clip rounded-2xl bg-glass-thick px-5", className)} {...props} />;
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
        {description && <span className="text-[13px]/[18px] text-text-secondary">{description}</span>}
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

/** One keycap: 26px high, 6px radius, neutral-50 fill with a 1px hairline (replaces `Kbd` in settings rows). */
export function SettingsKey({ className, ...props }: WithClass<ComponentProps<"kbd">>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6.5 items-center rounded-[6px] border border-border-default bg-neutral-50 px-2 font-sans text-[12px]/[16px] font-medium text-text-primary dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

/** A keycap pair or chord, 4px apart. */
export function SettingsKeys({ className, ...props }: WithClass<ComponentProps<"span">>) {
  return <span className={cn("inline-flex items-center gap-1", className)} {...props} />;
}
