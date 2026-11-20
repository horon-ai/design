import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { BookmarkSimple, MagnifyingGlass, Plus, X } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";
import { useHoronTheme, type ColorToken } from "../provider";
import { PanelPillTabs } from "./bot-instructions-panel";
import { Switch } from "./switch";

/** One switch row of {@link BotMemoryPanel}: a label, an optional description and the Switch state. */
export type BotMemorySetting = {
  /** Stable key of the row, passed back to `onSettingChange`. */
  id: string;
  /** Row title, also used as the switch's `aria-label`. */
  label: string;
  /** Optional second line under the label, e.g. what the setting does. */
  description?: string;
  /** Initial switch state; the switch is uncontrolled after mount. */
  defaultChecked?: boolean;
};

/** One remembered item of {@link BotMemoryPanel}, grouped under its `group` heading. */
export type BotMemoryItem = {
  /** Stable key of the memory. */
  id: string;
  /** The remembered text, on the first line of the row. */
  text: string;
  /** Where the memory came from, for example `From a chat · Oct 8`. */
  source: string;
  /** Group label; the filter tabs are built from these in order of appearance. */
  group: string;
  /** Highlights a memory that was just added. */
  fresh?: boolean;
};

/** The transient "Memory updated" pill of {@link BotMemoryPanel}: a title and an optional second line. */
export type BotMemoryToast = {
  /** Bold pill text, e.g. "Memory updated". */
  title: string;
  /** Optional detail shown after the title, e.g. what was saved. */
  message?: string;
};

