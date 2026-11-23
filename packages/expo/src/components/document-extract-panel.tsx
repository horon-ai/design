import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { CaretDown, Check, FilePdf, Minus, Plus, Scan } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { ACTIVE_ICON_WEIGHT } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { DISABLED_OPACITY, TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";
import { useHoronTheme, type ColorToken } from "../provider";
import { PanelPillTabs } from "./bot-instructions-panel";

/** Row state of a plain field: `filled` reads fine, `check` marks a value the extractor is unsure about. */
export type ExtractFieldStatus = "filled" | "check";

/** One extracted scalar value: one row in the Fields view and one entry in the JSON view. */
export type ExtractField = {
  /** Stable identity; confirming a row records this id and drives the footer counters. */
  id: string;
  /** Row label on the left, 100pt wide; also the key in the JSON view. */
  label: string;
  /** The read value, shown truncated in a button-sized pill. */
  value: string;
  /** Field type shown at the row end, for example `Text` or `Date`. */
  type?: string;
  /** `check` marks the value for confirmation: the row takes the danger border and a "Check" caption. */
  status?: ExtractFieldStatus;
};

/** One extracted table: a labelled block with a header row and body rows instead of a single value. */
export type ExtractTable = {
  /** Stable identity, counted like a field in the footer. */
  id: string;
  /** Row label above the table. */
  label: string;
  /** Field type shown at the row end, such as `Table`. */
  type?: string;
  /** Column definitions, in order; a cell reads its column by index. */
  columns: {
    /** Column heading, `caption` secondary text. */
    label: string;
    /** Cell alignment; `end` right-aligns numbers. */
    align?: "start" | "end";
    /** Fixed column width in points; a column without it shares the free width. */
    width?: number;
  }[];
  /** Body rows; each inner array is one row, matched to `columns` by index. */
  rows: string[][];
};

/** A labelled section of the Fields view, grouped under a dot and a heading. */
export type ExtractGroup = {
  /** Stable identity for the React key. */
  id: string;
  /** Section heading, `label-md` primary text. */
  label: string;
  /** Fields and tables of this section, in display order. */
  fields: (ExtractField | ExtractTable)[];
};

/** Props for {@link DocumentExtractPanel}: the sheet to view, the extracted groups and the footer actions. */
export type DocumentExtractPanelProps = Omit<ViewProps, "children"> & {
  /** Document name in the viewer toolbar; `label-md` primary text, truncated. */
  fileName: string;
  /** Page indicator at the right of the toolbar. @default "1 / 1" */
  pageLabel?: string;
  /** The paper sheet content. Wrap fields in `ExtractHighlight` to outline what was read. */
  sheet: ReactNode;
  /** Extracted sections, in display order; the same data feeds the Fields, JSON and Schema views. */
  groups: ExtractGroup[];
  /** Starting zoom the toolbar shows; 70 draws the sheet at its design size (scale 1) and the range is 30–150. @default 70 */
  defaultZoom?: number;
  /** Bot credited in the footer; without it the footer shows no attribution. */
  bot?: {
    /** One-letter mark on the 20pt brand square. */
    initial: string;
    /** Bot name, `caption` secondary text. */
    name: string;
    /** Optional run time appended as "· 12s". */
    elapsed?: string;
  };
  /** Fires when the Extract button is pressed; the panel also bumps its run counter, which remounts the active view and replays its entry animation. */
  onExtract?: () => void;
  /** Fires after Accept all has queued the confirmation of every row, so the confirmed marks land on the next render. */
  onAcceptAll?: () => void;
  /** Makes the file name actionable; without it the name is a plain label. */
  onOpenFile?: () => void;
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** Lowest and highest zoom the toolbar allows, and the step of one press. */
const ZOOM_MIN = 30;
const ZOOM_MAX = 150;
const ZOOM_STEP = 10;
/** The fit zoom: 100% of the sheet box is drawn at this percent, so the default 70 shows it at its design size. */
const ZOOM_FIT = 70;
/** The split breakpoint of react's `@4xl` container query: below it the two columns stack. */
const SPLIT_AT = 896;

/** Outline and fill pairs for {@link ExtractHighlight}. */
const HIGHLIGHT: Record<"sky" | "brand" | "neutral" | "ink", { border: ColorToken; fill: ColorToken }> = {
  sky: { border: "accent-sky-500-90", fill: "accent-sky-500-12" },
  brand: { border: "accent-sky-700-90", fill: "accent-sky-700-12" },
  neutral: { border: "text-placeholder-90", fill: "text-placeholder-12" },
  ink: { border: "interactive-primary", fill: "overlay-ink-12" },
};

/**
 * An outline over a value on the sheet, the 4pt-radius 1.2pt box Paper draws
 * where a field was read.
 *
 * @example
 * ```tsx
 * <ExtractHighlight tone="brand">
 *   <HoronText variant="body-sm">Northwind Supply</HoronText>
 * </ExtractHighlight>
 * ```
 */
export function ExtractHighlight({
  tone = "sky",
  style,
  ...props
}: ViewProps & {
  /** Outline and fill pair: `sky` for a normal read, `brand` for a highlighted one, `neutral` and `ink` for notes. @default "sky" */
  tone?: keyof typeof HIGHLIGHT;
}) {
  const theme = useHoronTheme();
  const paint = HIGHLIGHT[tone];
  return (
    <View
      style={[
        styles.highlight,
        { borderColor: theme.color(paint.border), backgroundColor: theme.color(paint.fill) },
        style,
      ]}
      {...props}
    />
  );
}

function isTable(field: ExtractField | ExtractTable): field is ExtractTable {
  return "rows" in field;
}

/** One hairline between the panel's regions; `vertical` draws it as a column rule for the split layout. */
function Divider({ vertical }: { vertical?: boolean }) {
  const theme = useHoronTheme();
  return (
    <View
      role="separator"
      style={[vertical ? styles.dividerVertical : styles.dividerHorizontal, { backgroundColor: theme.color("overlay-ink-8") }]}
    />
  );
}

/** Fades and lifts an extracted row 4pt, `motion-rise`, after its stagger delay; it lands at once under Reduce Motion. */
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
 * Document extract panel (Paper `YUT-1` / `GWP-0`): a viewer with zoom controls
 * on the left and the extracted fields on the right, with Fields / JSON /
 * Schema views, a per-row confirmation check and an Accept all footer.
 *
 * The two columns split above a 896pt panel width and stack below it, with the
 * viewer column fixed at 540pt. Zoom runs 30–150 in steps of 10, "Fit" returns
 * to 70 (the sheet's design size), and the sheet scales from its top edge, so it
 * never reflows. A field with `status: "check"` renders as a button that
 * confirms that one row; Accept all confirms every row at once. The footer
 * counts filled and unresolved rows, keeps a dot per field and credits the bot
 * when `bot` is set.
 *
 * @example
 * ```tsx
 * <DocumentExtractPanel
 *   fileName="invoice-0424.pdf"
 *   groups={[
 *     {
 *       id: "vendor",
 *       label: "Vendor",
 *       fields: [
 *         { id: "name", label: "Name", value: "Northwind Supply", type: "Text" },
 *         { id: "due", label: "Due", value: "Oct 24, 2026", type: "Date", status: "check" },
 *       ],
 *     },
 *   ]}
 *   sheet={<HoronText variant="title-md">Northwind Supply</HoronText>}
 *   onAcceptAll={() => saveExtraction()}
 * />
 * ```
 */
export function DocumentExtractPanel({
  fileName,
  pageLabel = "1 / 1",
  sheet,
  groups,
  defaultZoom = ZOOM_FIT,
  bot,
  onExtract,
  onAcceptAll,
  onOpenFile,
  style,
  ...props
}: DocumentExtractPanelProps) {
  const theme = useHoronTheme();
  const [zoom, setZoom] = useState(defaultZoom);
  const [view, setView] = useState("fields");
  const [resolved, setResolved] = useState<ReadonlySet<string>>(() => new Set());
  const [run, setRun] = useState(0);
  const [width, setWidth] = useState(0);
  const split = width >= SPLIT_AT;
  const chrome = theme.touch ? TOUCH_TARGET : 30;
  // React grows the zoom buttons to the 44pt touch target on coarse pointers and lets the track follow.
  const step = theme.touch ? TOUCH_TARGET : 24;
  const zoomHeight = step + 6;

  const flat = useMemo(() => groups.flatMap((group) => group.fields), [groups]);
  const total = flat.length;
  const toCheck = flat.filter(
    (field) => !isTable(field) && field.status === "check" && !resolved.has(field.id),
  ).length;
  const filled = total - toCheck;

  const json = useMemo(() => {
    const data: Record<string, unknown> = {};
    for (const field of flat) {
      data[field.label] = isTable(field)
        ? field.rows.map((row) => Object.fromEntries(field.columns.map((column, index) => [column.label, row[index]])))
        : field.value;
    }
    return JSON.stringify(data, null, 2);
  }, [flat]);

  let rowIndex = 0;

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={[
        styles.root,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
      {...props}
    >
      <View style={split ? styles.columnsSplit : styles.columnsStack}>
        <View style={[styles.viewer, split && styles.viewerSplit]}>
          <View style={styles.toolbar}>
            <View style={[styles.fileTile, { backgroundColor: theme.color("overlay-ink-5") }]}>
              <FilePdf size={16} color={theme.color("text-danger")} />
            </View>
            {onOpenFile ? (
              <HoronPressable
                role="button"
                onPress={onOpenFile}
                style={styles.fileButton}
              >
                <HoronText variant="label-md" numberOfLines={1} style={styles.fileName}>
                  {fileName}
                </HoronText>
                <CaretDown size={14} color={theme.color("text-secondary")} />
              </HoronPressable>
            ) : (
              <HoronText variant="label-md" numberOfLines={1} style={styles.fileName}>
                {fileName}
              </HoronText>
            )}
            <View style={styles.spacer} />
            <HoronText variant="caption" tone="text-secondary">
              {pageLabel}
            </HoronText>
            <View style={[styles.zoomTrack, { height: zoomHeight, backgroundColor: theme.color("overlay-ink-5") }]}>
              <HoronPressable
                role="button"
                pressScale
                aria-label="Zoom out"
                disabled={zoom <= ZOOM_MIN}
                hitSlop={touchSlop(theme.touch, step, step)}
                onPress={() => setZoom((value) => Math.max(ZOOM_MIN, value - ZOOM_STEP))}
                style={({ pressed }) => [
                  styles.step,
                  { width: step, height: step },
                  pressed && { backgroundColor: theme.color("overlay-ink-8") },
                  zoom <= ZOOM_MIN && { opacity: DISABLED_OPACITY },
                ]}
              >
                <Minus size={14} color={theme.color(zoom <= ZOOM_MIN ? "text-disabled" : "text-primary")} />
              </HoronPressable>
              <HoronText variant="label-sm" style={styles.zoomLabel}>
                {zoom}%
              </HoronText>
              <HoronPressable
                role="button"
                pressScale
                aria-label="Zoom in"
                disabled={zoom >= ZOOM_MAX}
                hitSlop={touchSlop(theme.touch, step, step)}
                onPress={() => setZoom((value) => Math.min(ZOOM_MAX, value + ZOOM_STEP))}
                style={({ pressed }) => [
                  styles.step,
                  { width: step, height: step },
                  pressed && { backgroundColor: theme.color("overlay-ink-8") },
                  zoom >= ZOOM_MAX && { opacity: DISABLED_OPACITY },
                ]}
              >
                <Plus size={14} color={theme.color(zoom >= ZOOM_MAX ? "text-disabled" : "text-primary")} />
              </HoronPressable>
            </View>
            <HoronPressable
              role="button"
              pressScale
              onPress={() => setZoom(ZOOM_FIT)}
              style={({ pressed }) => [
                styles.fit,
                {
                  height: chrome,
                  backgroundColor: theme.color(pressed ? "overlay-ink-8" : "overlay-ink-6"),
                },
              ]}
            >
              <HoronText variant="label-sm">Fit</HoronText>
            </HoronPressable>
          </View>
          <View style={[styles.viewport, { backgroundColor: theme.color("overlay-ink-7") }]}>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: primitives["neutral-50"],
                  borderColor: theme.color("overlay-ink-8"),
                  boxShadow: `0 2px 4px 0 ${theme.color("overlay-ink-8")}`,
                  transform: [{ scale: zoom / ZOOM_FIT }],
                },
              ]}
            >
              {sheet}
            </View>
          </View>
        </View>
        {split ? <Divider vertical /> : null}
        <View style={styles.fields}>
          <View style={styles.toolbar}>
            <PanelPillTabs
              aria-label="Extraction view"
              value={view}
              onValueChange={setView}
              items={[
                { value: "fields", label: "Fields" },
                { value: "json", label: "JSON" },
                { value: "schema", label: "Schema" },
              ]}
            />
            <View style={styles.spacer} />
            <HoronPressable
              role="button"
              pressScale
              onPress={() => {
                setRun((value) => value + 1);
                onExtract?.();
              }}
              style={({ pressed }) => [
                styles.extract,
                {
                  height: chrome,
                  backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
                },
              ]}
            >
              <Scan size={14} color={theme.color("text-primary")} />
              <HoronText variant="label-sm">Extract</HoronText>
            </HoronPressable>
          </View>
          <Divider />
          <View key={`${view}-${run}`} style={styles.content}>
            {view === "fields" ? (
              <>
                <HoronText variant="body-sm" tone="text-secondary">
                  {total} fields read from this document
                </HoronText>
                {groups.map((group) => (
                  <View key={group.id} style={styles.group}>
                    <View style={styles.groupHeader}>
                      <View style={[styles.groupDot, { backgroundColor: primitives["sky-500"] }]} />
                      <HoronText variant="label-md">{group.label}</HoronText>
                    </View>
                    {group.fields.map((field) => {
                      const delay = rowIndex++ * 30;
                      if (isTable(field)) {
                        return (
                          <Rise key={field.id} delay={delay} style={styles.tableBlock}>
                            <View style={styles.fieldLabelRow}>
                              <HoronText variant="body-sm" tone="text-secondary" style={styles.fieldLabel}>
                                {field.label}
                              </HoronText>
                              <View style={styles.spacer} />
                              {field.type ? (
                                <HoronText variant="caption" tone="text-secondary" style={styles.fieldType}>
                                  {field.type}
                                </HoronText>
                              ) : null}
                            </View>
                            <View style={[styles.table, { borderColor: theme.color("overlay-ink-10") }]}>
                              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.tableBody}>
                                  <View style={styles.tableRow}>
                                    {field.columns.map((column) => (
                                      <HoronText
                                        key={column.label}
                                        variant="caption"
                                        tone="text-secondary"
                                        style={[
                                          column.width ? { width: column.width, flexShrink: 0 } : styles.tableCellGrow,
                                          column.align === "end" && styles.alignEnd,
                                        ]}
                                      >
                                        {column.label}
                                      </HoronText>
                                    ))}
                                  </View>
                                  {field.rows.map((row) => (
                                    <View key={row.join("|")} style={styles.tableRow}>
                                      {row.map((cell, index) => {
                                        const column = field.columns[index];
                                        return (
                                          <HoronText
                                            key={column?.label ?? cell}
                                            variant="caption"
                                            style={[
                                              column?.width
                                                ? { width: column.width, flexShrink: 0 }
                                                : styles.tableCellGrow,
                                              column?.align === "end" && styles.alignEnd,
                                            ]}
                                          >
                                            {cell}
                                          </HoronText>
                                        );
                                      })}
                                    </View>
                                  ))}
                                </View>
                              </ScrollView>
                            </View>
                          </Rise>
                        );
                      }
                      const needsCheck = field.status === "check" && !resolved.has(field.id);
                      return (
                        <Rise key={field.id} delay={delay} style={styles.fieldRow}>
                          <HoronText variant="body-sm" tone="text-secondary" style={styles.fieldLabel}>
                            {field.label}
                          </HoronText>
                          <HoronPressable
                            role="button"
                            disabled={!needsCheck}
                            aria-label={needsCheck ? `Confirm ${field.label}` : undefined}
                            onPress={() =>
                              setResolved((previous) => new Set(previous).add(field.id))
                            }
                            style={[
                              styles.value,
                              {
                                minHeight: theme.touch ? TOUCH_TARGET : 36,
                                borderWidth: needsCheck ? 1 : 0,
                                borderColor: theme.color("border-danger"),
                                backgroundColor: theme.color(needsCheck ? "overlay-ink-12" : "overlay-ink-4"),
                              },
                            ]}
                          >
                            <HoronText variant="body-sm" numberOfLines={1} style={styles.valueText}>
                              {field.value}
                            </HoronText>
                            {needsCheck ? (
                              <HoronText variant="caption" tone="text-danger">
                                Check
                              </HoronText>
                            ) : (
                              <Check size={14} weight={ACTIVE_ICON_WEIGHT} color={theme.color("text-secondary")} />
                            )}
                          </HoronPressable>
                          {field.type ? (
                            <HoronText variant="caption" tone="text-secondary" style={styles.fieldType}>
                              {field.type}
                            </HoronText>
                          ) : null}
                        </Rise>
                      );
                    })}
                  </View>
                ))}
              </>
            ) : null}
            {view === "json" ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.json, { backgroundColor: theme.color("overlay-ink-4") }]}>
                  <HoronText variant="code">{json}</HoronText>
                </View>
              </ScrollView>
            ) : null}
            {view === "schema" ? (
              <View style={styles.schema}>
                {flat.map((field) => (
                  <View key={field.id} style={styles.schemaRow}>
                    <HoronText variant="body-sm" tone="text-secondary" style={styles.fieldLabel}>
                      {field.label}
                    </HoronText>
                    <View style={[styles.schemaChip, { backgroundColor: theme.color("overlay-ink-6") }]}>
                      <HoronText variant="caption" tone="text-secondary">
                        {field.type ?? "Text"}
                      </HoronText>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.footer}>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.dots}>
          {flat.map((field) => {
            const unresolved = !isTable(field) && field.status === "check" && !resolved.has(field.id);
            return (
              <View
                key={field.id}
                style={[styles.footerDot, { backgroundColor: unresolved ? primitives["red-500"] : primitives["sky-500"] }]}
              />
            );
          })}
        </View>
        <HoronText variant="body-sm" tone="text-secondary">
          {filled} of {total} filled · {toCheck} to check
        </HoronText>
        <View style={styles.spacer} />
        {bot ? (
          <>
            <View style={[styles.botTile, { backgroundColor: theme.color("interactive-primary") }]}>
              <HoronText variant="label-sm" tone="text-inverse">
                {bot.initial}
              </HoronText>
            </View>
            <HoronText variant="caption" tone="text-secondary">
              {bot.name}
              {bot.elapsed ? ` · ${bot.elapsed}` : ""}
            </HoronText>
          </>
        ) : null}
        <HoronPressable
          role="button"
          pressScale
          onPress={() => {
            setResolved(new Set(flat.map((field) => field.id)));
            onAcceptAll?.();
          }}
          style={({ pressed }) => [
            styles.accept,
            {
              height: chrome,
              backgroundColor: theme.color(pressed ? "interactive-primary-hover" : "interactive-primary"),
            },
          ]}
        >
          <HoronText variant="label-sm" tone="text-inverse">
            Accept all
          </HoronText>
        </HoronPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 1120,
    minWidth: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius.xl,
    borderCurve: "continuous",
  },
  columnsSplit: { flexDirection: "row" },
  columnsStack: { flexDirection: "column" },
  viewer: { minWidth: 0, flexDirection: "column" },
  viewerSplit: { width: 540, flexShrink: 0 },
  fields: { minWidth: 0, flexGrow: 1, flexShrink: 1, flexDirection: "column" },
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing["2"],
    paddingHorizontal: spacing["5"],
    paddingVertical: spacing["3"],
  },
  fileTile: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  fileButton: { minWidth: 0, flexShrink: 1, flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  fileName: { flexShrink: 1, minWidth: 0 },
  spacer: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  zoomTrack: {
    height: 30,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["0.5"],
    borderRadius: radius.full,
    padding: 3,
  },
  step: {
    width: 24,
    height: 24,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  zoomLabel: { width: 36, textAlign: "center" },
  fit: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingLeft: spacing["3"],
    paddingRight: spacing["3.5"],
  },
  extract: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingLeft: spacing["3.5"],
    paddingRight: spacing["3"],
  },
  viewport: {
    minHeight: 480,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
    paddingHorizontal: spacing["6"],
    paddingVertical: spacing["5"],
  },
  sheet: {
    width: "100%",
    maxWidth: 470,
    flexShrink: 0,
    alignSelf: "center",
    flexDirection: "column",
    gap: spacing["3.5"],
    borderWidth: 1,
    paddingHorizontal: spacing["6"],
    paddingTop: spacing["6"],
    paddingBottom: spacing["5"],
    transformOrigin: "top",
  },
  dividerHorizontal: { height: 1, alignSelf: "stretch", flexShrink: 0 },
  dividerVertical: { width: 1, alignSelf: "stretch", flexShrink: 0 },
  content: {
    flexDirection: "column",
    gap: spacing["1.5"],
    paddingHorizontal: spacing["5"],
    paddingTop: spacing["3.5"],
    paddingBottom: spacing["4"],
  },
  group: { flexDirection: "column", gap: spacing["1.5"] },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    paddingTop: spacing["3"],
    paddingBottom: spacing["1"],
  },
  groupDot: { width: 7, height: 7, borderRadius: radius.full },
  fieldRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["3"] },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: spacing["3"] },
  fieldLabel: { width: 100, flexShrink: 0 },
  fieldType: { width: 56, flexShrink: 0, textAlign: "right" },
  value: {
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3"],
  },
  valueText: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  tableBlock: { flexDirection: "column", gap: spacing["1.5"] },
  table: {
    flexDirection: "column",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["3"],
  },
  tableBody: { minWidth: 208, flexDirection: "column" },
  tableRow: { flexDirection: "row", alignItems: "center", gap: spacing["2"], paddingVertical: spacing["2"] },
  tableCellGrow: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  alignEnd: { textAlign: "right" },
  json: {
    borderRadius: radius.md,
    borderCurve: "continuous",
    padding: spacing["3"],
  },
  schema: { flexDirection: "column", gap: spacing["1.5"] },
  schemaRow: { flexDirection: "row", alignItems: "center", gap: spacing["3"] },
  schemaChip: {
    borderRadius: radius.md,
    borderCurve: "continuous",
    paddingHorizontal: spacing["1.5"],
    paddingVertical: 1,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing["3"],
    paddingHorizontal: spacing["5"],
    paddingVertical: spacing["3"],
  },
  dots: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  footerDot: { width: 8, height: 8, borderRadius: radius.full },
  botTile: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xs,
    borderCurve: "continuous",
  },
  accept: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingLeft: spacing["3.5"],
    paddingRight: spacing["3"],
  },
  highlight: {
    flexDirection: "column",
    gap: 1,
    borderWidth: 1.2,
    borderRadius: radius.sm,
    borderCurve: "continuous",
    paddingHorizontal: spacing["1"],
    paddingVertical: spacing["0.5"],
  },
});
