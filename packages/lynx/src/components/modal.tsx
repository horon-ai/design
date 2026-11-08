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
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";

/**
 * Width step of the modal popup.
 *
 * - `sm` — 400px, for a short form.
 * - `md` — 560px, the default reading width.
 * - `lg` — 720px, for a wide editor or table.
 */
export type ModalSize = "sm" | "md" | "lg";

/**
 * Surface of the modal popup.
 *
 * - `solid` — the opaque page fill with a `0 24 64` shadow.
 * - `glass` — the `veil-overlay` material, for a modal that floats over content.
 */
export type ModalSurface = "solid" | "glass";

/** The open state {@link Modal} publishes to the parts below it. */
type ModalSet = {
  /** Whether the popup is mounted. */
  open: boolean;
  /** Asks the root to show or hide the popup; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
};

const ModalContext = createContext<ModalSet>({ open: false, setOpen: () => undefined });

/** Props of {@link Modal}: the controlled or uncontrolled open state plus the parts it wraps. */
export type ModalProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on every trigger, close or scrim press. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger and content that make up the modal. */
  children?: ReactNode;
};

/**
 * Root of a modal; owns open state. It accepts `open`, `defaultOpen` and `onOpenChange`, the same
 * names Base UI's `Dialog.Root` took, and keeps the same controlled/uncontrolled split.
 *
 * Lynx has no Base UI, so the root owns the state and publishes it through a context. The `modal`
 * flag Base UI also accepted has no Lynx equivalent — there is no focus trap to make non-modal.
 */
