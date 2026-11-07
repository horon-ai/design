import { Toast as BaseToast } from "@base-ui/react/toast";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/**
 * Toast severity, which picks the leading icon and its color: `neutral` (info icon, secondary
 * text), `success` (check, brand color) or `danger` (warning, danger color). Any other Base UI
 * toast type falls back to `neutral`.
 */
export type ToastTone = "neutral" | "success" | "danger";

/** Toast rungs: `sm` 320px, `md` 360px and `lg` 400px wide cards. */
export type ToastSize = ControlSize;

const toneIcon: Record<ToastTone, ReactNode> = {
  neutral: <Info className="text-text-secondary" />,
  success: <CheckCircle className="text-text-brand" />,
  danger: <WarningCircle className="text-text-danger" />,
};

const sizeClass: Record<ToastSize, string> = {
  sm: "w-full max-w-80 gap-2 px-3 py-2.5",
  md: "w-full max-w-90 gap-3 px-4 py-3.5",
  lg: "w-full max-w-100 gap-3.5 px-5 py-4",
};

const iconSizeClass: Record<ToastSize, string> = {
  sm: "[&_svg]:size-4",
  md: "[&_svg]:size-5",
  lg: "[&_svg]:size-6",
};

const titleSizeClass: Record<ToastSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const descriptionSizeClass: Record<ToastSize, string> = {
  sm: "text-body-sm",
  md: "text-body-sm",
  lg: "text-body-md",
};

const contentGapClass: Record<ToastSize, string> = {
  sm: "gap-0.5",
  md: "gap-0.5",
  lg: "gap-1",
};

const closeSizeClass: Record<ToastSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

function isTone(value: string | undefined): value is ToastTone {
  return value === "neutral" || value === "success" || value === "danger";
}

/** Renders the live toast queue; each toast is a Base UI root positioned by the provider's viewport. */
// prettier-ignore
function ToastList({ size, surface }: {
  /** Card rung applied to every toast in the stack. */
  size: ToastSize;
  /** `glass` paints each card on the veil; `solid` gives it a surface fill, a border and the popover shadow. */
  surface: "solid" | "glass";
}) {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => {
    const tone = isTone(toast.type) ? toast.type : "neutral";
    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        className={cn(
          "relative mt-3 flex h-[var(--toast-height)] items-start overflow-clip rounded-lg data-ending-style:mt-0 data-ending-style:h-0",
          surface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-popover",
          sizeClass[size],
          "transition-[height,margin-top,opacity,translate,scale] duration-240 ease-out-quint data-ending-style:translate-x-6 data-ending-style:opacity-0 data-ending-style:duration-180 data-ending-style:ease-in data-starting-style:translate-y-4 data-starting-style:scale-95 data-starting-style:opacity-0",
        )}
      >
        <span className={cn("relative flex shrink-0", iconSizeClass[size])}>{toneIcon[tone]}</span>
        <BaseToast.Content className={cn("relative flex min-w-0 flex-1 flex-col", contentGapClass[size])}>
          <BaseToast.Title className={cn("text-text-primary", titleSizeClass[size])} />
          <BaseToast.Description className={cn("text-text-secondary", descriptionSizeClass[size])} />
        </BaseToast.Content>
        <BaseToast.Close
          aria-label="Close"
          className={cn(
            "relative flex shrink-0 motion-press cursor-pointer text-text-secondary motion-colors hover:text-text-primary",
            "after:absolute after:-inset-2 after:content-['']",
            closeSizeClass[size],
          )}
        >
          <X />
        </BaseToast.Close>
      </BaseToast.Root>
    );
  });
}

/** Props of {@link Toaster}: the app subtree it wraps plus the size and surface every toast shares. */
export type ToasterProps = {
  /** The app subtree; toasts portal to the viewport on top of it. */
  children?: ReactNode;
  /** Toast size: `sm` 320px, `md` 360px (default), `lg` 400px; applies to every toast this provider shows. @default "md" */
  size?: ToastSize;
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` puts it on the veil (`veil-overlay`).
   * Applies to every toast this provider shows. @default "solid"
   */
  surface?: "solid" | "glass";
  /** Extra classes on the fixed viewport, which sits 24px from the bottom, right and left edges. */
  className?: string;
};

/**
 * Figma `Toast` (62:307): a 360px card, solid or the veil. Wrap the app once; call
 * `useToast().add({ title, description, type: "success" })` to show one.
 *
 * Toasts portal to a fixed bottom-right viewport that stacks upward; each card rises 16px into
 * place in 240ms, shrinks from 95% as it fades in, and leaves to the right while its height
 * collapses. The close button clears it, and the whole height/margin tween runs on
 * `--toast-height`.
 *
 * @example
 * ```tsx
 * import { Toaster, useToast } from "@horon-ai/react";
 *
 * function App() {
 *   return (
 *     <Toaster size="md" surface="solid">
 *       <SaveButton />
 *     </Toaster>
 *   );
 * }
 *
 * function SaveButton() {
 *   const toast = useToast();
 *   return (
 *     <button onClick={() => toast.add({ title: "Saved", description: "All changes stored.", type: "success" })}>
 *       Save
 *     </button>
 *   );
 * }
 * ```
 */
export function Toaster({ children, size = "md", surface = "solid", className }: ToasterProps) {
  return (
    <BaseToast.Provider>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          className={cn(
            // `inset-x-6` gives the stack the same 24px gutter on the left as on the
            // right, so `w-full` toasts stop at the screen edge instead of running off it.
            "fixed inset-x-6 bottom-6 z-50 flex flex-col items-end gap-0",
            className,
          )}
        >
          <ToastList size={size} surface={surface} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

/**
 * The toast manager from the nearest {@link Toaster}: `add({ title, description, type })` shows a
 * toast and returns its id, `close(id)` dismisses one, and `toasts` is the live list the viewport
 * renders. Calling it without a provider throws.
 */
export const useToast = BaseToast.useToastManager;
