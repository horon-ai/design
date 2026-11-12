import { Collapsible } from "@base-ui/react/collapsible";
import { CaretDown } from "@phosphor-icons/react";
import { Children, type ReactNode } from "react";

import { cn } from "../lib/cn";

/**
 * Props for {@link ToolCallsHeader}.
 */
export type ToolCallsHeaderProps = {
  /** Up to three 14px tool icons, drawn as overlapping 28px chips. */
  icons?: ReactNode;
  /** Header text; defaults to "Using tools…". @default "Using tools…" */
  title?: ReactNode;
  /** Elapsed time, such as "4.0s". */
  elapsed?: ReactNode;
  /** `ToolCall` cards, stacked 8px apart under the header. */
  children?: ReactNode;
  /** Starts with the cards shown; the group manages its own open state afterwards. @default true */
  defaultOpen?: boolean;
  /** Controlled open state; pass `onOpenChange` too when set. */
  open?: boolean;
  /** Called with the next open state whenever the trigger is pressed. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes for the outer card. */
  className?: string;
};

/**
 * Figma `Tool-calls header` (Agents N11): overlapping tool chips, "Using tools…" and a caret that fold the ToolCall cards below.
 *
 * Only the first three icons are drawn, each as a 28px chip. The trigger is a Base UI collapsible
 * button that rotates the caret and reveals the children in a `motion-collapse` panel. Pass `open`
 * and `onOpenChange` to control it, or leave them out and start from `defaultOpen`.
 *
 * @example
 * ```tsx
 * import { ToolCall, ToolCallsHeader } from "@horon-ai/react";
 * import { Globe, Terminal } from "@phosphor-icons/react";
 *
 * function Example() {
 *   return (
 *     <ToolCallsHeader
 *       icons={[<Globe key="globe" aria-hidden />, <Terminal key="terminal" aria-hidden />]}
 *       elapsed="4.0s"
 *     >
 *       <ToolCall status="done" tool={{ icon: <Globe />, name: "Web search" }} summary="Searched the docs" />
 *     </ToolCallsHeader>
 *   );
 * }
 * ```
 */
export function ToolCallsHeader({
  icons,
  title = "Using tools…",
  elapsed,
  children,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
}: ToolCallsHeaderProps) {
  const chips = Children.toArray(icons).slice(0, 3);
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "flex w-full min-w-0 flex-col rounded-xl border border-border-default bg-bg-surface p-3",
        className,
      )}
    >
      <Collapsible.Trigger className="group flex w-full min-w-0 cursor-pointer items-center gap-2.5 pb-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand">
        {chips.length > 0 && (
          <span className="flex shrink-0 items-center">
            {Children.map(chips, (icon) => (
              <span className="-ml-2 flex size-7 shrink-0 items-center justify-center rounded-md bg-bg-subtle text-text-secondary ring-2 ring-bg-surface first:ml-0 [&>svg]:size-3.5">
                {icon}
              </span>
            ))}
          </span>
        )}
        <span className="min-w-0 truncate text-label-md text-text-primary">{title}</span>
        {elapsed && <span className="shrink-0 text-label-md text-text-secondary">· {elapsed}</span>}
        <CaretDown
          aria-hidden
          className="ml-auto size-4 shrink-0 text-text-secondary transition-transform duration-200 ease-out-quint group-data-panel-open:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="motion-collapse">
        <div className="flex min-w-0 flex-col gap-2 pt-1">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
