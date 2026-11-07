import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

/**
 * State holder for a dialog: give it `open` / `onOpenChange` to control it, or neither plus a
 * `defaultOpen` to leave it uncontrolled. It renders nothing itself; the parts below supply the surface.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger render={<Button />}>Rename bot</DialogTrigger>
 *   <DialogContent
 *     title="Rename bot"
 *     description="The new name shows up everywhere the bot is mentioned."
 *   >
 *     <Input defaultValue="Weekly digest" aria-label="Bot name" />
 *     <DialogFooter>
 *       <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
 *       <Button onClick={() => setOpen(false)}>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog = BaseDialog.Root;

/** The control that opens the dialog. It takes `render` to put the press behaviour on your own button. */
export const DialogTrigger = BaseDialog.Trigger;

/** The control that closes the dialog: it sets the dialog's open state to false, so a controlled dialog also sees `onOpenChange`. */
export const DialogClose = BaseDialog.Close;

/** Props for {@link DialogContent}: the Base UI popup attributes plus the heading, description and surface choices. */
export type DialogContentProps = Omit<ComponentProps<typeof BaseDialog.Popup>, "className" | "title"> & {
  /** Heading rendered as the popup's `title-md` title, which also names the dialog for assistive tech. */
  title: ReactNode;
  /** Optional `body-md` secondary paragraph under the title, wired to the popup's description. */
  description?: ReactNode;
  /** Label for the close button; hides it when `null`. @default "Close" */
  closeLabel?: string | null;
  /** Slot marker on the close control, for a surface its own app selects the control by. */
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
};

/**
 * Figma `Dialog on scrim` (63:329): a 40% scrim and a 420px veil dialog,
 * 24px padding, title-md heading with a 32px close target, body-md description.
 *
 * Part of {@link Dialog}. Portals to the body over a 6px-blurred scrim and centres through a fixed viewport
 * with 16px gutters, so on a narrow screen the panel keeps its padding and shrinks to the gutters instead;
 * the panel caps at `100dvh - 32px` and scrolls its own content. Base UI owns the focus trap, Escape to
 * close and the scroll lock.
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
  ...props
}: DialogContentProps) {
  const solid = surface === "solid";
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
      <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <BaseDialog.Popup
          className={cn(
            // 420px where it fits; the viewport's 16px gutters cap `w-full` below that.
            "relative flex max-h-[calc(100dvh-2rem)] w-full max-w-105 flex-col items-start gap-4 overflow-y-auto overscroll-contain rounded-xl p-6 outline-none",
            solid ? "bg-bg-surface shadow-[0_24px_64px_#0A142433]" : "veil-overlay",
            "motion-popup duration-240 data-starting-style:translate-y-2",
            className,
          )}
          {...props}
        >
          <div className={cn("relative flex w-full items-start", leading ? "gap-3.5" : "gap-2")}>
            {leading}
            <BaseDialog.Title className="min-w-0 flex-1 text-title-md text-text-primary">{title}</BaseDialog.Title>
            {closeLabel !== null && (
              <BaseDialog.Close
                aria-label={closeLabel}
                data-slot={closeSlot}
                className="relative -mt-1 -mr-2 flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary motion-colors hover:bg-overlay-ink-6 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand [&_svg]:size-4"
              >
                <X />
              </BaseDialog.Close>
            )}
          </div>
          {description && (
            <BaseDialog.Description className="relative text-body-md text-text-secondary">
              {description}
            </BaseDialog.Description>
          )}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

/**
 * The action row: secondary first, the primary action at the right edge, 8px apart.
 * `w-full` is what right-aligns it — the dialog popup stacks children at their content width.
 *
 * Part of {@link Dialog}. Renders a plain `div`, so it can also close a `BottomSheet` body with the same rhythm.
 */
export function DialogFooter({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & {
  /** Extra classes on the row, merged after the alignment and gap classes. */
  className?: string;
}) {
  return <div className={cn("relative flex w-full flex-wrap items-center justify-end gap-2", className)} {...props} />;
}
