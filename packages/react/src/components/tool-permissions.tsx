import { type ComponentProps, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { SegmentedControl } from "./segmented-control";

export type ToolPermission = "allow" | "ask" | "off";

export type ToolPermissionItem = {
  name: string;
  description?: ReactNode;
  /** Starting choice for the uncontrolled component; defaults to `ask`. */
  defaultValue?: ToolPermission;
};

export type ToolPermissionsProps = Omit<ComponentProps<"div">, "className" | "title" | "onChange"> & {
  title: ReactNode;
  tools: ToolPermissionItem[];
  /** Controlled choices keyed by tool name. */
  values?: Record<string, ToolPermission>;
  onValuesChange?: (values: Record<string, ToolPermission>) => void;
  /** Label of the text button that sets every tool to Allow. */
  allowAllLabel?: ReactNode;
  className?: string;
};

const options: { value: ToolPermission; label: string }[] = [
  { value: "allow", label: "Allow" },
  { value: "ask", label: "Ask" },
  { value: "off", label: "Off" },
];

/**
 * Paper `Tool permissions` (1VT5-0): a neutral-50 group header with a count pill and an "Allow all" text button,
 * then one divided row per tool with a mono name, a description and an Allow / Ask / Off segmented control.
 */
export function ToolPermissions({
  title,
  tools,
  values,
  onValuesChange,
  allowAllLabel = "Allow all",
  className,
  ...props
}: ToolPermissionsProps) {
  const [inner, setInner] = useState<Record<string, ToolPermission>>(() =>
    Object.fromEntries(tools.map((tool) => [tool.name, tool.defaultValue ?? "ask"])),
  );
  const current = values ?? inner;
  const update = (next: Record<string, ToolPermission>) => {
    setInner(next);
    onValuesChange?.(next);
  };
  return (
    <div className={cn("flex w-full max-w-130.25 flex-col", className)} {...props}>
      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800">
        <span className="text-[13px]/[18px] font-semibold text-text-primary">{title}</span>
        <span className="inline-flex h-5.5 items-center rounded-full bg-overlay-ink-6 px-2 text-[12px]/[16px] font-medium text-text-secondary">
          {tools.length}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          className="cursor-pointer rounded-sm text-[12px]/[16px] font-medium text-text-placeholder motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
          onClick={() => update(Object.fromEntries(tools.map((tool) => [tool.name, "allow" as const])))}
        >
          {allowAllLabel}
        </button>
      </div>
      {tools.map((tool, index) => (
        <div
          key={tool.name}
          className="motion-rise flex items-center gap-3 border-b border-border-default py-[11px] pr-1 pl-3 last:border-b-0"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate font-mono text-[13px]/[18px] font-medium text-text-primary">{tool.name}</span>
            {tool.description && (
              <span className="text-[12px]/[16px] text-text-placeholder">{tool.description}</span>
            )}
          </div>
          <SegmentedControl
            aria-label={`${tool.name} permission`}
            fill={false}
            items={options}
            value={current[tool.name] ?? "ask"}
            onValueChange={(value) => {
              const next = options.find((option) => option.value === value);
              if (next) update({ ...current, [tool.name]: next.value });
            }}
          />
        </div>
      ))}
    </div>
  );
}
