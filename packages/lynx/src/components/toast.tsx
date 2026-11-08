import { useCallback, useSyncExternalStore, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/**
 * Toast severity, which picks the leading icon and its color: `neutral` (info icon, secondary
 * text), `success` (check, brand color) or `danger` (warning, danger color). Any other toast type
 * falls back to `neutral`.
 */
export type ToastTone = "neutral" | "success" | "danger";

/** Toast rungs: `sm` 320px, `md` 360px and `lg` 400px wide cards. */
export type ToastSize = ControlSize;

const sizeClass: Record<ToastSize, string> = {
  sm: "w-full max-w-[320px] gap-2 px-3 py-2.5",
  md: "w-full max-w-[360px] gap-3 px-4 py-3.5",
  lg: "w-full max-w-[400px] gap-3.5 px-5 py-4",
};

const iconSize: Record<ToastSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const closeSize: Record<ToastSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
};

const titleClass: Record<ToastSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const descriptionClass: Record<ToastSize, string> = {
  sm: "text-body-sm",
  md: "text-body-sm",
  lg: "text-body-md",
};

const contentGapClass: Record<ToastSize, string> = {
  sm: "gap-0.5",
  md: "gap-0.5",
  lg: "gap-1",
};

/**
 * One queued toast. Created by `useToast().add`, rendered by {@link Toaster}; it is internal because
 * react kept the same shape inside Base UI's manager instead of exporting it.
 */
type ToastRecord = {
  /** Stable identity of this toast, returned by `add` and accepted by `close`. */
  id: string;
  /** Bold first line. */
  title?: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Severity; an unknown value paints as `neutral`. */
  type?: string;
};

/** Options accepted by `useToast().add`: the two text lines plus the severity and lifetime. */
type ToastAddOptions = {
  /** Bold first line. */
  title?: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Severity, one of {@link ToastTone} or a string that falls back to `neutral`. */
  type?: string;
  /** Milliseconds before the toast dismisses itself. @default 5000, Base UI provider's own default */
  timeout?: number;
};

/** The manager shape `useToast` returns, mirroring the three Base UI members components use. */
export type ToastManager = {
  /** Live queue the viewport renders, newest last. */
  toasts: ToastRecord[];
  /** Queues a toast and returns its id. */
  add: (options: ToastAddOptions) => string;
  /** Dismisses one toast by id. */
  close: (id: string) => void;
};

/**
 * The toast queue, owned by the module rather than a React context.
 *
 * React's `Toaster` mounted a Base UI provider and `useToast` read it from context; Lynx has no portal
 * and the demo tree mounts a `Toaster` per example, so the queue lives here instead: every `add` mutates
 * this list and notifies the subscribers, which is what lets a button outside any provider still raise a
 * toast. A `Toaster` only renders the queue; it does not own or reset it.
 */
let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();
let nextId = 0;

const emit = () => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): ToastRecord[] => toasts;

/** Queues a toast on the module store and schedules its dismissal. */
const addToast = (options: ToastAddOptions): string => {
  nextId += 1;
  const id = `toast-${nextId}`;
  const record: ToastRecord = { id, title: options.title, description: options.description, type: options.type };
  toasts = [...toasts, record];
  emit();
  const timeout = options.timeout ?? 5000;
  if (timeout > 0) {
    setTimeout(() => {
      if (!toasts.some((toast) => toast.id === id)) return;
      toasts = toasts.filter((toast) => toast.id !== id);
      emit();
    }, timeout);
  }
  return id;
};

/** Drops one toast by id; an unknown id is a no-op, like Base UI's `close`. */
const closeToast = (id: string) => {
  if (!toasts.some((toast) => toast.id === id)) return;
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
};

/**
 * How many cards the viewport paints at once. Base UI's provider caps the stack at 3 and marks the
 * rest as limited instead of dropping them, so the oldest stay queued but leave the screen.
 */
const MAX_VISIBLE = 3;

const isTone = (value: string | undefined): value is ToastTone =>
  value === "neutral" || value === "success" || value === "danger";

const toneIcon = (tone: ToastTone, size: number) => {
  if (tone === "success") return <Icon name="CheckCircle" size={size} color="text-brand" />;
  if (tone === "danger") return <Icon name="WarningCircle" size={size} color="text-danger" />;
  return <Icon name="Info" size={size} color="text-secondary" />;
};

/** Renders the live toast queue; each card stacks upward in the viewport. */
function ToastList({ size, surface }: { size: ToastSize; surface: "solid" | "glass" }) {
  const queue = useSyncExternalStore(subscribe, getSnapshot, getSnapshot).slice(-MAX_VISIBLE);

  return (
    <>
      {queue.map((toast) => {
        const tone = isTone(toast.type) ? toast.type : "neutral";
        return (
          <view
            key={toast.id}
            className={cn(
              "motion-rise relative mt-3 flex flex-row items-start overflow-hidden rounded-lg",
              surface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-popover",
              sizeClass[size],
            )}
          >
            <view className="relative flex shrink-0 items-start">{toneIcon(tone, iconSize[size])}</view>
            <view className={cn("relative flex min-w-0 flex-1 flex-col", contentGapClass[size])}>
              {toast.title ? <text className={cn("text-text-primary", titleClass[size])}>{toast.title}</text> : null}
              {toast.description ? (
                <text className={cn("text-text-secondary", descriptionClass[size])}>{toast.description}</text>
              ) : null}
            </view>
            <view
              className="motion-press motion-colors relative flex shrink-0 items-center justify-center active:opacity-70"
              bindtap={() => closeToast(toast.id)}
              hit-slop="6px"
              accessibility-element
              accessibility-traits="button"
              accessibility-label="Close"
            >
              <Icon name="X" size={closeSize[size]} color="text-secondary" />
            </view>
          </view>
        );
      })}
    </>
  );
}

/** Props of {@link Toaster}: the app subtree it wraps plus the size and surface every toast shares. */
export type ToasterProps = {
  /** The app subtree; the toast viewport paints over it. */
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
 * Lynx has no Base UI provider or portal, so the queue is module state and the viewport is a
 * `position: fixed` view rendered after the children — the same bottom-right stack, painted in place.
 * Each card rises into place with `motion-rise`; the close control drops it from the queue, and the
 * timeout `add` sets drops it too.
 *
 * @example
 * ```tsx
 * import { Toaster, useToast } from "@horon-ai/lynx";
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
 *     <view bindtap={() => toast.add({ title: "Saved", description: "All changes stored.", type: "success" })}>
 *       <text className="text-label-md text-text-primary">Save</text>
 *     </view>
 *   );
 * }
 * ```
 */
export function Toaster({ children, size = "md", surface = "solid", className }: ToasterProps) {
  return (
    <>
      {children}
      <view
        className={cn(
          // `px-6` gives the stack the same 24px gutter on the left as on the
          // right, so `w-full` toasts stop at the screen edge instead of running off it.
          "fixed inset-x-6 bottom-6 z-50 flex flex-col items-end",
          className,
        )}
        accessibility-element={false}
      >
        <ToastList size={size} surface={surface} />
      </view>
    </>
  );
}

/**
 * The toast manager: `add({ title, description, type })` queues a toast and returns its id, `close(id)`
 * dismisses one, and `toasts` is the live list the viewport renders. It reads the module queue, so it
 * works anywhere in the tree and never throws for a missing provider.
 */
export const useToast = (): ToastManager => {
  const toastsList = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const add = useCallback((options: ToastAddOptions) => addToast(options), []);
  const close = useCallback((id: string) => closeToast(id), []);
  return { toasts: toastsList, add, close };
};
