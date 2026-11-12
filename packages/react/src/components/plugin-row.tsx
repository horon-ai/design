import { ArrowUp, Check, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";
import { Switch } from "./switch";

/**
 * Props for {@link PluginRow}. The row also forwards every other `div` prop (except `children`)
 * to the outer element, so `id`, `data-*` and DOM handlers work as usual.
 */
export type PluginRowProps = Omit<ComponentProps<"div">, "children"> & {
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

/**
 * Paper `Plugin row` (Settings 1VKS-0): tile, name with version and update pill, verified author, chips, and Update, Switch and overflow actions.
 *
 * Rows stack directly in a list: each one draws its own bottom divider and drops it on the last
 * child. The Update button collapses when `onUpdate` is missing, and the overflow menu only renders
 * when `menu` has content.
 *
 * @example
 * ```tsx
 * import { MenuItem, PluginRow } from "@horon-ai/react";
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
  ...props
}: PluginRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3.5 gap-y-3 border-b border-border-default py-4 last:border-b-0",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-500 text-label-md text-neutral-50"
      >
        {initials}
      </span>
      <span className="flex min-w-0 grow basis-40 flex-col gap-1.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className="min-w-0 truncate text-label-md text-text-primary">{name}</span>
          {version && <span className="shrink-0 font-mono text-label-sm text-text-secondary">{version}</span>}
          {updateBadge && (
            <span className="inline-flex h-5.5 shrink-0 items-center rounded-full bg-accent-sky-500-18 px-2 text-label-sm text-text-brand">
              {updateBadge}
            </span>
          )}
        </span>
        {author && (
          <span className="flex items-center gap-1 text-label-sm text-text-secondary">
            {author}
            {verified && (
              <span
                role="img"
                aria-label="Verified"
                className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-sky-500 text-neutral-50"
              >
                <Check aria-hidden weight="bold" className="size-2" />
              </span>
            )}
          </span>
        )}
        {chips && chips.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex h-5.5 items-center gap-1 rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-secondary [&_svg]:size-2.75"
              >
                {chip.icon}
                {chip.label}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className="flex shrink-0 flex-wrap items-center gap-2">
        <span className="motion-reveal-x" data-collapsed={!onUpdate || undefined} inert={!onUpdate || undefined}>
          <Button variant="solid" size="sm" icon={<ArrowUp aria-hidden className="size-3.5" />} onClick={onUpdate}>
            {updateLabel}
          </Button>
        </span>
        <Switch aria-label={toggleLabel} checked={enabled} onCheckedChange={onEnabledChange} />
        {menu && (
          <Menu>
            <MenuTrigger
              render={
                <IconButton
                  label={overflowLabel}
                  variant="ghost"
                  size="sm"
                  icon={<DotsThree aria-hidden weight="bold" />}
                />
              }
            />
            <MenuContent align="end">{menu}</MenuContent>
          </Menu>
        )}
      </span>
    </div>
  );
}
