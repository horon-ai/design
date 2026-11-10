import { useState, type ReactNode } from "@lynx-js/react";

import { useDevice } from "../hooks/use-device";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/** Close control shape for pointers that never reach a key: a 28px icon tile instead of the esc chip. */
const touchCloseClass =
  "flex size-7 shrink-0 flex-row items-center justify-center rounded-full text-text-secondary active:bg-overlay-ink-6";

/** One selectable row of the palette. */
export type CommandItem = {
  /** Stable identity and the React key of the row; keep it unique across the palette. */
  value: string;
  /** Row text; the query also matches it, together with `keywords`. */
  label: string;
  /** Extra search terms that are not shown, such as an abbreviation or a path. */
  keywords?: string;
  /** 28px leading tile: an initial or a 16px icon. */
  tile?: ReactNode;
  /** Tile fill class, such as "bg-sky-500"; defaults to the primary tile. */
  tileClassName?: string;
  /** Caption after the label, such as the workspace. */
  meta?: ReactNode;
  /** Right-side hint, usually `<Kbd>`; hidden when the device shows no keyboard hints. */
  hint?: ReactNode;
  /** Runs when the row is clicked, before the palette closes itself. */
  onSelect?: () => void;
};

/** A titled block of rows; groups are rendered in the order given. */
export type CommandGroup = {
  /** Section heading, `caption` secondary text above the rows. */
  label: string;
  /** Rows of this section. */
  items: CommandItem[];
};

/** Props for {@link CommandPalette}: the dialog state, the grouped rows and the footer hints. */
export type CommandPaletteProps = {
  /** Controlled open state; leave it out to let the palette open from its `trigger`. */
  open?: boolean;
  /** Called with the next open state when the palette opens, closes on Escape, closes on select or its backdrop is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** Sections of rows, in render order. */
  groups: CommandGroup[];
  /** Search field placeholder; it also names the dialog (`aria-label`). @default "Search" */
  placeholder?: string;
  /** Shown when the query has no matches; defaults to "No results". */
  empty?: ReactNode;
  /** Footer key hints, such as `[["↑↓", "Move"], ["↵", "Open"]]`; hidden when the device shows no keyboard hints. */
  hints?: [ReactNode, string][];
  /** Opener content, rendered inside a pressable view that opens the palette; a `Button` or a label works. */
  trigger?: ReactNode;
  /**
   * `solid` (default) is an opaque palette with a default border. `glass` puts it on the veil (`veil-overlay`).
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Extra classes on the popup, merged after the surface, radius and motion classes. */
  className?: string;
};

/** Lynx's engine paints the placeholder from this variable; react's `placeholder:` utility cannot run. */
const PLACEHOLDER_CLASS = "[-x-placeholder-color:var(--color-text-secondary)]";

