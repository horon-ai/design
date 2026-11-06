import { Toast as BaseToast } from "@base-ui/react/toast";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type ToastTone = "neutral" | "success" | "danger";
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

function ToastList({ size, surface }: { size: ToastSize; surface: "solid" | "glass" }) {
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

export type ToasterProps = {
  children?: ReactNode;
  /** Toast size: `sm` 320px, `md` 360px (default), `lg` 400px; applies to every toast this provider shows. */
  size?: ToastSize;
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` puts it on the veil (`veil-overlay`).
   * Applies to every toast this provider shows.
   */
  surface?: "solid" | "glass";
  className?: string;
};

/**
 * Figma `Toast` (62:307): a 360px card, solid or the veil. Wrap the app once; call
 * `useToast().add({ title, description, type: "success" })` to show one.
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

export const useToast = BaseToast.useToastManager;
