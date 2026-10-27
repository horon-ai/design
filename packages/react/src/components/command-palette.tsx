import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Kbd } from "./kbd";
import { LiquidGlass } from "./liquid-glass";

export type CommandItem = {
  value: string;
  label: string;
  /** 28px leading tile: an initial or a 16px icon. */
  tile?: ReactNode;
  /** Tile fill class, such as "bg-sky-500"; defaults to the primary tile. */
  tileClassName?: string;
  /** Caption after the label, such as the workspace. */
  meta?: ReactNode;
  /** Right-side hint, usually `<Kbd>`. */
  hint?: ReactNode;
  onSelect?: () => void;
};

export type CommandGroup = { label: string; items: CommandItem[] };

export type CommandPaletteProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups: CommandGroup[];
  placeholder?: string;
  /** Footer key hints, such as `[["↑↓", "Move"], ["↵", "Open"]]`. */
  hints?: [ReactNode, string][];
  trigger?: ReactNode;
  className?: string;
};

/**
 * Figma `Command palette` (110:676): a 560px frosted-glass dialog, 24px radius,
 * with a 48px search row, grouped 44px results and a key-hint footer.
 */
export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = "Search",
  hints,
  trigger,
  className,
}: CommandPaletteProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-bg-scrim motion-fade opacity-40" />
        <Dialog.Viewport className="fixed inset-0 flex items-start justify-center px-2 pt-24">
          <Dialog.Popup
            aria-label={placeholder}
            className={cn(
              "relative flex w-140 motion-popup flex-col overflow-clip rounded-[24px] bg-glass-fill-frost p-1.5 shadow-palette",
              "duration-240 data-starting-style:translate-y-2",
              className,
            )}
          >
            <LiquidGlass tier="thick" />
            <Autocomplete.Root open inline items={groups} autoHighlight="always" keepHighlight>
              <div className="relative flex h-12 items-center gap-2.5 px-3.5">
                <MagnifyingGlass aria-hidden className="size-5 shrink-0 text-text-secondary" />
                <Autocomplete.Input
                  placeholder={placeholder}
                  className="min-w-0 flex-1 bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
                />
                <Dialog.Close render={<Kbd className="motion-press cursor-pointer" />}>esc</Dialog.Close>
              </div>
              <div className="relative pt-1 pb-1.5">
                <div className="h-px bg-overlay-ink-8" />
              </div>
              <Autocomplete.Empty className="relative px-3 py-4 text-body-sm text-text-secondary">
                No results
              </Autocomplete.Empty>
              <Autocomplete.List className="relative flex max-h-[min(60dvh,24rem)] flex-col overflow-y-auto">
                {(group: CommandGroup) => (
                  <Autocomplete.Group key={group.label} items={group.items} className="flex flex-col">
                    <Autocomplete.GroupLabel className="px-3 pt-2 pb-1 text-caption text-text-secondary">
                      {group.label}
                    </Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {(item: CommandItem) => (
                        <Autocomplete.Item
                          key={item.value}
                          value={item}
                          onClick={() => {
                            item.onSelect?.();
                            onOpenChange?.(false);
                          }}
                          className="flex h-11 cursor-pointer items-center gap-2.5 rounded-md pr-3 pl-2.5 motion-colors outline-none select-none data-highlighted:bg-overlay-ink-6"
                        >
                          {item.tile && (
                            <span
                              className={cn(
                                "flex size-7 shrink-0 items-center justify-center rounded-sm text-label-sm [&>svg]:size-4",
                                item.tileClassName ?? "bg-interactive-primary text-interactive-on-primary",
                              )}
                            >
                              {item.tile}
                            </span>
                          )}
                          <span className="truncate text-label-md text-text-primary">{item.label}</span>
                          {item.meta && <span className="shrink-0 text-caption text-text-secondary">{item.meta}</span>}
                          <span className="flex-1" />
                          {item.hint}
                        </Autocomplete.Item>
                      )}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                )}
              </Autocomplete.List>
            </Autocomplete.Root>
            {hints && hints.length > 0 && (
              <div className="relative flex items-center gap-3.5 px-3 pt-2.5 pb-1.5">
                {hints.map(([key, label]) => (
                  <span key={label} className="flex items-center gap-1.5 text-caption text-text-secondary">
                    <Kbd>{key}</Kbd>
                    {label}
                  </span>
                ))}
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