const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Command palette` (110:676): a 560px palette, 24px radius, with a 48px search row,
 * grouped 44px results and a key-hint footer.
 *
 * React ran a Base UI dialog on a 32% scrim with a 6px blur, anchored to the top of the viewport 96px
 * down. Lynx has no reachable backdrop filter and no portal, so the scrim is a `position: fixed` fill
 * view without the blur and the panel sits 96px from the top of the same fixed layer. It always renders
 * {@link CommandPaletteBody} with its own close control — an `esc` chip on devices that show keyboard
 * hints, a 28px `X` tile on touch — and every row select reports `onOpenChange(false)`. Row hints and
 * the footer hints disappear on those touch devices too. The body owns filtering; keyboard movement is
 * not available on Lynx, so rows are tapped. `trigger` is rendered inside one pressable view, because
 * Lynx cannot attach a handler to an arbitrary element.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { CommandPalette, Kbd } from "@horon-ai/lynx";
 *
 * function Palette() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <CommandPalette
 *       open={open}
 *       onOpenChange={setOpen}
 *       trigger={<text>Search</text>}
 *       groups={[
 *         {
 *           label: "Bots",
 *           items: [
 *             { value: "weekly", label: "Weekly digest", meta: "Product", hint: <Kbd>↵</Kbd> },
 *             { value: "inbox", label: "Inbox triage", meta: "Ops" },
 *           ],
 *         },
 *       ]}
 *       hints={[
 *         ["↑↓", "Move"],
 *         ["↵", "Open"],
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function CommandPalette({
  open: openProp,
  onOpenChange,
  groups,
  placeholder = "Search",
  empty,
  hints,
  trigger,
  surface = "solid",
  className,
}: CommandPaletteProps) {
  const { keyboardHints } = useDevice();
  const [innerOpen, setInnerOpen] = useState(false);
  const open = openProp ?? innerOpen;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  // React's `trigger` was a Base UI `DialogTrigger` that carried the press itself. Lynx has no element
  // swapping and no way to add a handler to an arbitrary element, so the trigger renders inside one
  // pressable view that opens the palette.
  const openPalette = () => setOpen(true);
  const triggerNode =
    trigger === undefined || trigger === null ? null : (
      <view className="relative" bindtap={openPalette} accessibility-element accessibility-traits="button">
        {trigger}
      </view>
    );

  const closeControl = (
    <view
      className={keyboardHints ? "motion-press" : touchCloseClass}
      bindtap={() => setOpen(false)}
      accessibility-element
      accessibility-traits="button"
      accessibility-label="Close"
    >
      {keyboardHints ? <Kbd keys="Escape" /> : <Icon name="X" size={16} color="text-secondary" />}
    </view>
  );

  return (
    <>
      {triggerNode}
      {open ? (
        <view className="fixed inset-0 z-50 flex flex-col items-center px-2" style={{ paddingTop: 96 }}>
          <view
            className="absolute inset-0 bg-bg-scrim opacity-[0.32]"
            bindtap={() => setOpen(false)}
            accessibility-element={false}
          />
          <view
            className={cn(
              // 560px where it fits; the viewport's 8px gutters cap `w-full` below that.
              "motion-popup relative flex w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] p-1.5",
              surface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-palette",
              className,
            )}
            catchtap={() => undefined}
            accessibility-element
            accessibility-label={placeholder}
          >
            <CommandPaletteBody
              groups={groups}
              placeholder={placeholder}
              empty={empty}
              closeControl={closeControl}
              onSelect={() => setOpen(false)}
            />
            {keyboardHints && hints && hints.length > 0 ? (
              <view className="relative flex flex-row flex-wrap items-center gap-x-4 gap-y-1 px-3 pb-1 pt-2">
                {hints.map(([key, label]) => (
                  <view key={label} className="flex flex-row items-center gap-1.5">
                    <Kbd>{key}</Kbd>
                    <text className="text-caption text-text-secondary">{label}</text>
                  </view>
                ))}
              </view>
            ) : null}
          </view>
        </view>
      ) : null}
    </>
  );
}

/** Props for {@link CommandPaletteBody}: the rows plus the close control and the select callback the host owns. */
export type CommandPaletteBodyProps = {
  /** Sections of rows, in render order. */
  groups: CommandGroup[];
  /** Search field placeholder. @default "Search" */
  placeholder?: string;
  /** Shown when the query has no matches. @default "No results" */
  empty?: ReactNode;
  /** Accessible name of the fallback `esc` button, used when no `closeControl` is passed. @default "Close" */
  closeLabel?: string;
  /** A ready close control; the dialog passes its own close control so uncontrolled palettes still close. */
  closeControl?: ReactNode;
  /** Makes the fallback `esc` button close the palette; without both this and `closeControl` no button renders. */
  onClose?: () => void;
  /** Called after a row's own `onSelect`, so the host can close its dialog. */
  onSelect?: () => void;
};

/**
 * The search row, groups and result rows of a command palette.
 *
 * Part of {@link CommandPalette}. React wrapped a Base UI `Autocomplete` that is always open and inline,
 * with arrow keys moving a highlight; Lynx has no keyboard focus model, so the same tree is a plain
 * `view` list: the query filters on label plus keywords (case-insensitive) and the rows are tapped. This
 * part owns no dialog state, which is why its close control and `onSelect` come from the host.
 */
export function CommandPaletteBody({
  groups,
  placeholder = "Search",
  empty = "No results",
  closeLabel = "Close",
  closeControl,
  onClose,
  onSelect,
}: CommandPaletteBodyProps) {
  const { keyboardHints } = useDevice();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const visible = groups
    .map((group) => ({
      label: group.label,
      items: needle
        ? group.items.filter((item) =>
            [item.label, item.keywords ?? ""].some((text) => text.toLowerCase().includes(needle)),
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  const matches = visible.reduce((total, group) => total + group.items.length, 0);

  return (
    <view className="relative flex flex-col">
      <view className="relative flex h-12 flex-row items-center gap-2.5 px-3">
        <view className="flex size-7 shrink-0 flex-row items-center justify-center">
          <Icon name="MagnifyingGlass" size={20} color="text-secondary" />
        </view>
        <input
          className={cn("min-w-0 flex-1 bg-transparent text-body-sm text-text-primary", PLACEHOLDER_CLASS)}
          placeholder={placeholder}
          bindinput={(event: { detail: { value: string } }) => setQuery(event.detail.value)}
        />
        {closeControl ??
          (onClose === undefined ? null : (
            <view
              className={keyboardHints ? "motion-press" : touchCloseClass}
              bindtap={onClose}
              accessibility-element
              accessibility-traits="button"
              accessibility-label={closeLabel}
            >
              {keyboardHints ? <Kbd keys="Escape" /> : <Icon name="X" size={16} color="text-secondary" />}
            </view>
          ))}
      </view>
      <view className="relative pt-1">
        <view className="h-px bg-overlay-ink-8" />
      </view>
      {matches === 0 ? (
        <view className="relative px-3 py-4">
          {isPlainText(empty) ? <text className="text-body-sm text-text-secondary">{empty}</text> : empty}
        </view>
      ) : (
        <scroll-view scroll-orientation="vertical" scroll-bar-enable={false} style={{ maxHeight: "384px" }}>
          <view className="relative flex flex-col">
            {visible.map((group) => (
              <view key={group.label} className="flex flex-col pt-1">
                <view className="px-3 pb-1 pt-1">
                  <text className="text-caption text-text-secondary">{group.label}</text>
                </view>
                {group.items.map((item) => (
                  <view
                    key={item.value}
                    className="motion-colors relative flex h-11 flex-row items-center gap-2.5 rounded-md px-3 active:bg-overlay-ink-6"
                    bindtap={() => {
                      item.onSelect?.();
                      onSelect?.();
                    }}
                    accessibility-element
                    accessibility-traits="button"
                    accessibility-label={item.label}
                  >
                    {item.tile ? (
                      <view
                        className={cn(
                          "flex size-7 shrink-0 flex-row items-center justify-center overflow-hidden rounded-sm",
                          item.tileClassName ?? "bg-interactive-primary",
                        )}
                      >
                        {isPlainText(item.tile) ? (
                          <text className="text-label-sm text-interactive-on-primary">{item.tile}</text>
                        ) : (
                          item.tile
                        )}
                      </view>
                    ) : null}
                    <text className="truncate text-label-md text-text-primary">{item.label}</text>
                    {item.meta ? (
                      <view className="shrink-0">
                        {isPlainText(item.meta) ? (
                          <text className="text-caption text-text-secondary">{item.meta}</text>
                        ) : (
                          item.meta
                        )}
                      </view>
                    ) : null}
                    <view className="flex-1" />
                    {keyboardHints && item.hint ? (
                      <view className="flex shrink-0 flex-row items-center">{item.hint}</view>
                    ) : null}
                  </view>
                ))}
              </view>
            ))}
          </view>
        </scroll-view>
      )}
    </view>
  );
}
