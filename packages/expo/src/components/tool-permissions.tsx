import { useState, type ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
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
export type ToolPermissionsProps = Omit<ViewProps, "children"> & {
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

/** Whether a node can be dropped into a `HoronText` as its child; an element has to render as itself. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Paper `Tool permissions` (1VT5-0): one solid card, 16pt radius with a default border.
 *
 * A subtle 44pt header carries the group title, a count pill and an "Allow all"
 * text button; below it one divided row per tool with a mono name, a description
 * and a small solid Allow / Ask / Off segmented control, each named
 * "`<tool>` permission". 16pt side padding on every row keeps the names, the
 * header title and the controls on one edge.
 *
 * The component is uncontrolled by default, seeding each row from
 * `ToolPermissionItem.defaultValue` (or `ask`). Pass `values` and
 * `onValuesChange` to control every row at once; the controlled map wins over the
 * internal state, and the internal copy is still updated on each change.
 *
 * @example
 * ```tsx
 * <ToolPermissions
 *   title="Tool access"
 *   tools={[
 *     { name: "web_search", description: "Read public pages", defaultValue: "allow" },
 *     { name: "shell", description: "Run local commands" },
 *   ]}
 * />
 * ```
 */
export function ToolPermissions({
  title,
  tools,
  values,
  onValuesChange,
  allowAllLabel = "Allow all",
  ...props
}: ToolPermissionsProps) {
  const theme = useHoronTheme();
  const [inner, setInner] = useState<Record<string, ToolPermission>>(() =>
    Object.fromEntries(tools.map((tool) => [tool.name, tool.defaultValue ?? "ask"])),
  );
  const current = values ?? inner;
  const update = (next: Record<string, ToolPermission>) => {
    setInner(next);
    onValuesChange?.(next);
  };
  const allowAll = () => update(Object.fromEntries(tools.map((tool) => [tool.name, "allow" as const])));

  return (
    <View
      {...props}
      style={[
        styles.card,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-subtle") },
        ]}
      >
        {isPlainText(title) ? (
          <HoronText variant="label-md" numberOfLines={1} style={styles.headerTitle}>
            {title}
          </HoronText>
        ) : (
          <View style={styles.headerTitle}>{title}</View>
        )}
        <View style={[styles.count, { backgroundColor: theme.color("overlay-ink-6") }]}>
          <HoronText variant="label-sm" tone="text-secondary">
            {tools.length}
          </HoronText>
        </View>
        <View style={styles.spacer} />
        <HoronPressable
          role="button"
          onPress={allowAll}
          hitSlop={theme.touch ? 8 : undefined}
          style={[styles.allowAll, theme.touch && { minHeight: TOUCH_TARGET }]}
        >
          {isPlainText(allowAllLabel) ? (
            <HoronText variant="label-sm" tone="text-secondary">
              {allowAllLabel}
            </HoronText>
          ) : (
            allowAllLabel
          )}
        </HoronPressable>
      </View>
      {tools.map((tool, index) => (
        <View
          key={tool.name}
          style={[
            styles.row,
            index < tools.length - 1 && {
              borderBottomWidth: 1,
              borderColor: theme.color("border-default"),
            },
          ]}
        >
          <View style={styles.toolText}>
            <HoronText variant="code" numberOfLines={1} style={styles.toolName}>
              {tool.name}
            </HoronText>
            {tool.description ? (
              isPlainText(tool.description) ? (
                <HoronText variant="caption" tone="text-secondary">
                  {tool.description}
                </HoronText>
              ) : (
                tool.description
              )
            ) : null}
          </View>
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 520,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
    overflow: "hidden",
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderBottomWidth: 1,
    paddingHorizontal: spacing["4"],
  },
  headerTitle: { minWidth: 0, flexShrink: 1, fontWeight: "600" },
  count: {
    height: 20,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["1.5"],
  },
  spacer: { flex: 1, minWidth: 0 },
  allowAll: { flexShrink: 0, justifyContent: "center" },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["4"],
    rowGap: spacing["2"],
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3"],
  },
  toolText: { flexGrow: 1, flexBasis: 160, minWidth: 0, gap: spacing["1"] },
  toolName: { fontWeight: "500" },
});