export function Modal({ open: openProp, defaultOpen = false, onOpenChange, children }: ModalProps) {
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

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/** Props shared by {@link ModalTrigger} and {@link ModalClose}. */
type ModalPressProps = {
  /**
   * An element to carry the press behaviour (react's `render` prop). Lynx cannot swap elements, so the
   * element is cloned with the `bindtap` handler instead of being replaced.
   */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Extra classes on the built-in pressable surface. */
  className?: string;
};

/** Clones a caller's element with the press handler, or wraps the children in a bare pressable view. */
function ModalPress({ render, children, className, onTap }: ModalPressProps & { onTap: () => void }) {
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
 * The element that opens the modal. Use `render` to make an existing button the trigger; on Lynx the
 * element is cloned with the handler, because there is no Base UI to forward the press through.
 *
 * Part of {@link ModalContent}.
 */
export function ModalTrigger({ render, children, className }: ModalPressProps) {
  const { setOpen } = useContext(ModalContext);
  return (
    <ModalPress render={render} className={className} onTap={() => setOpen(true)}>
      {children}
    </ModalPress>
  );
}

/**
 * A button that closes the modal when pressed. Any `Button`-like element can be its child.
 *
 * Part of {@link ModalContent}. Focus returns to the trigger in react through Base UI's focus
 * management; Lynx has no focus API, so the press only closes.
 */
export function ModalClose({ render, children, className }: ModalPressProps) {
  const { setOpen } = useContext(ModalContext);
  return (
    <ModalPress render={render} className={className} onTap={() => setOpen(false)}>
      {children}
    </ModalPress>
  );
}

/**
 * The React element this port replaces: React took Base UI's popup attributes,
 * Lynx has no popup element, so the surface is a `view` and this alias names the
 * mapping explicitly instead of leaving it implied.
 */
type PortedPopupProps = { className?: string; title?: ReactNode; children?: ReactNode };

/** Props for {@link ModalContent}: title and description, the size and surface, and an optional footer. */
export type ModalContentProps = Omit<PortedPopupProps, "className" | "title"> & {
  /** Modal heading, rendered as the popup's title. */
  title: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  /** Width: `sm` 400px, `md` 560px (default), `lg` 720px. Never wider than the viewport minus 32px.
   * @default "md" */
  size?: ModalSize;
  /** `solid` (default) is the opaque page fill with a 0 24 64 shadow; `glass` is the veil (`veil-overlay`).
   * @default "solid" */
  surface?: ModalSurface;
  /** Tile or icon before the title. */
  leading?: ReactNode;
  /** Label for the close button; hides it when `null`.
   * @default "Close" */
  closeLabel?: string | null;
  /** `ModalFooter`, kept below the scrolling body. */
  footer?: ReactNode;
  /** Extra classes on the popup, merged after the built-in ones. */
  className?: string;
  /** Inline style, merged onto the popup's own. */
  style?: CSSProperties;
  /** The body between the header and the footer. */
  children?: ReactNode;
};

const widthClass: Record<ModalSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
};

/** Text slots take a string so the component can put the token classes on a `<text>`. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * A modal for work that needs a form or a longer read, where `Dialog` is a short confirmation. It has three
 * fixed parts: a header (title, description and close), a body that scrolls on its own once the modal reaches
 * the viewport height, and a footer whose actions sit at the right. 24px padding, 20px radius, 32% scrim.
 *
 * Lynx has no portal, so the scrim and the centred panel are `position: fixed` views rendered in place.
 * Only the body scrolls: the header and footer stay put, which on Lynx means the body is its own
 * `<scroll-view>`. The scrim keeps react's 32% ink alpha as a separate fill view, because a token colour
 * is a CSS variable and Tailwind's `/<alpha>` modifier cannot split it. Base UI's focus trap and Escape
 * handling have no Lynx equivalent; the close control and a press on the scrim are the ways out.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <ModalTrigger>Rename workspace</ModalTrigger>
 *   <ModalContent
 *     title="Rename workspace"
 *     description="This changes the name for every member."
 *     footer={
 *       <ModalFooter>
 *         <ModalClose>Cancel</ModalClose>
 *       </ModalFooter>
 *     }
 *   >
 *     <text className="text-body-md text-text-primary">Body</text>
 *   </ModalContent>
 * </Modal>
 * ```
 */
export function ModalContent({
  title,
  description,
  size = "md",
  surface = "solid",
  leading,
  closeLabel = "Close",
  footer,
  className,
  style,
  children,
}: ModalContentProps) {
  const { open, setOpen } = useContext(ModalContext);
  if (!open) return null;

  return (
    <view className="fixed inset-0 z-50 flex flex-row items-center justify-center p-4">
      <view
        className="absolute inset-0 bg-bg-scrim opacity-[0.32]"
        bindtap={() => setOpen(false)}
        accessibility-element={false}
      />
      <view
        className={cn(
          // The 16px viewport padding caps `w-full`, so the popup never exceeds
          // the screen even on the narrowest phone.
          "motion-rise relative flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-xl",
          widthClass[size],
          surface === "solid" ? "bg-bg-surface shadow-[0_24px_64px_#0A142433]" : "veil-overlay",
          className,
        )}
        style={style}
        catchtap={() => undefined}
      >
        <view className={cn("flex shrink-0 flex-row items-start px-6 pb-4 pt-6", leading ? "gap-3.5" : "gap-2")}>
          {leading}
          <view className="flex min-w-0 flex-1 flex-col gap-1">
            {isPlainText(title) ? (
              <text className="text-title-md text-text-primary" accessibility-traits="header">
                {title}
              </text>
            ) : (
              title
            )}
            {description ? (
              isPlainText(description) ? (
                <text className="text-body-md text-text-secondary">{description}</text>
              ) : (
                description
              )
            ) : null}
          </view>
          {closeLabel !== null && (
            <view
              className="motion-press motion-colors -mr-2 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary active:bg-overlay-ink-6"
              bindtap={() => setOpen(false)}
              hit-slop="6px"
              accessibility-element
              accessibility-traits="button"
              accessibility-label={closeLabel}
            >
              <Icon name="X" size={16} color="text-secondary" />
            </view>
          )}
        </view>
        {/* Only the body scrolls, so the scroll view owns the leftover height and the
         * header and footer stay put. Lynx's `<scroll-view>` is its own linear layout,
         * so the flex sizing is explicit on a wrapper instead of on the scroll view. */}
        <view className="flex min-h-0 flex-1 flex-col">
          <scroll-view
            scroll-orientation="vertical"
            scroll-bar-enable={false}
            style={{ flex: "1 1 0%", minHeight: "0px", width: "100%" }}
          >
            <view className={cn("px-6 text-body-md text-text-primary", footer ? "pb-2" : "pb-6")}>{children}</view>
          </scroll-view>
        </view>
        {footer}
      </view>
    </view>
  );
}

/** Props of {@link ModalFooter}: the row itself plus extra classes. */
export type ModalFooterProps = {
  /** Extra classes on the element, merged after the built-in ones. */
  className?: string;
  /** The actions, secondary first and the primary last. */
  children?: ReactNode;
};

/** The modal's action row: actions at the right, secondary first and primary last, 8px apart, 24px padding. */
export function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <view className={cn("flex shrink-0 flex-row items-center justify-end gap-2 px-6 pb-6 pt-4", className)}>
      {children}
    </view>
  );
}
