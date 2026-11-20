import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";
import { ArrowClockwise, CaretDown, Check, CheckCircle, Copy, WarningCircle } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";
import { Button } from "./button";
import { Spinner } from "./spinner";

/**
 * Any JSON-shaped value: a string, number, boolean, `null`, or an array or object of the same.
 * `ToolCall` renders `args` and `result` through {@link JsonCode}, so plain objects and arrays are
 * enough; class instances and functions are not supported.
 */
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** The four syntax colours of the printed JSON, as `@horon-ai/tokens` names them. */
const SYNTAX: Record<"key" | "string" | "number" | "punctuation", ColorToken> = {
  key: "syntax-key",
  string: "syntax-string",
  number: "syntax-number",
  punctuation: "syntax-punctuation",
};

/**
 * Walks a JSON value and returns syntax-highlighted text nodes, nesting one indentation step per level.
 *
 * The spans are raw `Text` on purpose: a nested `Text` inherits the code type of the
 * `HoronText` that prints it, while `HoronText` would reset the size to a body rung.
 *
 * @param value - The JSON value to render.
 * @param indent - Current nesting depth; 0 for a root value, one extra level per object or array.
 * @param color - Resolves a syntax tone to the colour of the active scheme.
 * @returns A flat list of text nodes for the key, string, number and punctuation colours.
 */
function renderJson(value: Json, indent: number, color: (tone: keyof typeof SYNTAX) => string): ReactNode {
  const pad = "  ".repeat(indent);
  if (value === null || typeof value === "number" || typeof value === "boolean") {
    return (
      <Text key="v" style={{ color: color("number") }}>
        {String(value)}
      </Text>
    );
  }
  if (typeof value === "string") {
    return (
      <Text key="v" style={{ color: color("string") }}>
        {JSON.stringify(value)}
      </Text>
    );
  }
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  const [open, close] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];
  return [
    <Text key="open" style={{ color: color("punctuation") }}>
      {open}
    </Text>,
    ...entries.map(([key, item], index) => (
      <Text key={key}>
        {"\n"}
        {pad}
        {"  "}
        {!Array.isArray(value) && (
          <>
            <Text style={{ color: color("key") }}>{JSON.stringify(key)}</Text>
            <Text style={{ color: color("punctuation") }}>: </Text>
          </>
        )}
        {renderJson(item, indent + 1, color)}
        {index < entries.length - 1 && <Text style={{ color: color("punctuation") }}>,</Text>}
      </Text>
    )),
    <Text key="close">
      {"\n"}
      {pad}
      <Text style={{ color: color("punctuation") }}>{close}</Text>
    </Text>,
  ];
}

/** Props of {@link JsonCode}: the value to print and the layout of the block. */
type JsonCodeProps = {
  /** The JSON value to print; see `Json` for the accepted shapes. */
  value: Json;

  /** Layout of the printed lines. */
  style?: StyleProp<TextStyle>;
};

/**
 * JSON in Geist Mono code style with the Figma syntax colours (key, string, number, punctuation).
 *
 * One mono text whose long lines wrap inside a narrow card, so a value never leaves
 * the section it is printed in. Used by {@link ToolCall} for tool arguments and
 * results, and usable on its own.
 *
 * @example
 * ```tsx
 * <JsonCode value={{ query: "Horon design tokens", limit: 5 }} />
 * ```
 */
export function JsonCode({ value, style }: JsonCodeProps) {
  const theme = useHoronTheme();
  return (
    <HoronText variant="code" tone="syntax-string" style={style}>
      {renderJson(value, 0, (tone) => theme.color(SYNTAX[tone]))}
    </HoronText>
  );
}

/**
 * Lifecycle state of a tool call.
 *
 * - `running`: a spinner replaces the status icon and the result section shows "Waiting for result…".
 * - `done`: a live-green check marks the row and the result is printed.
 * - `failed`: the card border turns danger, an error notice (with an optional Retry button) replaces the result.
 */
export type ToolCallStatus = "running" | "done" | "failed";

/**
 * Props for {@link ToolCall}.
 */
