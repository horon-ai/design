import { useState, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { CaretDown, Plus, SlidersHorizontal, UploadSimple } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useMediaQuery } from "../hooks/use-media-query";
import { HoronPressable } from "../lib/press";
import { pickFiles, type FileDropFile } from "../lib/pick-files";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";
import { useHoronTheme } from "../provider";
import { PanelPillTabs } from "./bot-instructions-panel";
import { Spinner } from "./spinner";

/** One pill tab of {@link KnowledgeBasePanel}, such as "All" or "Documents". */
export type KnowledgeBaseTab = {
  /** Stable identifier; it is the tab's value and React key. */
  id: string;
  /** Tab text. */
  label: ReactNode;
  /** Optional count drawn in caption colour right of the label. */
  count?: number;
};

/** Props for {@link KnowledgeBasePanel}: header, tabs, indexing state and the dropzone handler. */
export type KnowledgeBasePanelProps = Omit<ViewProps, "children"> & {
  /** Panel heading, rendered as the panel title. */
  title: ReactNode;
  /** The 12/18 line under the title: sources, chunks, bots. */
  meta?: ReactNode;
  /** Pills of the tab tray, in display order. */
  tabs: KnowledgeBaseTab[];
  /** Controlled selected tab id. Leave unset to let the component hold the selection itself. */
  value?: string;
  /** Initial selected tab when uncontrolled. Falls back to the first tab. */
  defaultValue?: string;
  /** Fires with the new tab id when a pill is pressed. */
  onValueChange?: (id: string) => void;
  /** Shows the spinner and "N indexing" at the right of the tabs when above zero.
   * @default 0 */
  indexing?: number;
  /** Fires when the round settings button is pressed; the button always renders. */
  onSettings?: () => void;
  /** Fires when "Add source" is pressed; the button always renders. */
  onAddSource?: () => void;
  /** Called with the files picked from the dropzone. Omit to hide the dropzone. */
  onFiles?: (files: FileDropFile[]) => void;
  /** Headline inside the dropzone.
   * @default "Drop files here, or browse" */
  dropTitle?: ReactNode;
  /** Supporting line under the dropzone headline.
   * @default "PDF, DOCX, Markdown or TXT · Notion, Google Drive and websites from Add source" */
  dropHint?: ReactNode;
  /** Pipeline column labels shown above the list; hidden on narrow widths.
   * @default ["Parse", "Chunk", "Embed", "Index"] */
  stages?: string[];
  /** The list rows, usually `SourceRow variant="list"`. */
  children?: ReactNode;
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_STAGES = ["Parse", "Chunk", "Embed", "Index"];

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Paper `Knowledge base` (XVM-1): a 20pt-radius surface panel with a header, a
 * pill tab tray, a table head, a flat divided source list and a dashed dropzone.
 * The selected tab pill travels in 280ms and the indexing count slides in beside
 * the tabs.
 *
 * React Native has no `dataTransfer`, so the dropzone is a press target: a tap
 * opens the system document picker (`expo-document-picker`, several files at
 * once), the native form of react's label-wrapped file input, and the picked
 * files arrive through `onFiles`. Passing `onFiles` is what makes it appear.
 * The list itself is passed as `children`, so an empty list is simply a panel
 * without rows.
 *
 * @example
 * ```tsx
 * <KnowledgeBasePanel
 *   title="Knowledge base"
 *   meta="3 sources · 128 chunks"
 *   tabs={[{ id: "all", label: "All", count: 3 }]}
 *   indexing={2}
 *   onAddSource={openSourcePicker}
 *   onFiles={upload}
 * >
 *   <SourceRow variant="list" status="ready" icon={<FileText />} name="README.md" detail="24 chunks" />
 * </KnowledgeBasePanel>
 * ```
 */
export function KnowledgeBasePanel({
  title,
  meta,
  tabs,
  value,
  defaultValue,
  onValueChange,
  indexing = 0,
  onSettings,
  onAddSource,
  onFiles,
  dropTitle = "Drop files here, or browse",
  dropHint = "PDF, DOCX, Markdown or TXT · Notion, Google Drive and websites from Add source",
  stages = DEFAULT_STAGES,
  children,
  style,
  ...props
}: KnowledgeBasePanelProps) {
  const theme = useHoronTheme();
  const [inner, setInner] = useState(defaultValue ?? tabs[0]?.id);
  const selectedId = value ?? inner;
  const wide = useMediaQuery("(min-width: 640px)");
  const chrome = theme.touch ? TOUCH_TARGET : 30;

  const select = (id: string) => {
    setInner(id);
    onValueChange?.(id);
  };

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
          {meta ? (
            isText(meta) ? (
              <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                {meta}
              </HoronText>
            ) : (
              meta
            )
          ) : null}
        </View>
        <HoronPressable
          role="button"
          pressScale
          aria-label="Knowledge base settings"
          onPress={onSettings}
          hitSlop={touchSlop(theme.touch, 30, 30)}
          style={({ pressed }) => [
            styles.settings,
            {
              width: theme.touch ? TOUCH_TARGET : 30,
              height: theme.touch ? TOUCH_TARGET : 30,
              backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6"),
            },
          ]}
        >
          <SlidersHorizontal size={16} color={theme.color("text-primary")} />
        </HoronPressable>
        <HoronPressable
          role="button"
          pressScale
          onPress={onAddSource}
          style={({ pressed }) => [
            styles.addSource,
            { height: chrome, backgroundColor: theme.color(pressed ? "overlay-ink-10" : "overlay-ink-6") },
          ]}
        >
          <Plus size={14} color={theme.color("text-primary")} />
          <HoronText variant="label-sm">Add source</HoronText>
          <CaretDown size={12} color={theme.color("text-secondary")} />
        </HoronPressable>
      </View>
      <View style={styles.tabRow}>
        <PanelPillTabs
          aria-label="Sources"
          value={selectedId}
          onValueChange={select}
          items={tabs.map((tab) => ({
            value: tab.id,
            label: (
              <View style={styles.tabLabel}>
                {isText(tab.label) ? (
                  <HoronText variant="label-md" tone={tab.id === selectedId ? "text-primary" : "text-secondary"}>
                    {tab.label}
                  </HoronText>
                ) : (
                  tab.label
                )}
                {tab.count === undefined ? null : (
                  <HoronText variant="caption" tone="text-secondary">
                    {tab.count}
                  </HoronText>
                )}
              </View>
            ),
          }))}
        />
        <View style={styles.spacer} />
        {indexing > 0 ? (
          <View style={styles.indexing}>
            <Spinner size={12} label="Indexing" />
            <HoronText variant="caption" tone="text-secondary">
              {indexing} indexing
            </HoronText>
          </View>
        ) : null}
      </View>
      {wide ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.stages}>
          <HoronText variant="caption" tone="text-secondary" style={styles.sourceColumn}>
            Source
          </HoronText>
          <View style={styles.stageList}>
            {stages.map((stage) => (
              <View key={stage} style={styles.stage}>
                <HoronText variant="caption" tone="text-secondary">
                  {stage}
                </HoronText>
              </View>
            ))}
          </View>
          <View style={styles.trailing} />
        </View>
      ) : null}
      <View style={styles.list}>{children}</View>
      {onFiles ? (
        <HoronPressable
          role="button"
          accessibilityLabel={typeof dropTitle === "string" ? dropTitle : "Add files"}
          accessibilityHint="Opens the file picker"
          onPress={() => {
            void pickFiles({ multiple: true }).then((files) => {
              if (files.length > 0) onFiles(files);
              return files;
            });
          }}
          style={({ pressed }) => [
            styles.dropzone,
            {
              borderColor: theme.color(pressed ? "border-brand" : "overlay-ink-18"),
              backgroundColor: pressed ? theme.color("bg-subtle") : undefined,
            },
          ]}
        >
          <UploadSimple size={18} color={theme.color("text-secondary")} />
          <View style={styles.dropCopy}>
            {isText(dropTitle) ? (
              <HoronText variant="label-md">{dropTitle}</HoronText>
            ) : (
              dropTitle
            )}
            {isText(dropHint) ? (
              <HoronText variant="caption" tone="text-secondary">
                {dropHint}
              </HoronText>
            ) : (
              dropHint
            )}
          </View>
        </HoronPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 800,
    minWidth: 0,
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacing["3"],
    borderWidth: 1,
    borderRadius: radius.xl,
    borderCurve: "continuous",
    paddingHorizontal: spacing["5"],
    paddingVertical: 18,
  },
  header: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"], minWidth: 0 },
  heading: { flexGrow: 1, flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  settings: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  addSource: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingLeft: spacing["3"],
    paddingRight: spacing["2.5"],
  },
  tabRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  tabLabel: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  spacer: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  indexing: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: spacing["2"] },
  stages: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    paddingHorizontal: spacing["2"],
    paddingTop: spacing["2"],
    paddingBottom: spacing["1"],
  },
  sourceColumn: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  stageList: { flexDirection: "row", gap: spacing["1"] },
  stage: { width: 44, height: 16, flexShrink: 0, justifyContent: "center" },
  trailing: { width: 72, flexShrink: 0 },
  list: { flexDirection: "column" },
  dropzone: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
    paddingHorizontal: 18,
    paddingVertical: spacing["4"],
  },
  dropCopy: { flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
});
