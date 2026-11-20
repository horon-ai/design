import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { MagnifyingGlass, X } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { fillFromClass } from "../lib/class-color";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { Kbd } from "./kbd";

/** One selectable row of the palette. */
export type CommandItem = {
  /** Stable identity and the React key of the row; keep it unique across the palette. */
  value: string;
  /** Row text; the query also matches it, together with `keywords`. */
  label: string;
  /** Extra search terms that are not shown, such as an abbreviation or a path. */
  keywords?: string;
  /** 28pt leading tile: an initial or a 16pt icon. */
  tile?: ReactNode;
  /** Tile fill as react's background class, such as "bg-sky-500"; resolved against the tokens. Defaults to the primary fill. */
  tileClassName?: string;
  /** Caption after the label, such as the workspace. */
  meta?: ReactNode;
  /** Right-side hint, usually `<Kbd>`; a touch device has no keys to press, so it is paired with `hints`. */
  hint?: ReactNode;
  /** Runs when the row is pressed, before the palette closes itself. */
  onSelect?: () => void;
};

/** A titled block of rows; groups are rendered in the order given. */
export type CommandGroup = {
  /** Section heading, `caption` secondary text above the rows. */
  label: string;
  /** Rows of this section. */
  items: CommandItem[];
};

/** The open state {@link CommandPalette} publishes to {@link CommandPaletteBody}. */
type PaletteSet = {
  /** Closes the palette, which a row select does after its own callback. */
  close: () => void;
};

const PaletteContext = createContext<PaletteSet>({ close: () => undefined });

