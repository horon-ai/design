import { Toast as BaseToast } from "@base-ui/react/toast";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ToastTone = "neutral" | "success" | "danger";

const toneIcon: Record<ToastTone, ReactNode> = {
  neutral: <Info className="text-text-secondary" />,
  success: <CheckCircle className="text-text-brand" />,
  danger: <WarningCircle className="text-text-danger" />,
};

const toastClass =
  "relative flex w-90 items-start gap-3 overflow-clip rounded-lg border border-glass-rim-strong bg-glass-regular px-4 py-3.5";

function isTone(value: string | undefined): value is ToastTone {
  return value === "neutral" || value === "success" || value === "danger";
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => {
    const tone = isTone(toast.type) ? toast.type : "neutral";
    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        className={cn(
          toastClass,
          "transition-[opacity,translate,scale] duration-260 ease-out-quint data-ending-style:translate-x-6 data-ending-style:opacity-0 data-ending-style:duration-180 data-ending-style:ease-in data-starting-style:translate-y-4 data-starting-style:scale-95 data-starting-style:opacity-0",
        )}
      >
        <LiquidGlass tier="regular" />
        <span className="relative flex shrink-0 [&_svg]:size-5">{toneIcon[tone]}</span>
        <BaseToast.Content className="relative flex min-w-0 flex-1 flex-col gap-0.5">
          <BaseToast.Title className="text-label-lg text-text-primary" />
          <BaseToast.Description className="text-body-sm text-text-secondary" />
        </BaseToast.Content>
        <BaseToast.Close
          aria-label="Close"
          className="relative flex shrink-0 motion-press cursor-pointer text-text-secondary [&_svg]:size-4"
        >
          <X />
        </BaseToast.Close>
      </BaseToast.Root>
    );
  });
}

export type ToasterProps = { children?: ReactNode; className?: string };

/**
 * Figma `Toast` (62:307): a 360px regular-glass card. Wrap the app once; call
 * `useToast().add({ title, description, type: "success" })` to show one.
 */
export function Toaster({ children, className }: ToasterProps) {
  return (
    <BaseToast.Provider>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className={cn("fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3", className)}>
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export const useToast = BaseToast.useToastManager;
