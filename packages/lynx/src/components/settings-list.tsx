import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";
import { Switch, type SwitchProps } from "./switch";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties; id?: string };
};

/** A component's own prop set with `className` replaced by a plain optional string, exactly as react's `WithClass` did. */
type WithClass<T> = Omit<T, "className"> & {
  /** Classes merged onto the rendered element. */
  className?: string;
};

/**
 * Props for {@link SettingsList}. The `id` and `style` members land on the card,
 * as react forwarded its `div` props.
 */
export type SettingsListProps = WithClass<PortedElementProps["div"]> & {
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Classes merged onto the card. */
  className?: string;
  /** The rows; {@link SettingsRow} draws its own bottom divider. */
  children?: ReactNode;
};

/**
 * Paper `Settings list` (1VD8-0): a 16px-radius card of divided rows, 20px inline padding, solid or thick glass.
 *
 * Put only `SettingsRow` children inside: each row draws its own bottom divider, and the card clips
 * the corners, so grouping rows here is enough to get the divided list. Lynx has no `:last-child`, so
 * the final row takes `className="border-b-0"` itself. Glass keeps the rows above the liquid layer
 * because the card clips with `overflow-hidden` and every row is positioned.
 *
 * @example
 * ```tsx
 * import { SettingsList, SettingsRow, SettingsSwitch } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <SettingsList>
 *       <SettingsRow title="Sync on Wi-Fi" description="Only use Wi-Fi for uploads" control={<SettingsSwitch defaultChecked />} />
 *       <SettingsRow title="Version" control={<text className="text-label-md text-text-secondary">2.4.1</text>} className="border-b-0" />
 *     </SettingsList>
 *   );
 * }
 * ```
 */
export function SettingsList({ surface = "solid", className, children, style, id }: SettingsListProps) {
  return (
    <view
      className={cn(
        "relative flex min-w-0 flex-col overflow-hidden rounded-2xl px-5",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {surface === "glass" && <LiquidGlass />}
      {children}
    </view>
  );
}

/**
 * Props for {@link SettingsRow}. The `id` and `style` members land on the row, as
 * react forwarded its `div` props.
 */
export type SettingsRowProps = Omit<PortedElementProps["div"], "className" | "title"> & {
  /** Primary line of the row. */
  title: ReactNode;
  /** Secondary line under the title, in secondary text. */
  description?: ReactNode;
  /** Leading slot before the title, usually a {@link SettingsRowIcon}; the row tightens to 12px gap and 13px block padding. */
  leading?: ReactNode;
  /** Trailing control slot: a {@link SettingsSwitch}, a {@link SettingsKeys} pair, a button. */
  control?: ReactNode;
  /** Classes merged onto the row. */
  className?: string;
};

/** Text slots take a string so the row can put the type token on its own `<text>`; Lynx does not inherit type. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/**
 * One row: title and subtitle on the left, control on the right, 1px divider except on the last row.
 *
 * Lynx has no `:last-child`, so the last row of a list needs `className="border-b-0"`; the row is
 * positioned so it paints above a glass card's liquid layer.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsRow({
  title,
  description,
  leading,
  control,
  className,
  style,
  id,
}: SettingsRowProps) {
  return (
    <view
      className={cn(
        "relative flex min-w-0 flex-row flex-wrap items-center border-b border-border-default",
        leading ? "gap-x-3 gap-y-2 py-[13px]" : "gap-x-4 gap-y-2 py-4",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {leading}
      <view className="flex min-w-0 flex-1 flex-col gap-0.5">
        {isPlainText(title) ? (
          <text className="break-words text-label-md text-text-primary">{title}</text>
        ) : (
          title
        )}
        {description ? (
          isPlainText(description) ? (
            <text className="break-words text-body-sm text-text-secondary">{description}</text>
          ) : (
            description
          )
        ) : null}
      </view>
      {control ? <view className="relative flex shrink-0 flex-row items-center">{control}</view> : null}
    </view>
  );
}

/** React sized the tile's glyph through `[&_svg]:size-4`; a Lynx `<Icon>` takes the px number. */
const TILE_ICON_SIZE = 16;

/**
 * Paper settings row icon tile: 32px, 9px radius, subtle fill, 16px glyph centered. Decorative,
 * so it is hidden from assistive technology; the row title carries the meaning.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsRowIcon({ className, children, style, id }: Omit<PortedElementProps["div"], "className"> & { className?: string; children?: ReactNode }) {
  const glyph =
    isValidElement<IconProps>(children) && children.type === Icon ? cloneElement(children, { size: TILE_ICON_SIZE }) : children;

  return (
    <view
      accessibility-elements-hidden
      className={cn("flex size-8 shrink-0 flex-row items-center justify-center rounded-[9px] bg-bg-subtle", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {glyph}
    </view>
  );
}

/**
 * A `Switch` pre-wired for a row's control slot (md, 44x26).
 *
 * Part of {@link SettingsList}.
 */
export function SettingsSwitch(props: SwitchProps) {
  return <Switch size="md" {...props} />;
}

/**
 * One keycap: 26px high, 6px radius, subtle fill with a 1px hairline (replaces `Kbd` in settings rows).
 * Lynx has no `kbd` element, so it is a `view` announced as text; the caller reads it as keyboard input
 * from its row.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsKey({ className, children, style, id }: Omit<PortedElementProps["div"], "className"> & { className?: string; children?: ReactNode }) {
  return (
    <view
      className={cn(
        "flex h-[26px] shrink-0 flex-row items-center rounded-xs border border-border-default bg-bg-subtle px-2 font-sans",
        className,
      )}
      style={style}
      accessibility-element
      accessibility-role-description="text"
      {...(id === undefined ? {} : { id })}
    >
      <text className="text-trim text-label-sm text-text-primary">{children}</text>
    </view>
  );
}

/**
 * A keycap pair or chord, 4px apart; a plain row wrapper, so it takes its children as-is.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsKeys({ className, children, style, id }: Omit<PortedElementProps["div"], "className"> & { className?: string; children?: ReactNode }) {
  return (
    <view
      className={cn("flex flex-row items-center gap-1", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {children}
    </view>
  );
}
