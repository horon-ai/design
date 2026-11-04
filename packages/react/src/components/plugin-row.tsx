import { ArrowUp, Check, DotsThree } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";
import { Switch } from "./switch";

export type PluginRowProps = Omit<ComponentProps<"div">, "children"> & {
  /** Two-letter initials shown on the 40px tile. */
  initials: string;
  name: ReactNode;
  version?: ReactNode;
  /** Text of the update pill next to the version; omit when up to date. */
  updateBadge?: ReactNode;
  author?: ReactNode;
  verified?: boolean;
  /** Capability chips, each with an optional 11px icon. */
  chips?: { id: string; label: ReactNode; icon?: ReactNode }[];
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /** Shows the Update button when set. */
  onUpdate?: () => void;
  updateLabel?: string;
  toggleLabel?: string;
  overflowLabel?: string;
  /** Items of the overflow menu; the menu button is hidden without them. */
  menu?: ReactNode;
};

/** Paper `Plugin row` (Settings 1VKS-0): tile, name with version and update pill, verified author, chips, and Update, Switch and overflow actions. */
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
      className={cn("flex items-center gap-3.5 border-b border-border-default py-4 last:border-b-0", className)}
      {...props}
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-500 text-label-md text-neutral-50"
      >
        {initials}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex items-center gap-2">
          <span className="truncate text-label-md text-text-primary">{name}</span>
          {version && <span className="shrink-0 font-mono text-label-sm text-text-placeholder">{version}</span>}
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
      <span className="flex shrink-0 items-center gap-2">
        {onUpdate && (
          <Button size="sm" icon={<ArrowUp aria-hidden className="size-3.5" />} onClick={onUpdate}>
            {updateLabel}
          </Button>
        )}
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
