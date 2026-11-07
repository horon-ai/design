import { useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

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
 * The React element this port replaces: React spread `div` attributes onto the root and took
 * `title` from the DOM attributes. Lynx has no DOM to forward to, so only the honoured members are
 * declared — the `view` root's class, id and inline style.
 */
type PortedDivProps = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the card root. */
  style?: CSSProperties;
};

/**
 * Props for {@link ToolPermissions}.
 */
export type ToolPermissionsProps = PortedDivProps & {
  /** Header title, such as "Tool access". */
  title: ReactNode;
  /** One row per tool, in display order; the row count also fills the header pill. */
  tools: ToolPermissionItem[];
  /** Controlled choices keyed by tool name. */
  values?: Record<string, ToolPermission>;
  /** Called with the complete next map whenever one row changes or "Allow all" is pressed. */
  onValuesChange?: (values: Record<string, ToolPermission>) => void;
  /** Label of the text button that sets every tool to Allow. @default "Allow all" */
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

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

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
 * React took `onChange` from the DOM attributes and dropped it; Lynx has no form events, so the prop is
 * simply absent. The last row drops its bottom border itself because Lynx cannot match `:last-child`.
 *
 * @example
 * ```tsx
 * import { ToolPermissions } from "@horon-ai/lynx";
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
  id,
  style,
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
    <view
      className={cn(
        "flex w-full max-w-[520px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex h-11 flex-row items-center gap-2 border-b border-border-default bg-bg-subtle px-4">
        {isPlainText(title) ? (
          <text className="min-w-0 truncate text-label-md text-text-primary">{title}</text>
        ) : (
          <view className="flex min-w-0 flex-row items-center">{title}</view>
        )}
        <view className="flex h-5 shrink-0 flex-row items-center rounded-full bg-overlay-ink-6 px-1.5">
          <text className="text-trim text-label-sm text-text-secondary">{tools.length}</text>
        </view>
        <view className="min-w-0 flex-1" />
        <view
          className="shrink-0 rounded-sm motion-colors active:opacity-70"
          bindtap={() => update(Object.fromEntries(tools.map((tool) => [tool.name, "allow" as const])))}
          accessibility-element
          accessibility-traits="button"
        >
          {isPlainText(allowAllLabel) ? (
            <text className="text-label-sm whitespace-nowrap text-text-secondary">{allowAllLabel}</text>
          ) : (
            allowAllLabel
          )}
        </view>
      </view>
      {tools.map((tool, index) => (
        <view
          key={tool.name}
          className={cn(
            "flex flex-row flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
            index < tools.length - 1 && "border-b border-border-default",
          )}
        >
          <view className="flex min-w-0 grow basis-40 flex-col gap-1">
            <text className="min-w-0 truncate font-mono text-code text-text-primary">{tool.name}</text>
            {tool.description ? (
              isPlainText(tool.description) ? (
                <text className="break-all text-caption text-text-secondary">{tool.description}</text>
              ) : (
                tool.description
              )
            ) : null}
          </view>
          <view className="shrink-0">
            <SegmentedControl
              aria-label={`${tool.name} permission`}
              size="sm"
              surface="solid"
              fill={false}
              items={options}
              value={current[tool.name] ?? "ask"}
              onValueChange={(value) => {
                const next = options.find((option) => option.value === value);
                if (next) update({ ...current, [tool.name]: next.value });
              }}
            />
          </view>
        </view>
      ))}
    </view>
  );
}