export type ToolCallProps = {
  /** Current lifecycle state; drives the status icon, border and which sections appear. */
  status: ToolCallStatus;
  /** Plain tool name, such as "Web search", with its 16pt icon. */
  tool: {
    /** A 16pt Phosphor icon; it sits inside the name pill in the secondary text colour. */
    icon: ReactNode;
    /** The visible tool name; truncates when the header runs out of room. */
    name: ReactNode;
  };
  /** One-line description of the call, such as the query that was sent. */
  summary: ReactNode;
  /** Elapsed time, such as "1.2s"; hidden when omitted. */
  elapsed?: ReactNode;
  /** Arguments object printed as JSON in an `Arguments` section when defined. */
  args?: Json;
  /** Result value printed as JSON in a `Result` section while the call is `running` (as a waiting message) or `done`; a `failed` call omits the section in favour of `error`. */
  result?: Json;
  /** Failure message shown instead of the result section when `status` is `failed`. */
  error?: ReactNode;
  /** Renders a Retry button on the failure notice; omit it to show the error without a retry. */
  onRetry?: () => void;
  /** The result is cut off; shows a "Show all" link under it. */
  truncated?: boolean;
  /** Called when the "Show all" link is pressed; only rendered when `truncated` is set and a result exists. */
  onShowAll?: () => void;
  /** Starts the card expanded; the card manages its own open state afterwards. */
  defaultOpen?: boolean;

};

/**
 * One labelled block inside the expanded card: an uppercase label row with an optional copy button,
 * a subtle rounded body, and an optional footer (used for the "Show all" link).
 */
function Section({
  label,
  children,
  copyText,
  footer,
}: {
  /** Uppercase heading, such as "Arguments"; also names the copy button for screen readers. */
  label: string;
  /** Body content, normally a {@link JsonCode} block or the waiting message. */
  children: ReactNode;
  /** Plain text of the section body; adds a real copy button when present. */
  copyText?: string;
  /** Content under the body, such as the truncated "Show all" link. */
  footer?: ReactNode;
}) {
  const theme = useHoronTheme();
  const { copied, copy } = useCopyToClipboard(1500);
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <HoronText variant="label-sm" tone="text-secondary" style={styles.sectionLabel}>
          {label.toUpperCase()}
        </HoronText>
        {copyText !== undefined && (
          <HoronPressable
            pressScale
            role="button"
            accessibilityLabel={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
            onPress={() => copy(copyText)}
            hitSlop={touchSlop(theme.touch, 20, 20)}
            style={({ pressed }) => [styles.copy, pressed && styles.pressedDim]}
          >
            {copied ? (
              <Check size={14} color={theme.color("status-live")} />
            ) : (
              <Copy size={14} color={theme.color("text-secondary")} />
            )}
          </HoronPressable>
        )}
      </View>
      <View style={[styles.sectionBody, { backgroundColor: theme.color("bg-subtle") }]}>{children}</View>
      {footer}
    </View>
  );
}

/**
 * Figma `Tool call` (Tool call card 186:7811): a solid 16pt-radius card that expands to arguments and result.
 *
 * The header row is a `button` that announces `expanded`/`collapsed` and shows
 * the tool pill, the summary, a status icon (spinner, check or warning) and a
 * caret that rotates 180° over 200ms, or jumps under Reduce Motion. The expanded
 * body adds the failure notice with Retry, the JSON `Arguments` section and the
 * `Result` section, whose copy buttons write through `expo-clipboard`. The card is
 * uncontrolled apart from `defaultOpen`; use {@link JsonCode} directly when only
 * the highlighted JSON is needed.
 *
 * @example
 * ```tsx
 * import { Globe } from "phosphor-react-native";
 * import { ToolCall } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <ToolCall
 *       status="done"
 *       tool={{ icon: <Globe />, name: "Web search" }}
 *       summary="Fetched 8 results for Horon tokens"
 *       elapsed="1.2s"
 *       args={{ query: "Horon design tokens" }}
 *       result={{ results: 8 }}
 *     />
 *   );
 * }
 * ```
 */
