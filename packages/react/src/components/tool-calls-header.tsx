import { Collapsible } from "@base-ui/react/collapsible";
import { CaretDown } from "@phosphor-icons/react";
import { Children, type ReactNode } from "react";

import { cn } from "../lib/cn";

export type ToolCallsHeaderProps = {
  /** Up to three 14px tool icons, drawn as overlapping 28px chips. */
  icons?: ReactNode;
  title?: ReactNode;
  /** Elapsed time, such as "4.0s". */
  elapsed?: ReactNode;
  /** `ToolCall` cards, stacked 8px apart under the header. */
  children?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/** Figma `Tool-calls header` (Agents N11): overlapping tool chips, "Using tools…" and a caret that fold the ToolCall cards below. */
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
      className={cn("flex w-full flex-col", className)}
    >
      <Collapsible.Trigger className="group flex w-full cursor-pointer items-center gap-2.5 pb-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand">
        {chips.length > 0 && (
          <span className="flex items-center">
            {Children.map(chips, (icon) => (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border-default bg-bg-surface text-text-secondary not-first:-ml-1.5 [&>svg]:size-3.5">
                {icon}
              </span>
            ))}
          </span>
        )}
        <span className="text-label-md text-text-primary">{title}</span>
        {elapsed && <span className="text-label-md text-text-secondary">· {elapsed}</span>}
        <CaretDown
          aria-hidden
          className="size-3.5 shrink-0 text-text-secondary transition-transform duration-200 ease-out-quint group-data-panel-open:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="motion-collapse">
        <div className="flex flex-col gap-2 pt-1">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
