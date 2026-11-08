import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";
import { Switch } from "./switch";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the entry
 * lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

/** Text slots take a string so the token classes can sit on a `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** Props for {@link PluginRow}. The row's remaining `div` props reduce to `style` on Lynx, which has no DOM element to forward them to. */
export type PluginRowProps = PortedElementProps["div"] & {
  /** Two-letter initials shown on the 40px tile. */
  initials: string;
  /** Plugin name; truncated when the row gets narrow. */
  name: ReactNode;
  /** Version string drawn in mono next to the name. */
  version?: ReactNode;
  /** Text of the update pill next to the version; omit when up to date. */
  updateBadge?: ReactNode;
  /** Author line under the name. */
  author?: ReactNode;
  /** Adds the sky "Verified" check after the author; only shown when `author` is set. */
  verified?: boolean;
  /** Capability chips, each with an optional 11px icon. */
  chips?: {
    /** Stable key for the chip. */
    id: string;
    /** Chip text. */
    label: ReactNode;
    /** Optional leading glyph, sized 11px. */
    icon?: ReactNode;
  }[];
  /** Switch state for the plugin. Pass it with `onEnabledChange` to control the toggle. */
  enabled?: boolean;
  /** Fires with the next switch state when the plugin is enabled or disabled. */
  onEnabledChange?: (enabled: boolean) => void;
  /** Shows the Update button when set; without it the button stays collapsed. */
  onUpdate?: () => void;
  /**
   * Label of the Update button.
   * @default "Update"
   */
  updateLabel?: string;
  /**
   * Accessible name of the enable/disable switch.
   * @default "Enabled"
   */
  toggleLabel?: string;
  /**
   * Accessible name of the overflow menu button.
   * @default "More"
   */
  overflowLabel?: string;
  /** Items of the overflow menu; the menu button is hidden without them. */
  menu?: ReactNode;
};

/** React sized a chip glyph through `[&_svg]:size-2.75`; `<Icon>` takes the px number. */
const CHIP_ICON_SIZE = 11;

/**
 * Paper `Plugin row` (Settings 1VKS-0): tile, name with version and update pill, verified author, chips, and Update, Switch and overflow actions.
 *
 * Rows stack directly in a list: each draws a bottom border, and the last one of a list takes
 * `className="border-b-0"` because Lynx has no `:last-child`. The Update button only exists when
 * `onUpdate` is set, and the overflow menu only renders when `menu` has content. React collapsed the
 * Update button with `motion-reveal-x` on `data-collapsed`; Lynx does not match `data-*` attributes in
 * its stylesheet, so the button is rendered or omitted instead of sliding closed.
 *
 * @example
 * ```tsx
 * import { MenuItem, PluginRow } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <PluginRow
 *       initials="ST"
 *       name="Stripe"
 *       version="2.4.1"
 *       updateBadge="Update ready"
 *       author="Stripe"
 *       verified
 *       chips={[{ id: "payments", label: "Payments" }]}
 *       enabled
 *       onEnabledChange={() => {}}
 *       onUpdate={() => {}}
 *       menu={<MenuItem>Uninstall</MenuItem>}
 *     />
 *   );
 * }
 * ```
 */
export function PluginRow({
  initials,
  name,
  version,
  updateBadge,
  author,
  verified,
  chips,
  enabled,
  onEnabledChange,
  onUpdate,
  updateLabel = "Update",
  toggleLabel = "Enabled",
  overflowLabel = "More",
  menu,
  className,
  style,
}: PluginRowProps) {
  return (
    <view
      className={cn(
        "flex flex-row flex-wrap items-center gap-x-3.5 gap-y-3 border-b border-border-default py-4",
        className,
      )}
      style={style}
    >
      <view className="flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px] bg-sky-500">
        <text className="text-label-md text-neutral-50">{initials}</text>
      </view>
      <view className="flex min-w-0 grow basis-40 flex-col gap-1.5">
        <view className="flex flex-row flex-wrap items-center gap-2">
          <text className="min-w-0 truncate text-label-md text-text-primary">{name}</text>
          {version ? <text className="shrink-0 font-mono text-label-sm text-text-secondary">{version}</text> : null}
          {updateBadge ? (
            <view className="flex h-[22px] shrink-0 flex-row items-center rounded-full bg-accent-sky-500-18 px-2">
              <text className="text-label-sm text-text-brand">{updateBadge}</text>
            </view>
          ) : null}
        </view>
        {author ? (
          <view className="flex flex-row items-center gap-1">
            {isPlainText(author) ? <text className="text-label-sm text-text-secondary">{author}</text> : author}
            {verified ? (
              <view
                className="flex size-3.5 shrink-0 flex-row items-center justify-center rounded-full bg-sky-500"
                accessibility-element
                accessibility-label="Verified"
                accessibility-role-description="image"
              >
                <Icon name="Check" size={8} weight="bold" color="interactive-on-primary" />
              </view>
            ) : null}
          </view>
        ) : null}
        {chips && chips.length > 0 ? (
          <view className="flex flex-row flex-wrap gap-1.5">
            {chips.map((chip) => (
              <view
                key={chip.id}
                className="flex h-[22px] flex-row items-center gap-1 rounded-full bg-overlay-ink-6 px-2"
              >
                {chip.icon
                  ? isValidElement<IconProps>(chip.icon) && chip.icon.type === Icon
                    ? cloneElement(chip.icon, { size: CHIP_ICON_SIZE, color: "text-secondary" })
                    : chip.icon
                  : null}
                <text className="text-label-sm text-text-secondary">{chip.label}</text>
              </view>
            ))}
          </view>
        ) : null}
      </view>
      <view className="flex shrink-0 flex-row flex-wrap items-center gap-2">
        {onUpdate ? (
          <Button variant="solid" size="sm" icon={<Icon name="ArrowUp" />} onClick={onUpdate}>
            {updateLabel}
          </Button>
        ) : null}
        <Switch aria-label={toggleLabel} checked={enabled} onCheckedChange={onEnabledChange} />
        {menu ? (
          <Menu>
            <MenuTrigger>
              <IconButton
                label={overflowLabel}
                variant="ghost"
                size="sm"
                icon={<Icon name="DotsThree" weight="bold" />}
              />
            </MenuTrigger>
            <MenuContent align="end">{menu}</MenuContent>
          </Menu>
        ) : null}
      </view>
    </view>
  );
}