/** Props for {@link CommandPalette}: the dialog state, the grouped rows and the footer hints. */
export type CommandPaletteProps = {
  /** Controlled open state; leave it out to let the palette open from its `trigger`. */
  open?: boolean;
  /** Called with the next open state when the palette opens, closes on the back button or a scrim press. */
  onOpenChange?: (open: boolean) => void;
  /** Sections of rows, in render order. */
  groups: CommandGroup[];
  /** Search field placeholder; it also names the dialog for assistive technology. @default "Search" */
  placeholder?: string;
  /** Shown when the query has no matches; defaults to "No results". */
  empty?: ReactNode;
  /** Footer key hints, such as `[["↑↓", "Move"], ["↵", "Open"]]`. */
  hints?: [ReactNode, string][];
  /** Opener content, rendered inside a pressable view that opens the palette; a `Button` or a label works. */
  trigger?: ReactNode;
  /**
   * `solid` (default) is an opaque palette with a default border. `glass` puts it on the veil.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Layout of the popup, merged after its own. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma `Command palette` (110:676): a 560pt palette, 24pt corners, with a 48pt search row, grouped
 * 44pt results and a key-hint footer.
 *
 * React runs it as a Base UI dialog on a 32% scrim with a 6px blur, anchored 96pt from the top of the
 * viewport rather than centred. An RN `Modal` (transparent) carries the scrim and the top-anchored
 * palette, so the Android back button closes it through `onRequestClose` and a scrim press closes it like
 * an outside click. It always renders {@link CommandPaletteBody} with its own close control — an `esc`
 * chip where a keyboard is reachable, a 44pt `X` tile on a touch screen — and every row select reports
 * `onOpenChange(false)`. `trigger` renders inside one pressable view, because React Native cannot attach a
 * handler to an arbitrary element.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <CommandPalette
 *   open={open}
 *   onOpenChange={setOpen}
 *   trigger={<Button variant="solid">Search</Button>}
 *   groups={[{ label: "Bots", items: [{ value: "weekly", label: "Weekly digest", meta: "Product" }] }]}
 * />
 * ```
 */
export function CommandPalette({
  open: openProp,
  onOpenChange,
  groups,
  placeholder = "Search",
  empty,
  hints,
  trigger,
  surface = "solid",
  style,
}: CommandPaletteProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const window = useWindowDimensions();
  const [innerOpen, setInnerOpen] = useState(false);
  const open = openProp ?? innerOpen;
  const [progress] = useState(() => new Animated.Value(0));

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  useEffect(() => {
    if (!open) {
      progress.setValue(0);
      return undefined;
    }
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.popIn + 20,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [open, theme.reducedMotion, progress]);

  const close = useCallback(() => setOpen(false), [setOpen]);
  const context = useMemo<PaletteSet>(() => ({ close }), [close]);
  const closeControl = (
    <HoronPressable
      role="button"
      accessibilityLabel="Close"
      onPress={close}
      pressScale
      style={styles.closeTile}
    >
      <X size={16} color={theme.color("text-secondary")} />
    </HoronPressable>
  );

  return (
    <>
      {trigger === undefined || trigger === null ? null : (
        <HoronPressable role="button" accessibilityLabel={placeholder} onPress={() => setOpen(true)} style={styles.trigger}>
          {typeof trigger === "string" || typeof trigger === "number" ? (
            <HoronText variant="label-md">{trigger}</HoronText>
          ) : (
            trigger
          )}
        </HoronPressable>
      )}
      {open ? (
        <Modal
          transparent
          visible
          animationType="none"
          statusBarTranslucent
          onRequestClose={close}
          supportedOrientations={["portrait", "landscape"]}
        >
          <View
            style={[styles.host, { paddingTop: insets.top + spacing["2"] }]}
            accessibilityViewIsModal
            accessibilityLabel={placeholder}
          >
            <HoronPressable
              haptic="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              onPress={close}
              style={[styles.scrim, { backgroundColor: theme.color("bg-scrim") }]}
            />
            <Animated.View
              style={[
                styles.popup,
                {
                  maxWidth: 560,
                  opacity: progress,
                  transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
                },
                surface === "glass"
                  ? undefined
                  : {
                      backgroundColor: theme.color("bg-surface"),
                      borderWidth: 1,
                      borderColor: theme.color("border-default"),
                      boxShadow: shadow.palette,
                    },
                style,
              ]}
            >
              {surface === "glass" ? (
                <GlassSurface material="veil" radius={radius.xl} style={StyleSheet.absoluteFill} pointerEvents="none" />
              ) : null}
              <PaletteContext.Provider value={context}>
                <CommandPaletteBody
                  groups={groups}
                  placeholder={placeholder}
                  empty={empty}
                  closeControl={closeControl}
                  onSelect={close}
                />
              </PaletteContext.Provider>
              {hints && hints.length > 0 ? (
                <View style={[styles.hints, { maxHeight: window.height * 0.2 }]}>
                  {hints.map(([key, label]) => (
                    <View key={label} style={styles.hint}>
                      <Kbd>{key}</Kbd>
                      <HoronText variant="caption" tone="text-secondary">
                        {label}
                      </HoronText>
                    </View>
                  ))}
                </View>
              ) : null}
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

/** Props for {@link CommandPaletteBody}: the rows plus the close control and the select callback the host owns. */
export type CommandPaletteBodyProps = {
  /** Sections of rows, in render order. */
  groups: CommandGroup[];
  /** Search field placeholder. @default "Search" */
  placeholder?: string;
  /** Shown when the query has no matches. @default "No results" */
  empty?: ReactNode;
  /** Accessible name of the fallback close button, used when no `closeControl` is passed. @default "Close" */
  closeLabel?: string;
  /** A ready close control; the palette passes its own so uncontrolled palettes still close. */
  closeControl?: ReactNode;
  /** Makes the fallback close button close the palette; without both this and `closeControl` no button renders. */
  onClose?: () => void;
  /** Called after a row's own `onSelect`, so the host can close its dialog. */
  onSelect?: () => void;
};

/**
 * The search row, groups and result rows of a command palette.
 *
 * Part of {@link CommandPalette}. React wraps a Base UI `Autocomplete` that is always open and inline,
 * with arrow keys moving a highlight. A touch screen has no arrow keys, so the same tree is a plain
 * filtered list: the query matches label plus keywords (case-insensitive) and the rows are pressed. This
 * part owns no dialog state, which is why its close control and `onSelect` come from the host.
 */
export function CommandPaletteBody({
  groups,
  placeholder = "Search",
  empty = "No results",
  closeLabel = "Close",
  closeControl,
  onClose,
  onSelect,
}: CommandPaletteBodyProps) {
  const theme = useHoronTheme();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const visible = groups
    .map((group) => ({
      label: group.label,
      items: needle
        ? group.items.filter((item) =>
            [item.label, item.keywords ?? ""].some((text) => text.toLowerCase().includes(needle)),
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <View style={styles.body}>
      <View style={styles.searchRow}>
        <View style={styles.searchIcon}>
          <MagnifyingGlass size={20} color={theme.color("text-secondary")} />
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={theme.color("text-secondary")}
          accessibilityLabel={placeholder}
          autoCorrect={false}
          autoCapitalize="none"
          style={[styles.input, theme.text("body-sm"), { color: theme.color("text-primary") }]}
        />
        {closeControl ??
          (onClose === undefined ? null : (
            <HoronPressable role="button" accessibilityLabel={closeLabel} onPress={onClose} style={styles.closeTile}>
              <X size={16} color={theme.color("text-secondary")} />
            </HoronPressable>
          ))}
      </View>
      <View style={styles.ruleWrap}>
        <View style={[styles.rule, { backgroundColor: theme.color("overlay-ink-8") }]} />
      </View>
      {visible.length === 0 ? (
        <View style={styles.empty}>
          <HoronText variant="body-sm" tone="text-secondary">
            {empty}
          </HoronText>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {visible.map((group) => (
            <View key={group.label} style={styles.group}>
              <View style={styles.groupLabel}>
                <HoronText variant="caption" tone="text-secondary">
                  {group.label}
                </HoronText>
              </View>
              {group.items.map((item) => (
                <CommandRow
                  key={item.value}
                  item={item}
                  onPress={() => {
                    item.onSelect?.();
                    onSelect?.();
                  }}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/** One result row: the tile, the label, the caption and, where a keyboard exists, the key hint. */
function CommandRow({ item, onPress }: { item: CommandItem; onPress: () => void }) {
  const theme = useHoronTheme();
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={item.label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: theme.color("overlay-ink-6") }]}
    >
      {item.tile === undefined ? null : (
        <View style={[styles.tile, { backgroundColor: fillFromClass(theme, item.tileClassName, "interactive-primary") }]}>
          {typeof item.tile === "string" || typeof item.tile === "number" ? (
            <HoronText variant="label-sm" tone="interactive-on-primary">
              {item.tile}
            </HoronText>
          ) : (
            item.tile
          )}
        </View>
      )}
      <HoronText variant="label-md" numberOfLines={1} style={styles.rowLabel}>
        {item.label}
      </HoronText>
      {item.meta === undefined ? null : (
        <HoronText variant="caption" tone="text-secondary">
          {item.meta}
        </HoronText>
      )}
      <View style={styles.spacer} />
      {item.hint === undefined ? null : <View style={styles.rowHint}>{item.hint}</View>}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  trigger: { alignSelf: "flex-start" },
  host: { flex: 1, alignItems: "center", paddingHorizontal: spacing["2"] },
  scrim: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.32 },
  popup: {
    width: "100%",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    padding: spacing["1.5"],
  },
  body: { flexDirection: "column" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    paddingHorizontal: spacing["3"],
    height: 48,
  },
  searchIcon: { width: 28, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, minWidth: 0, paddingVertical: 0 },
  closeTile: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  ruleWrap: { paddingTop: spacing["1"] },
  rule: { height: 1 },
  empty: { paddingHorizontal: spacing["3"], paddingVertical: spacing["4"] },
  list: { maxHeight: 384, flexShrink: 1 },
  listContent: { paddingTop: spacing["1"] },
  group: { flexDirection: "column", paddingTop: spacing["1"] },
  groupLabel: { paddingHorizontal: spacing["3"], paddingTop: spacing["1"], paddingBottom: spacing["1"] },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    minHeight: 44,
    borderRadius: radius.sm,
    paddingHorizontal: spacing["3"],
  },
  rowLabel: { flexShrink: 1 },
  spacer: { flex: 1 },
  rowHint: { flexShrink: 0, flexDirection: "row", alignItems: "center" },
  tile: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  hints: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: spacing["4"],
    rowGap: spacing["1"],
    paddingHorizontal: spacing["3"],
    paddingTop: spacing["2"],
    paddingBottom: spacing["1"],
  },
  hint: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
});
