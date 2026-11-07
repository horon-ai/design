import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";

/** The open state {@link Dialog} publishes to the parts below it. */
type DialogSet = {
  /** Whether the surface is mounted. */
  open: boolean;
  /** Asks the root to show or hide the surface; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
};

const DialogContext = createContext<DialogSet>({ open: false, setOpen: () => undefined });

/** Props of {@link Dialog}: the controlled or uncontrolled open state plus the parts it wraps. */
export type DialogProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on every trigger, close or scrim press. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger and content that make up the dialog. */
  children?: ReactNode;
};

/**
 * State holder for a dialog: give it `open` / `onOpenChange` to control it, or neither plus a
 * `defaultOpen` to leave it uncontrolled. It renders nothing itself; the parts below supply the surface.
 *
 * Lynx has no Base UI, so the root owns the state itself and publishes it through a context; the parts
 * read it and call `setOpen`. A controlled root never moves its own state — it only reports through
 * `onOpenChange`, exactly like react's `Dialog.Root`.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger>Rename bot</DialogTrigger>
 *   <DialogContent
 *     title="Rename bot"
 *     description="The new name shows up everywhere the bot is mentioned."
 *   >
 *     <DialogFooter>
 *       <DialogClose>Cancel</DialogClose>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export function Dialog({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

/**
 * Props of {@link DialogTrigger} and {@link DialogClose}: either their own pressable surface with
 * `children`, or an existing element passed through `render`.
 */
type DialogPressProps = {
  /**
   * An element to carry the press behaviour (react's `render` prop). Lynx cannot swap elements, so the
   * element is cloned with the `bindtap` handler and its own children instead of being replaced.
   */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Extra classes on the built-in pressable surface. */
  className?: string;
};

/** Clones a caller's element with the press handler, or wraps the children in a bare pressable view. */
function DialogPress({ render, children, className, onTap }: DialogPressProps & { onTap: () => void }) {
  if (render && isValidElement(render)) {
    // React's `render` prop kept the trigger's children on the rendered element;
    // cloneElement does the same here, so `<Trigger render={<Button />}>Save</Trigger>`
    // still paints "Save" inside the caller's button. A host element takes the Lynx
    // event (`bindtap`); a Horon component takes `onClick` and routes it itself.
    const press = typeof render.type === "string" ? { bindtap: onTap } : { onClick: onTap };
    const merged = children === undefined ? press : { ...press, children };
    return cloneElement(render, merged);
  }
  return (
    <view className={className} bindtap={onTap} accessibility-element accessibility-traits="button">
      {children}
    </view>
  );
}

/**
 * The control that opens the dialog. It takes `render` to put the press behaviour on your own button;
 * on Lynx the element is cloned with the handler instead of being re-rendered through Base UI.
 */
export function DialogTrigger({ render, children, className }: DialogPressProps) {
  const { setOpen } = useContext(DialogContext);
  return <DialogPress render={render} className={className} onTap={() => setOpen(true)}>{children}</DialogPress>;
}

/**
 * The control that closes the dialog: it sets the dialog's open state to false, so a controlled dialog
 * also sees `onOpenChange`.
 */
export function DialogClose({ render, children, className }: DialogPressProps) {
  const { setOpen } = useContext(DialogContext);
  return <DialogPress render={render} className={className} onTap={() => setOpen(false)}>{children}</DialogPress>;
}

/**
 * The React element this port replaces: React took Base UI's popup attributes,
 * Lynx has no popup element, so the surface is a `view` and this alias names the
 * mapping explicitly instead of leaving it implied.
 */
type PortedPopupProps = { className?: string; title?: ReactNode; children?: ReactNode };

/**
 * Props for {@link DialogContent}: the heading, description and surface choices.
 *
 * React took Base UI's popup attributes; Lynx has no popup element, so the members that mattered are
 * spelled out here with the same names and defaults, and `children` is the body.
 */
export type DialogContentProps = Omit<PortedPopupProps, "className" | "title"> & {
  /** Heading rendered as the popup's `title-md` title, which also names the dialog for assistive tech. */
  title: ReactNode;
  /** Optional `body-md` secondary paragraph under the title, wired to the popup's description. */
  description?: ReactNode;
  /** Label for the close button; hides it when `null`. @default "Close" */
  closeLabel?: string | null;
  /**
   * Element id put on the close control. React exposed this as `data-slot`, which a DOM query can select;
   * Lynx has no attribute selectors, so the value becomes the control's `id` and is addressable with
   * `lynx.createSelectorQuery().select("#<closeSlot>")`.
   */
  closeSlot?: string;
  /** Tile or icon set before the title (Paper settings modals). */
  leading?: ReactNode;
  /**
   * `glass` is the veil dialog (`veil-overlay`). `solid` is the Paper workspace modal:
   * opaque default fill, 20px radius, 24px padding and a 0 24 64 shadow, no glass layer.
   * Both surfaces share the 16px block rhythm between title, description and actions.
   * @default "solid"
   */
  surface?: "glass" | "solid";
  /** Extra classes on the popup panel, merged after the surface, radius and motion classes. */
  className?: string;
  /** The body under the description. */
  children?: ReactNode;
};