export function ToolCall({
  status,
  tool,
  summary,
  elapsed,
  args,
  result,
  error,
  onRetry,
  truncated,
  onShowAll,
  defaultOpen,
}: ToolCallProps) {
  const theme = useHoronTheme();
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [rotation] = useState(() => new Animated.Value(defaultOpen ? 1 : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rotation.setValue(open ? 1 : 0);
      return undefined;
    }
    const turn = Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    turn.start();
    return () => turn.stop();
  }, [open, rotation, theme.reducedMotion]);

  const caret = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.color(status === "failed" ? "border-danger" : "border-default"),
          backgroundColor: theme.color("bg-surface"),
        },
      ]}
    >
      <HoronPressable
        role="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [
          styles.trigger,
          theme.touch && { minHeight: TOUCH_TARGET },
          pressed && { backgroundColor: theme.color("overlay-ink-3") },
        ]}
      >
        <View style={[styles.toolPill, { backgroundColor: theme.color("overlay-ink-6") }]}>
          {tool.icon}
          <HoronText variant="label-md" numberOfLines={1} style={styles.toolName}>
            {tool.name}
          </HoronText>
        </View>
        <HoronText variant="body-sm" tone="text-secondary" numberOfLines={1} style={styles.summary}>
          {summary}
        </HoronText>
        <View style={styles.status}>
          {status === "running" && <Spinner size="sm" />}
          {status === "done" && <CheckCircle size={16} color={theme.color("status-live")} />}
          {status === "failed" && <WarningCircle size={16} color={theme.color("text-danger")} />}
        </View>
        {status === "failed" && (
          <HoronText variant="label-sm" tone="text-danger">
            Failed
          </HoronText>
        )}
        {elapsed && (
          <HoronText variant="caption" tone="text-secondary">
            {elapsed}
          </HoronText>
        )}
        <Animated.View style={{ transform: [{ rotate: caret }] }}>
          <CaretDown size={16} color={theme.color("text-secondary")} />
        </Animated.View>
      </HoronPressable>
      {open && (
        <View style={styles.panel}>
          {status === "failed" && error && (
            <View style={[styles.error, { backgroundColor: theme.color("bg-danger") }]}>
              <WarningCircle size={16} color={theme.color("text-danger")} />
              <HoronText variant="body-sm" tone="text-danger" style={styles.errorText}>
                {error}
              </HoronText>
              {onRetry && (
                <HoronPressable
                  pressScale
                  role="button"
                  onPress={onRetry}
                  hitSlop={touchSlop(theme.touch, theme.touch ? TOUCH_TARGET : 30)}
                  style={({ pressed }) => [
                    styles.retry,
                    theme.touch && { height: TOUCH_TARGET },
                    {
                      borderColor: theme.color("border-default"),
                      backgroundColor: theme.color("bg-surface"),
                    },
                    pressed && styles.pressedDim,
                  ]}
                >
                  <ArrowClockwise size={14} color={theme.color("text-primary")} />
                  <HoronText variant="label-sm">Retry</HoronText>
                </HoronPressable>
              )}
            </View>
          )}
          {args !== undefined && (
            <Section label="Arguments" copyText={JSON.stringify(args, null, 2)}>
              <JsonCode value={args} />
            </Section>
          )}
          {status !== "failed" && (
            <Section
              label="Result"
              copyText={typeof result === "string" ? result : JSON.stringify(result, null, 2)}
              footer={
                truncated && result !== undefined && status !== "running" ? (
                  <View style={styles.showAll}>
                    <Button variant="link" onPress={onShowAll}>
                      Show all
                    </Button>
                  </View>
                ) : undefined
              }
            >
              {status === "running" || result === undefined ? (
                <HoronText variant="body-sm" tone="text-secondary">
                  Waiting for result…
                </HoronText>
              ) : (
                <JsonCode value={result} />
              )}
            </Section>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: 0,
    borderWidth: 1,
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
    overflow: "hidden",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3.5"],
  },
  toolPill: {
    maxWidth: "100%",
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingLeft: spacing["2"],
    paddingRight: spacing["2.5"],
  },
  toolName: { minWidth: 0, flexShrink: 1 },
  summary: { minWidth: 0, flex: 1 },
  status: { width: 16, height: 16, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  panel: {
    minWidth: 0,
    gap: spacing["3.5"],
    paddingHorizontal: spacing["4"],
    paddingBottom: spacing["4"],
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3.5"],
    paddingVertical: spacing["3"],
  },
  errorText: { minWidth: 0, flex: 1 },
  retry: {
    flexShrink: 0,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing["2.5"],
  },
  pressedDim: { opacity: 0.7 },
  section: { minWidth: 0, gap: spacing["1.5"] },
  sectionHead: { flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  sectionLabel: { flex: 1 },
  copy: { alignItems: "center", justifyContent: "center" },
  sectionBody: {
    minWidth: 0,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3.5"],
    paddingVertical: spacing["3"],
  },
  showAll: { alignSelf: "flex-start" },
});

export type { Json };
