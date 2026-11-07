import { type ComponentProps, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { SegmentedControl } from "./segmented-control";

/**
 * Permission a tool can be given.
 *
 * - `allow`: runs without asking.
 * - `ask`: asks for confirmation before each call; the fallback when a `ToolPermissionItem` has no `defaultValue`.
 * - `off`: the tool is disabled.
 */
export type ToolPermission = "allow" | "ask" | "off";

/**
 * One tool row in {@link ToolPermissions}.
 */
export type ToolPermissionItem = {
  /** Tool name, shown in mono type; also the key used in `values`. */
  name: string;
  /** Caption under the name, such as what the tool reads or writes. */
  description?: ReactNode;
  /** Starting choice for the uncontrolled component; defaults to `ask`. */
  defaultValue?: ToolPermission;
};

/**
 * Props for {@link ToolPermissions}.
 */
export type ToolPermissionsProps = Omit<ComponentProps<"div">, "className" | "title" | "onChange"> & {
  /** Header title, such as "Tool access". */
  title: ReactNode;
  /** One row per tool, in display order; the row count also fills the header pill. */
  tools: ToolPermissionItem[];
  /** Controlled choices keyed by tool name. */
  values?: Record<string, ToolPermission>;
  /** Called with the complete next map whenever one row changes or "Allow all" is pressed. */
  onValuesChange?: (values: Record<string, ToolPermission>) => void;
  /** Label of the text button that sets every tool to Allow. */
  allowAllLabel?: ReactNode;
  /** Extra classes for the card root. */
  className?: string;
};

/**
 * Segmented control options in display order; each row renders the same Allow / Ask / Off triple.
 */
const options: {
  /** Permission stored for the tool when this segment is picked. */
  value: ToolPermission;
  /** Segment label shown to the user. */
  label: string;
}[] = [
  { value: "allow", label: "Allow" },
  { value: "ask", label: "Ask" },
  { value: "off", label: "Off" },
];

/**
 * Paper `Tool permissions` (1VT5-0): one solid card, 16px radius with a default border. A subtle header
 * carries the group title, a count pill and an "Allow all" text button; below it one divided row per tool
 * with a mono name, a description and a small solid Allow / Ask / Off segmented control. 16px side padding
 * on every row so the names, the header title and the controls line up.
 *
 * The component is uncontrolled by default, seeding each row from `ToolPermissionItem.defaultValue`
 * (or `ask`). Pass `values` and `onValuesChange` to control every row at once; the controlled map wins
 * over the internal state, and the internal copy is still updated on each change.
 *
 * @example
 * ```tsx
 * import { ToolPermissions } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <ToolPermissions
 *       title="Tool access"
 *       tools={[
 *         { name: "web_search", description: "Read public pages", defaultValue: "allow" },
 *         { name: "shell", description: "Run local commands" },
 *       ]}
 *     />
 *   );
 * }
 * ```
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
        "flex w-full max-w-130 min-w-0 flex-col overflow-clip rounded-2xl border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex h-11 items-center gap-2 border-b border-border-default bg-bg-subtle px-4">
        <span className="min-w-0 truncate text-label-md font-semibold text-text-primary">{title}</span>
        <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-overlay-ink-6 px-1.5 text-label-sm text-text-secondary">
          <span className="text-trim">{tools.length}</span>
        </span>
        <span className="min-w-0 flex-1" />
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-sm text-label-sm whitespace-nowrap text-text-secondary motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
          onClick={() => update(Object.fromEntries(tools.map((tool) => [tool.name, "allow" as const])))}
        >
          {allowAllLabel}
        </button>
      </div>
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border-default px-4 py-3 last:border-b-0"
        >
          <div className="flex min-w-0 grow basis-40 flex-col gap-1">
            <span className="truncate font-mono text-code font-medium text-text-primary">{tool.name}</span>
            {tool.description && (
              <span className="text-caption wrap-break-word text-text-secondary">{tool.description}</span>
            )}
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
