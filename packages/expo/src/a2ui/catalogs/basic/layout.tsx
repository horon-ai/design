import { createContext, Fragment, useCallback, useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";

import { BottomSheet, BottomSheetContent } from "../../../components/bottom-sheet";
import { Card } from "../../../components/card";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../../../components/tabs";
import { HoronPressable } from "../../../lib/press";
import { readAccessibility } from "../../runtime/accessibility";
import type { A2uiChildRef, NativeA2uiComponentProps } from "../../runtime/types";
import { ALIGN, JUSTIFY, LAYOUT_GAP, text } from "./shared";

type Props = NativeA2uiComponentProps;

function childRefs(value: unknown): A2uiChildRef[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is A2uiChildRef =>
      typeof item === "string" ||
      (typeof item === "object" && item !== null && "id" in item && typeof item.id === "string"),
  );
}

function refKey(ref: A2uiChildRef): string {
  return typeof ref === "string" ? ref : `${ref.id}@${ref.basePath}`;
}

function isChildRef(value: unknown): value is A2uiChildRef {
  return childRefs([value]).length === 1;
}

/** Children of a Row or Column; `justify: "stretch"` gives each an equal share of the main axis. */
function Children({
  refs,
  stretch,
  buildChild,
}: { refs: A2uiChildRef[]; stretch: boolean } & Pick<Props, "buildChild">) {
  return refs.map((ref) =>
    stretch ? (
      <View key={refKey(ref)} style={styles.stretchChild}>
        {buildChild(ref)}
      </View>
    ) : (
      <Fragment key={refKey(ref)}>{buildChild(ref)}</Fragment>
    ),
  );
}

function flexStyle(props: Record<string, unknown>, direction: "row" | "column"): ViewStyle {
  return {
    flexDirection: direction,
    justifyContent: JUSTIFY[text(props.justify, "start")] ?? "flex-start",
    alignItems: ALIGN[text(props.align, "stretch")] ?? "stretch",
    gap: LAYOUT_GAP,
  };
}

/** `Row`: children side by side. */
export function A2uiRow({ props, buildChild }: Props) {
  return (
    <View style={flexStyle(props, "row")}>
      <Children refs={childRefs(props.children)} stretch={props.justify === "stretch"} buildChild={buildChild} />
    </View>
  );
}

/** `Column`: children stacked. */
export function A2uiColumn({ props, buildChild }: Props) {
  return (
    <View style={flexStyle(props, "column")}>
      <Children refs={childRefs(props.children)} stretch={props.justify === "stretch"} buildChild={buildChild} />
    </View>
  );
}

/** `List`: a stacked list, or a horizontally scrolling strip for `direction: "horizontal"`. */
export function A2uiList({ props, buildChild }: Props) {
  const refs = childRefs(props.children);
  const alignItems = ALIGN[text(props.align, "stretch")] ?? "stretch";
  const items = refs.map((ref) => <Fragment key={refKey(ref)}>{buildChild(ref)}</Fragment>);
  if (props.direction === "horizontal") {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.strip, { alignItems: alignItems === "stretch" ? "stretch" : alignItems }]}
      >
        {items}
      </ScrollView>
    );
  }
  return <View style={{ gap: LAYOUT_GAP, alignItems }}>{items}</View>;
}

/** `Card`: the Horon solid card around one child. */
export function A2uiCard({ props, buildChild }: Props) {
  return <Card>{isChildRef(props.child) ? buildChild(props.child) : null}</Card>;
}

/** `Tabs`: a pill tab bar over the selected tab's child. */
export function A2uiTabs({ props, buildChild }: Props) {
  const tabs = Array.isArray(props.tabs)
    ? props.tabs
        .filter((tab): tab is Record<string, unknown> => typeof tab === "object" && tab !== null)
        .map((tab, index) => ({ value: String(index), title: text(tab.title), child: tab.child }))
    : [];
  if (tabs.length === 0) return null;
  return (
    <Tabs defaultValue="0">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTab key={tab.value} value={tab.value}>
            {tab.title}
          </TabsTab>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsPanel key={tab.value} value={tab.value}>
          {isChildRef(tab.child) ? buildChild(tab.child) : null}
        </TabsPanel>
      ))}
    </Tabs>
  );
}

/**
 * Opens the enclosing `Modal` from its trigger. A basic `Button` used as the trigger calls it when
 * pressed, next to its own action, so a screen reader that activates the button opens the sheet too.
 */
export const ModalTriggerContext = createContext<(() => void) | undefined>(undefined);

/**
 * `Modal`: the trigger opens a Horon bottom sheet holding `content`. The sheet's heading is the
 * modal's `accessibility.label`, since the catalog gives the modal no title of its own.
 */
export function A2uiModal({ props, buildChild }: Props) {
  const [open, setOpen] = useState(false);
  const openSheet = useCallback(() => setOpen(true), []);
  const title = readAccessibility(props).label ?? "";
  let trigger: ReactNode = null;
  if (isChildRef(props.trigger)) trigger = buildChild(props.trigger);
  return (
    <BottomSheet open={open} onOpenChange={setOpen}>
      <ModalTriggerContext.Provider value={openSheet}>
        <HoronPressable onPress={openSheet} accessibilityLabel={title || undefined}>
          {trigger}
        </HoronPressable>
      </ModalTriggerContext.Provider>
      <BottomSheetContent title={title}>
        {isChildRef(props.content) ? buildChild(props.content) : null}
      </BottomSheetContent>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  stretchChild: { flexGrow: 1, flexBasis: 0, minWidth: 0 },
  strip: { flexDirection: "row", gap: LAYOUT_GAP },
});