/** Props of {@link BotMemoryPanel}. */
export type BotMemoryPanelProps = Omit<ViewProps, "children"> & {
  /**
   * Heading of the panel.
   * @default "Memory"
   */
  title?: ReactNode;
  /** Muted second line under the heading, e.g. how many memories are stored. */
  subtitle?: ReactNode;
  /** Fill of the memory meter, 0 to 100. */
  usage: number;
  /** Switch rows shown under the header, in order. */
  settings?: BotMemorySetting[];
  /** All memories; they are grouped by `group` and filtered by the pill tabs. */
  memories: BotMemoryItem[];
  /** The "Memory updated" pill; it enters with a pop and leaves through its close button. */
  toast?: BotMemoryToast;
  /** Fires once the closing pill has finished its exit animation. */
  onToastDismiss?: () => void;
  /** "Add memory" at the bottom of the panel. */
  onAdd?: () => void;
  /** Fires when a settings switch is flipped, with the setting `id` and the new state. */
  onSettingChange?: (id: string, checked: boolean) => void;
  /** Makes the search button actionable; without it the icon is a plain decoration. */
  onSearch?: () => void;
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/** Hairline separator between panel rows; `inset` indents it by 20pt to match the rows around it. */
function Divider({ inset }: { inset?: boolean }) {
  const theme = useHoronTheme();
  return (
    <View style={inset ? styles.dividerInset : undefined} role="separator">
      <View style={[styles.dividerRule, { backgroundColor: theme.color("overlay-ink-8") }]} />
    </View>
  );
}

/** Fades and lifts a memory row 4pt, `motion-rise`, after its stagger delay; it lands at once under Reduce Motion. */
function Rise({ delay = 0, style, children }: { delay?: number; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  const theme = useHoronTheme();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.tabPanel,
      delay,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, theme.reducedMotion, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * The "Memory updated" pill: it pops in on mount, and pressing its close
 * button plays the faster pop-out before {@link BotMemoryPanel} unmounts it.
 */
function ToastPill({ toast, onDismiss }: { toast: BotMemoryToast; onDismiss: () => void }) {
  const theme = useHoronTheme();
  const [presence] = useState(() => new Animated.Value(theme.reducedMotion ? 1 : 0));
  const leaving = useRef(false);

  useEffect(() => {
    if (theme.reducedMotion) {
      presence.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(presence, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.spring,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [presence, theme.reducedMotion]);

  const dismiss = () => {
    if (leaving.current) return;
    leaving.current = true;
    if (theme.reducedMotion) {
      onDismiss();
      return;
    }
    Animated.timing(presence, {
      toValue: 0,
      duration: duration.popOut,
      easing: easing.in,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDismiss();
    });
  };

  return (
    <Animated.View
      role="status"
      style={[
        styles.toast,
        {
          backgroundColor: theme.color("accent-sky-500-16"),
          opacity: presence,
          transform: [{ scale: presence.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
        },
      ]}
    >
      <BookmarkSimple size={14} color={theme.color("text-primary")} />
      <HoronText variant="label-sm" numberOfLines={1} style={styles.toastTitle}>
        {toast.title}
      </HoronText>
      {toast.message ? (
        <HoronText variant="caption" tone="text-secondary" numberOfLines={1} style={styles.toastTitle}>
          {toast.message}
        </HoronText>
      ) : null}
      <HoronPressable
        role="button"
        aria-label="Dismiss"
        onPress={dismiss}
        hitSlop={touchSlop(theme.touch, 12, 12)}
        style={styles.toastClose}
      >
        <X size={12} color={theme.color("text-secondary")} />
      </HoronPressable>
    </Animated.View>
  );
}

/**
 * Bot memory panel (Paper `ZO2-1` / `HPY-0`): a 20pt-radius surface with a
 * memory meter, two switch rows, a filter pill track, a transient "Memory
 * updated" pill and the grouped memories.
 *
 * The meter clamps `usage` to 0–100 and exposes it as a `progressbar`. The
 * filter tabs are built from the memories' `group` values plus an "All" tab and
 * are component state; each row rises in with a 30ms stagger. The toast pill
 * shows while a `toast` is passed, plays its exit animation when its close
 * button is pressed, and calls `onToastDismiss` when that animation ends — a new
 * toast object revives the pill.
 *
 * @example
 * ```tsx
 * <BotMemoryPanel
 *   usage={42}
 *   settings={[{ id: "auto", label: "Memory", description: "Let the assistant remember chats", defaultChecked: true }]}
 *   memories={[{ id: "m1", text: "Prefers Korean replies", source: "From a chat · Oct 8", group: "Preference" }]}
 *   onAdd={() => {}}
 * />
 * ```
 */
export function BotMemoryPanel({
  title = "Memory",
  subtitle,
  usage,
  settings,
  memories,
  toast,
  onToastDismiss,
  onAdd,
  onSettingChange,
  onSearch,
  style,
  ...props
}: BotMemoryPanelProps) {
  const theme = useHoronTheme();
  const [filter, setFilter] = useState("all");
  // Both marks are tied to the toast object, so a new toast revives the pill without an effect.
  const [dismissedFor, setDismissedFor] = useState<BotMemoryToast | undefined>();
  const dismissed = toast !== undefined && dismissedFor === toast;
  const shown = toast !== undefined && !dismissed;

  const groups = [...new Set(memories.map((memory) => memory.group))];
  const visible = filter === "all" ? groups : groups.filter((group) => group === filter);
  const percent = Math.min(100, Math.max(0, usage));
  const fill: ColorToken = "interactive-primary";
  let rowIndex = 0;

  return (
    <View
      style={[
        styles.root,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
      {...props}
    >
      <View style={styles.header}>
        <View style={styles.heading}>
          {isText(title) ? (
            <HoronText variant="label-lg" numberOfLines={1}>
              {title}
            </HoronText>
          ) : (
            title
          )}
          {subtitle ? (
            isText(subtitle) ? (
              <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                {subtitle}
              </HoronText>
            ) : (
              subtitle
            )
          ) : null}
        </View>
        <View style={styles.meterBlock}>
          <HoronText variant="caption" tone="text-secondary">
            {percent}% full
          </HoronText>
          <View
            accessible
            role="progressbar"
            accessibilityLabel="Memory used"
            accessibilityValue={{ min: 0, max: 100, now: percent }}
            style={[styles.meter, { backgroundColor: theme.color("overlay-ink-8") }]}
          >
            <View style={[styles.meterFill, { width: `${percent}%`, backgroundColor: theme.color(fill) }]} />
          </View>
        </View>
      </View>
      {settings?.map((setting, index) => (
        <View key={setting.id} style={styles.settingsRow}>
          {index > 0 ? <Divider inset /> : null}
          <View style={styles.setting}>
            <View style={styles.settingCopy}>
              <HoronText variant="label-md">{setting.label}</HoronText>
              {setting.description ? (
                <HoronText variant="caption" tone="text-secondary">
                  {setting.description}
                </HoronText>
              ) : null}
            </View>
            <Switch
              size="compact"
              aria-label={setting.label}
              defaultChecked={setting.defaultChecked}
              onCheckedChange={(checked) => onSettingChange?.(setting.id, checked)}
            />
          </View>
        </View>
      ))}
      <Divider />
      <View style={styles.filterRow}>
        <PanelPillTabs
          aria-label="Memory filter"
          value={filter}
          onValueChange={setFilter}
          items={[{ value: "all", label: "All" }, ...groups.map((group) => ({ value: group, label: group }))]}
        />
        <View style={styles.spacer} />
        {onSearch ? (
          <HoronPressable
            role="button"
            pressScale
            aria-label="Search memories"
            onPress={onSearch}
            style={({ pressed }) => [
              styles.search,
              { backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6") },
            ]}
          >
            {({ pressed }) => (
              <MagnifyingGlass size={16} color={theme.color(pressed ? "text-primary" : "text-secondary")} />
            )}
          </HoronPressable>
        ) : (
          <View style={[styles.search, { backgroundColor: theme.color("overlay-ink-6") }]}>
            <MagnifyingGlass size={16} color={theme.color("text-secondary")} />
          </View>
        )}
      </View>
      {shown ? (
        <View style={styles.toastStrip}>
          <ToastPill key={toast.title} toast={toast} onDismiss={() => {
            setDismissedFor(toast);
            onToastDismiss?.();
          }} />
        </View>
      ) : null}
      <View key={filter} style={styles.groups}>
        {visible.map((group) => {
          const items = memories.filter((memory) => memory.group === group);
          return (
            <View key={group} style={styles.group}>
              <View style={styles.groupHeader}>
                <HoronText variant="label-sm" tone="text-secondary">
                  {group}
                </HoronText>
                <HoronText variant="caption" tone="text-secondary">
                  {items.length}
                </HoronText>
              </View>
              {items.map((memory) => {
                const delay = rowIndex++ * 30;
                return (
                  <Rise
                    key={memory.id}
                    delay={delay}
                    style={[
                      styles.memory,
                      memory.fresh ? { backgroundColor: theme.color("accent-sky-500-10") } : null,
                    ]}
                  >
                    <HoronText variant="body-sm">{memory.text}</HoronText>
                    <HoronText variant="caption" tone="text-secondary">
                      {memory.source}
                    </HoronText>
                  </Rise>
                );
              })}
            </View>
          );
        })}
      </View>
      <HoronPressable
        role="button"
        onPress={onAdd}
        style={[styles.add, theme.touch && { minHeight: TOUCH_TARGET }]}
      >
        {({ pressed }) => (
          <>
            <Plus size={14} color={theme.color(pressed ? "text-primary" : "text-secondary")} />
            <HoronText variant="label-md" tone={pressed ? "text-primary" : "text-secondary"}>
              Add memory
            </HoronText>
          </>
        )}
      </HoronPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 560,
    minWidth: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius.xl,
    borderCurve: "continuous",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["2.5"],
    rowGap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["3.5"],
  },
  heading: { flexGrow: 1, flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  meterBlock: { flexDirection: "column", alignItems: "flex-end", gap: spacing["1"] },
  meter: { width: 80, height: 5, flexShrink: 0, overflow: "hidden", borderRadius: radius.full },
  meterFill: { height: "100%", borderRadius: radius.full },
  settingsRow: { flexDirection: "column" },
  dividerInset: { paddingHorizontal: spacing["5"] },
  dividerRule: { height: 1, alignSelf: "stretch" },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    paddingHorizontal: spacing["5"],
    paddingVertical: spacing["2.5"],
  },
  settingCopy: { flexGrow: 1, flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3"],
    paddingBottom: spacing["1.5"],
  },
  spacer: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  search: {
    width: 30,
    height: 30,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  toastStrip: { paddingHorizontal: spacing["5"], paddingVertical: spacing["1.5"] },
  toast: {
    height: 32,
    maxWidth: "100%",
    minWidth: 0,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderRadius: radius.full,
    paddingLeft: spacing["2.5"],
    paddingRight: spacing["3"],
  },
  toastTitle: { flexShrink: 1, minWidth: 0 },
  toastClose: { width: 12, height: 12, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  groups: { flexDirection: "column" },
  group: { flexDirection: "column" },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3"],
    paddingBottom: spacing["1"],
  },
  memory: {
    flexDirection: "column",
    gap: spacing["0.5"],
    paddingHorizontal: spacing["5"],
    paddingVertical: spacing["2"],
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3"],
    paddingBottom: spacing["4"],
  },
});
