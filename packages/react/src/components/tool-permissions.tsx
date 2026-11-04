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
 * Paper `Tool permissions` (1VT5-0): one solid card, 16px radius with a default border. A subtle header
 * carries the group title, a count pill and an "Allow all" text button; below it one divided row per tool
 * with a mono name, a description and a small solid Allow / Ask / Off segmented control. 16px side padding
 * on every row so the names, the header title and the controls line up.
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
    <div
      className={cn(
        "flex w-full max-w-130 flex-col overflow-clip rounded-2xl border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex h-11 items-center gap-2 border-b border-border-default bg-bg-subtle px-4">
        <span className="text-label-md font-semibold text-text-primary">{title}</span>
        <span className="inline-flex h-5 items-center rounded-full bg-overlay-ink-6 px-1.5 text-label-sm text-text-secondary">
          <span className="text-trim">{tools.length}</span>
        </span>
        <span className="flex-1" />
        <button
          type="button"
          className="cursor-pointer rounded-sm text-label-sm text-text-secondary motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
          onClick={() => update(Object.fromEntries(tools.map((tool) => [tool.name, "allow" as const])))}
        >
          {allowAllLabel}
        </button>
      </div>
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="flex items-center gap-4 border-b border-border-default px-4 py-3 last:border-b-0"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-mono text-code font-medium text-text-primary">{tool.name}</span>
            {tool.description && <span className="text-caption text-text-secondary">{tool.description}</span>}
          </div>
          <SegmentedControl
            aria-label={`${tool.name} permission`}
            size="sm"
            surface="solid"
            fill={false}
            className="shrink-0"
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
