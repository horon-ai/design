import { useEffect, useState, type ReactNode } from "react";
import { Animated, Image, ScrollView, StyleSheet, View, type ViewProps } from "react-native";
import { Copy, FileText, IconContext, X } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { GlassSurface } from "../lib/glass-surface";
import { useIconContext } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";
import { IconButton } from "./icon-button";

/**
 * Figma `Date separator` (Message extras 109:667): caption between two 10% ink lines.
 *
 * A `separator` row for screen readers, with the caption set in the caption token.
 */
export function DateSeparator({
  children,
}: {
  /** Caption text between the rules, such as "Today" or "Mar 4". */
  children: ReactNode;
}) {
  const theme = useHoronTheme();
  return (
    <View role="separator" style={[styles.separator, { gap: spacing["3"] }]}>
      <View style={[styles.rule, { backgroundColor: theme.color("overlay-ink-10") }]} />
      <HoronText variant="caption" tone="text-secondary">
        {children}
      </HoronText>
      <View style={[styles.rule, { backgroundColor: theme.color("overlay-ink-10") }]} />
    </View>
  );
}

/** One button of a {@link MessageActions} pill. */
export type MessageAction = {
  /** Accessible label of the button; also its React key, so keep labels unique within a pill. */
  label: string;
  /** 16pt glyph; the pill sizes the icon through its context. */
  icon: ReactNode;
  /** Fires on press. */
  onClick?: () => void;
};

/**
 * Figma `Message actions` (109:667): a pill of 30pt icon buttons with 16pt icons, solid or regular glass.
 *
 * The pill announces itself as a `toolbar`; each button is named by its action's
 * label and paints the 6% ink wash while pressed, with a 44pt hit area around the
 * 30pt disc. With `surface="glass"` the pill is the regular glass material and the
 * buttons sit on top of it.
 *
 * @example
 * ```tsx
 * <MessageActions
 *   actions={[
 *     { label: "Copy", icon: <Copy />, onClick: () => copy(text) },
 *     { label: "Regenerate", icon: <ArrowClockwise />, onClick: regenerate },
 *   ]}
 * />
 * ```
 */
export function MessageActions({
  actions,
  surface = "solid",
}: {
  /** Buttons of the pill, rendered in order; each needs a unique label. */
  actions: MessageAction[];
  /** `solid` (default) is an opaque surface pill with a default border; `glass` is the regular glass pill. @default "solid" */
  surface?: "solid" | "glass";
}) {
  const theme = useHoronTheme();
  const layout = [styles.actions, { padding: 3, gap: spacing["0.5"] }];
  const icon = useIconContext({ size: 16, color: theme.color("text-secondary") });
  const buttons = (
    <IconContext.Provider value={icon}>
      {actions.map((action) => (
        <HoronPressable
          key={action.label}
          pressScale
          role="button"
          accessibilityLabel={action.label}
          onPress={action.onClick}
          hitSlop={touchSlop(theme.touch, 30)}
          style={({ pressed }) => [
            styles.action,
            pressed && { backgroundColor: theme.color("overlay-ink-6") },
          ]}
        >
          {action.icon}
        </HoronPressable>
      ))}
    </IconContext.Provider>
  );

  if (surface === "glass") {
    return (
      <GlassSurface role="toolbar" tier="regular" radius={radius.full} style={[layout, styles.selfStart]}>
        {buttons}
      </GlassSurface>
    );
  }
  return (
    <View
      role="toolbar"
      style={[
        ...layout,
        styles.selfStart,
        styles.border,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
      ]}
    >
      {buttons}
    </View>
  );
}

/** Props for {@link Attachment}: what the file is, how it looks and whether it can be removed. */
export type AttachmentProps = {
  /** File name, truncated to one line. */
  name: ReactNode;
  /** Caption, such as "PDF · 2.4 MB". */
  detail?: ReactNode;
  /** Image thumbnail URL; files show a document icon on a sky tile. */
  thumbnail?: string;
  /** Renders the 32pt remove button when set. */
  onRemove?: () => void;
  /** Accessible label of the remove button.
   * @default "Remove" */
  removeLabel?: string;

};

/**
 * Figma `Attachment` (109:667): a flat subtle card with a 40pt thumb, name, detail and remove button.
 *
 * The thumbnail is cropped to fill the 40pt tile the way react's `background-size:
 * cover` did; without one the tile carries the document glyph on the sky wash. The
 * name and the detail each stay on one line.
 *
 * @example
 * ```tsx
 * <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => remove()} />
 * ```
 */