/** Text slots take a string so the component can put the token classes on a `<text>`. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/**
 * Figma `Dialog on scrim` (63:329): the `bg-scrim` ink at 32% alpha and a 420px veil dialog,
 * 24px padding, title-md heading with a 32px close target, body-md description.
 *
 * Part of {@link Dialog}. Lynx has no portal, so the scrim and the centred panel are `position: fixed`
 * views rendered in place over the caller's content — the same layering react reached with a portal,
 * without the stacking-context escape. The scrim keeps react's 32% ink alpha as a separate fill view
 * (`bg-scrim` with `opacity-[0.32]`) because Lynx token colours are CSS variables and Tailwind's
 * `/<alpha>` modifier cannot split them. The panel caps at the viewport minus 32px and scrolls its own
 * body; the header stays visible instead of scrolling with it. Base UI's focus trap, Escape handling
 * and scroll lock have no Lynx equivalent, so a press on the scrim and the close control are the two
 * ways out, plus whatever the caller wires to `open`.
 */
export function DialogContent({
  title,
  description,
  closeLabel = "Close",
  closeSlot,
  leading,
  surface = "solid",
  className,
  children,
}: DialogContentProps) {
  const { open, setOpen } = useContext(DialogContext);
  if (!open) return null;

  const solid = surface === "solid";

  return (
    <view className="fixed inset-0 z-50 flex flex-row items-center justify-center px-4">
      {/* The scrim: its own fill view so the 32% alpha does not dim the panel. */}
      <view
        className="absolute inset-0 bg-bg-scrim opacity-[0.32]"
        bindtap={() => setOpen(false)}
        accessibility-element={false}
      />
      <view
        className={cn(
          // 420px where it fits; the viewport's 16px gutters cap `w-full` below that.
          "relative flex max-h-[calc(100vh-2rem)] w-full max-w-[420px] flex-col overflow-hidden rounded-xl motion-rise",
          solid ? "bg-bg-surface shadow-[0_24px_64px_#0A142433]" : "veil-overlay",
          className,
        )}
        // The panel swallows the press so a tap inside never reaches the scrim behind it.
        catchtap={() => undefined}
      >
        {/* React scrolled the whole popup (`overflow-y-auto`), so the header scrolls with the
         * body here too. Lynx's `<scroll-view>` lays its own children out linearly, so the panel
         * stays a flex `view` and the scroll view wraps one flex column. */}
        <scroll-view
          scroll-orientation="vertical"
          scroll-bar-enable={false}
          className="relative w-full"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          <view className="flex w-full flex-col items-start gap-4 p-6">
            <view className={cn("relative flex w-full flex-row items-start", leading ? "gap-3.5" : "gap-2")}>
              {leading}
              <view className="min-w-0 flex-1">
                {isPlainText(title) ? (
                  <text className="text-title-md text-text-primary" accessibility-traits="header">
                    {title}
                  </text>
                ) : (
                  title
                )}
              </view>
              {closeLabel !== null && (
                <view
                  className="relative -mt-1 -mr-2 flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary motion-press motion-colors active:bg-overlay-ink-6"
                  bindtap={() => setOpen(false)}
                  hit-slop="6px"
                  accessibility-element
                  accessibility-traits="button"
                  accessibility-label={closeLabel}
                  {...(closeSlot === undefined ? {} : { id: closeSlot })}
                >
                  <Icon name="X" size={16} color="text-secondary" />
                </view>
              )}
            </view>
            {description ? (
              <view className="relative w-full">
                {isPlainText(description) ? (
                  <text className="text-body-md text-text-secondary">{description}</text>
                ) : (
                  description
                )}
              </view>
            ) : null}
            <view className="relative flex w-full flex-col">{children}</view>
          </view>
        </scroll-view>
      </view>
    </view>
  );
}

/** Props of {@link DialogFooter}: the row itself plus extra classes. */
export type DialogFooterProps = {
  /** Extra classes on the row, merged after the alignment and gap classes. */
  className?: string;
  /** The actions, secondary first and the primary last. */
  children?: ReactNode;
};

/**
 * The action row: secondary first, the primary action at the right edge, 8px apart.
 * `w-full` is what right-aligns it — the dialog popup stacks children at their content width.
 *
 * Part of {@link Dialog}. Renders a plain view, so it can also close a `BottomSheet` body with the same rhythm.
 */
export function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <view className={cn("relative flex w-full flex-row flex-wrap items-center justify-end gap-2", className)}>
      {children}
    </view>
  );
}
