import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { Plus } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { GlassSurface } from "../lib/glass-surface";
import { HoronText } from "../lib/text";
import { useHoronTheme } from "../provider";
import { IconButton } from "./icon-button";

/** Props for {@link DirectoryCard}: the tile icon and copy, plus an optional add action. */
export type DirectoryCardProps = Omit<ViewProps, "children"> & {
  /** 20pt icon shown in inverse on the 40pt tile. */
  icon: ReactNode;
  /** Tile label, `label-md` primary text on one truncated line. */
  name: ReactNode;
  /** One line; longer text is truncated. */
  description?: ReactNode;
  /** Adds an `IconButton` with a plus when set; the card shows no button without it. */
  onAdd?: () => void;
  /** Accessible name of the add button (`aria-label`), since it shows only a plus icon. @default "Add" */
  addLabel?: string;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Paper `Directory card` (Settings 1VJJ-0): 40pt tile, name and one-line
 * description, plus an add button.
 *
 * The `glass` surface draws `expo-glass-effect`'s thick tier through
 * {@link GlassSurface}, so it belongs only over imagery or a glass panel. The
 * add button inherits the same surface, which keeps the two materials matched.
 *
 * @example
 * ```tsx
 * <DirectoryCard
 *   icon={<Folder />}
 *   name="Product"
 *   description="Specs, research and launch notes."
 *   onAdd={() => openFolderPicker()}
 *   addLabel="Connect folder"
 * />
 * ```
 */
export function DirectoryCard({
  icon,
  name,
  description,
  onAdd,
  addLabel = "Add",
  surface = "solid",
  style,
  ...props
}: DirectoryCardProps) {
  const theme = useHoronTheme();
  const content = (
    <>
      <View style={[styles.tile, { backgroundColor: primitives["sky-500"] }]}>{icon}</View>
      <View style={styles.body}>
        {isText(name) ? (
          <HoronText variant="label-md" numberOfLines={1}>
            {name}
          </HoronText>
        ) : (
          name
        )}
        {description ? (
          isText(description) ? (
            <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
              {description}
            </HoronText>
          ) : (
            description
          )
        ) : null}
      </View>
      {onAdd ? (
        <IconButton
          variant={surface === "glass" ? "glass" : "solid"}
          size="sm"
          label={addLabel}
          icon={<Plus />}
          onPress={onAdd}
        />
      ) : null}
    </>
  );

  if (surface === "glass") {
    return (
      <GlassSurface tier="thick" radius={radius["2xl"]} style={[styles.root, style]} {...props}>
        {content}
      </GlassSurface>
    );
  }

  return (
    <View
      style={[
        styles.root,
        styles.solid,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
        style,
      ]}
      {...props}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    overflow: "hidden",
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
    paddingVertical: spacing["3"],
    paddingHorizontal: spacing["3"],
  },
  solid: { borderWidth: 1 },
  tile: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  body: { flexGrow: 1, flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
});