export function Attachment({
  name,
  detail,
  thumbnail,
  onRemove,
  removeLabel = "Remove",
}: AttachmentProps) {
  const theme = useHoronTheme();
  // `motion-rise`: attachments enter with the same 220ms fade and 4pt lift as a bubble.
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return undefined;
    }
    const step = Animated.timing(rise, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    step.start();
    return () => step.stop();
  }, [rise, theme.reducedMotion]);

  return (
    <Animated.View
      style={[
        styles.attachment,
        {
          gap: spacing["2.5"],
          backgroundColor: theme.color("bg-subtle"),
          opacity: rise,
          transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
      ]}
    >
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          resizeMode="cover"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.tile}
        />
      ) : (
        <View
          style={[styles.tile, styles.tileGlyph, { backgroundColor: theme.color("accent-sky-500-16") }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <FileText size={20} color={theme.color("text-brand")} />
        </View>
      )}
      <View style={styles.attachmentText}>
        <HoronText variant="label-md" numberOfLines={1}>
          {name}
        </HoronText>
        {detail ? (
          <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
            {detail}
          </HoronText>
        ) : null}
      </View>
      {onRemove && (
        <IconButton size="sm" icon={<X />} label={removeLabel} onPress={onRemove} variant="quiet" />
      )}
    </Animated.View>
  );
}

/** Props for {@link CodeBlock}: the code text, its language caption and the copy-button labels. */
export type CodeBlockProps = Omit<ViewProps, "children" | "style"> & {
  /** Source text, rendered verbatim inside a horizontal scroller. */
  code: string;
  /** Caption in the header bar, such as "tsx"; the space is kept even when empty. */
  language?: string;
  /** Copy-button text before the copy succeeds.
   * @default "Copy" */
  copyLabel?: string;
  /** Copy-button text for 1500ms after a successful copy.
   * @default "Copied" */
  copiedLabel?: string;

};

/**
 * Figma `Code block` (109:667): ink surface, 14pt radius, 6% header with copy, Geist Mono 13/20 code.
 *
 * The header keeps the language caption and a copy button that writes through
 * `expo-clipboard` and reads `copiedLabel` for 1500ms; the code is one mono text
 * inside a horizontal scroller, so an over-wide line scrolls instead of wrapping.
 *
 * @example
 * ```tsx
 * <CodeBlock language="bash" code={"horon routine run weekly-report"} />
 * ```
 */
export function CodeBlock({ code, language, copyLabel = "Copy", copiedLabel = "Copied", ...props }: CodeBlockProps) {
  const theme = useHoronTheme();
  const { copied, copy } = useCopyToClipboard(1500);
  return (
    <View {...props} style={[styles.code, { backgroundColor: theme.color("surface-ink") }]}>
      <View style={[styles.codeHeader, { backgroundColor: theme.color("bg-surface-6") }]}>
        <View style={styles.codeLanguage}>
          <HoronText variant="caption" tone="text-on-ink" style={styles.dim}>
            {language}
          </HoronText>
        </View>
        <HoronPressable
          pressScale
          role="button"
          accessibilityLabel={copied ? copiedLabel : copyLabel}
          onPress={() => copy(code)}
          hitSlop={touchSlop(theme.touch, 20)}
          style={({ pressed }) => [styles.copy, pressed && styles.dim]}
        >
          <Copy size={14} color={theme.color("text-on-ink")} />
          <View style={styles.copyLabel}>
            <HoronText variant="caption" tone="text-on-ink">
              {copied ? copiedLabel : copyLabel}
            </HoronText>
          </View>
        </HoronPressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.codeBody}>
        <HoronText variant="code" tone="text-on-ink">
          {code}
        </HoronText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: { flexDirection: "row", alignItems: "center" },
  rule: { flex: 1, height: 1 },
  selfStart: { alignSelf: "flex-start" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  border: { borderWidth: 1 },
  action: { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  attachment: {
    width: "100%",
    maxWidth: 280,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing["2"],
  },
  tile: { width: 40, height: 40, flexShrink: 0, borderRadius: radius.md, borderCurve: "continuous" },
  tileGlyph: { alignItems: "center", justifyContent: "center" },
  attachmentText: { flex: 1, minWidth: 0, gap: 1 },
  code: { borderRadius: radius.lg, borderCurve: "continuous", overflow: "hidden" },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    paddingVertical: spacing["2"],
    paddingHorizontal: spacing["3.5"],
  },
  codeLanguage: { flex: 1, minWidth: 0 },
  dim: { opacity: 0.7 },
  copy: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  copyLabel: { minWidth: 40 },
  codeBody: { paddingHorizontal: spacing["3.5"], paddingTop: spacing["3"], paddingBottom: spacing["3.5"] },
});
