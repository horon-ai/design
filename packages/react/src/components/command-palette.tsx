import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { useDevice } from "../hooks/use-device";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/** Close control shape for pointers that never reach a key: a 28px icon tile instead of the esc chip. */
const touchCloseClass =
  "flex size-7 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary hover:bg-overlay-ink-6 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand [&_svg]:size-4";

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
  /** Element rendered inside the dialog root as the opener, usually a `DialogTrigger`. */
  trigger?: ReactNode;
  /**
   * `solid` (default) is an opaque palette with a default border. `glass` puts it on the veil (`veil-overlay`).
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Extra classes on the popup, merged after the surface, radius and motion classes. */
  className?: string;
};

/**
 * Figma `Command palette` (110:676): a 560px palette, 24px radius, with a 48px search row,
 * grouped 44px results and a key-hint footer.
 *
 * A Base UI dialog on a 32% scrim with a 6px blur, anchored to the top of the viewport 96px down rather
 * than centred. It always renders {@link CommandPaletteBody} with its own close control — an `esc` chip on
 * devices that show keyboard hints, a 28px `X` tile on touch — and every row select reports
 * `onOpenChange(false)`. Row hints and the footer hints disappear on those touch devices too. The body
 * owns filtering and keyboard movement.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <CommandPalette
 *   open={open}
 *   onOpenChange={setOpen}
 *   trigger={<DialogTrigger render={<Button variant="solid" />}>Search</DialogTrigger>}
 *   groups={[
 *     {
 *       label: "Bots",
 *       items: [
 *         { value: "weekly", label: "Weekly digest", meta: "Product", hint: <Kbd>↵</Kbd> },
 *         { value: "inbox", label: "Inbox triage", meta: "Ops" },
 *       ],
 *     },
 *   ]}
 *   hints={[
 *     ["↑↓", "Move"],
 *     ["↵", "Open"],
 *   ]}
 * />
 * ```
 */
export function CommandPalette({
  open,
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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center px-2 pt-24">
          <Dialog.Popup
            aria-label={placeholder}
            className={cn(
              // 560px where it fits; the viewport's 8px gutters cap `w-full` below that.
              "relative flex w-full max-w-140 motion-popup flex-col overflow-clip rounded-xl p-1.5",
              surface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-palette",
              "duration-240 data-starting-style:translate-y-2",
              className,
            )}
          >
            <CommandPaletteBody
              groups={groups}
              placeholder={placeholder}
              empty={empty}
              closeControl={
                <Dialog.Close
                  aria-label="Close"
                  className={keyboardHints ? "motion-press cursor-pointer" : touchCloseClass}
                >
                  {keyboardHints ? <Kbd keys="Escape" /> : <X aria-hidden />}
                </Dialog.Close>
              }
              onSelect={() => onOpenChange?.(false)}
            />
            {keyboardHints && hints && hints.length > 0 && (
              <div className="relative flex flex-wrap items-center gap-x-4 gap-y-1 px-3 pt-2 pb-1">
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
  /** A ready close control; the dialog passes its own `Dialog.Close` so uncontrolled palettes still close. */
  closeControl?: ReactNode;
  /** Makes the fallback `esc` button close the palette; without both this and `closeControl` no button renders. */
  onClose?: () => void;
  /** Called after a row's own `onSelect`, so the host can close its dialog. */
  onSelect?: () => void;
};

/**
 * The search row, groups and result rows of a command palette.
 *
 * Part of {@link CommandPalette}. Renders a Base UI `Autocomplete` that is always open and inline: the
 * query filters on label plus keywords (case-insensitive), the first row is highlighted as soon as the
 * list renders, and arrow keys move through the rows while Enter picks the highlighted one. Escape is left
 * to the host's close control, which is why this part owns no dialog state.
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
  return (
    <Autocomplete.Root
      open
      inline
      items={groups}
      itemToStringValue={(item: CommandItem) => `${item.label} ${item.keywords ?? ""}`}
      autoHighlight="always"
      keepHighlight
    >
      <div className="relative flex h-12 items-center gap-2.5 px-3">
        <span className="flex size-7 shrink-0 items-center justify-center">
          <MagnifyingGlass aria-hidden className="size-5 text-text-secondary" />
        </span>
        <Autocomplete.Input
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
        />
        {closeControl ??
          (onClose === undefined ? null : (
            <button
              type="button"
              aria-label={closeLabel}
              className={keyboardHints ? "motion-press cursor-pointer" : touchCloseClass}
              onClick={onClose}
            >
              {keyboardHints ? <Kbd keys="Escape" /> : <X aria-hidden />}
            </button>
          ))}
      </div>
      <div className="relative pt-1">
        <div className="h-px bg-overlay-ink-8" />
      </div>
      <Autocomplete.Empty className="relative px-3 py-4 text-body-sm text-text-secondary empty:hidden">
        {empty}
      </Autocomplete.Empty>
      <Autocomplete.List className="relative flex max-h-[min(60dvh,24rem)] flex-col overflow-y-auto">
        {(group: CommandGroup) => (
          <Autocomplete.Group key={group.label} items={group.items} className="flex flex-col pt-1">
            <Autocomplete.GroupLabel className="px-3 pt-1 pb-1 text-caption text-text-secondary">
              {group.label}
            </Autocomplete.GroupLabel>
            <Autocomplete.Collection>
              {(item: CommandItem) => (
                <Autocomplete.Item
                  key={item.value}
                  value={item}
                  onClick={() => {
                    item.onSelect?.();
                    onSelect?.();
                  }}
                  className="flex h-11 cursor-pointer items-center gap-2.5 rounded-md px-3 motion-colors outline-none select-none data-highlighted:bg-overlay-ink-6"
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
                  {keyboardHints && item.hint}
                </Autocomplete.Item>
              )}
            </Autocomplete.Collection>
          </Autocomplete.Group>
        )}
      </Autocomplete.List>
    </Autocomplete.Root>
  );
}
