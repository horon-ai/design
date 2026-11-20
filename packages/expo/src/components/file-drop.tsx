import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { UploadSimple } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { HoronPressable } from "../lib/press";
import { pickFiles, type FileDropFile } from "../lib/pick-files";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";
import { Spinner } from "./spinner";

/**
 * How the drop target is painted: `solid` fills it with the raised surface (`bg-surface`), `glass`
 * leaves it transparent on the veil so imagery behind shows through.
 */
export type FileDropSurface = "solid" | "glass";

export type { FileDropFile };

/**
 * Props of {@link FileDrop}: the picker hints react kept from the native file input, plus the
 * target's own state. React's type was `Omit<ComponentProps<"input">, "className" | "type" |
 * "children" | "onDrop"> & { … }`; React Native has no file input and no drag events, so only the
 * picker hints survive that Omit, and the system document picker takes the input's place.
 */
export type FileDropProps = {
  /** Label next to the icon. @default "Drop files here or click to upload" */
  label?: ReactNode;
  /** Shows a spinner in place of the icon while files upload. */
  uploading?: boolean;
  /** Danger rim for a rejected file. */
  rejected?: boolean;
  /** Called with the picked files after the system picker closes; never called while uploading, disabled or cancelled. */
  onFiles?: (files: FileDropFile[]) => void;
  /**
   * `solid` (default) fills the target with the raised surface; `glass` puts it on the veil over imagery.
   * @default "solid"
   */
  surface?: FileDropSurface;
  /** Outer layout of the target, appended last; the target caps at 550pt and never exceeds its parent. */
  style?: StyleProp<ViewStyle>;
  /** Dims the target and ignores taps. */
  disabled?: boolean;
  /** The extension or MIME list the picker accepts, the HTML `accept` syntax (`.pdf,image/*`). */
  accept?: string;
  /** Whether the picker may return several files. */
  multiple?: boolean;
};

/**
 * Paper `File drop` (1VWI-0): a 1.5pt dashed r10 target, icon 16 and a 13/18 500 label centred with
 * gap 8. Dragging keeps the dashed edge and repaints it in the brand border, adds a 1pt inset brand
 * rim and, on `solid`, shifts the fill to `bg-subtle`; no shake or bounce.
 *
 * React Native has no file input and no drag events, so the target is one tappable view: react's
 * drop target becomes a press (a touch-down paints the same brand rim, since there is no drag-over to
 * report), and the tap opens the system document picker (`expo-document-picker`), the native form of
 * clicking react's hidden file input. The picked files, filtered by `accept`, come back through
 * `onFiles`; a cancelled pick reports nothing. While `uploading`, the icon becomes a spinner, taps
 * are ignored and the label fades; `rejected` paints a danger rim. The target is capped at 550pt and
 * never wider than its parent.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { FileDrop } from "@horon-ai/expo";
 *
 * function Example() {
 *   const [uploading, setUploading] = useState(false);
 *   return (
 *     <FileDrop
 *       accept=".pdf,image/*"
 *       multiple
 *       uploading={uploading}
 *       onFiles={(files) => {
 *         setUploading(true);
 *         void upload(files).finally(() => setUploading(false));
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function FileDrop({
  label = "Drop files here or click to upload",
  uploading,
  rejected,
  onFiles,
  surface = "solid",
  style,
  disabled = false,
  accept,
  multiple,
}: FileDropProps) {
  const theme = useHoronTheme();
  const blocked = disabled || uploading;

  const pick = async () => {
    if (blocked) return;
    const files = await pickFiles({ accept, multiple });
    if (files.length > 0) onFiles?.(files);
  };

  return (
    <HoronPressable
      role="button"
      accessibilityLabel={typeof label === "string" ? label : undefined}
      accessibilityState={{ disabled: blocked, busy: !!uploading }}
      accessibilityHint={blocked ? undefined : "Opens the file picker"}
      disabled={blocked}
      onPress={() => void pick()}
      style={({ pressed }) => [
        styles.target,
        { gap: spacing["2"], paddingHorizontal: spacing["4"], paddingVertical: spacing["3"] },
        {
          borderColor: theme.color(rejected ? "border-danger" : pressed ? "border-brand" : "border-dashed"),
          backgroundColor: surface === "solid" ? theme.color(pressed ? "bg-subtle" : "bg-surface") : "transparent",
        },
        rejected
          ? { boxShadow: `inset 0 0 0 1px ${theme.color("border-danger")}` }
          : pressed
            ? { boxShadow: `inset 0 0 0 1px ${theme.color("text-brand")}` }
            : null,
        blocked && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {surface === "glass" ? (
            <GlassSurface
              material="veil"
              radius={radius.md}
              pressed={pressed && !blocked}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={[styles.row, { gap: spacing["2"] }]}>
            {uploading ? (
              // The target already announces `busy`; a second "Uploading" from the spinner would make
              // the button's name depend on its state.
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Spinner size={16} label="Uploading" />
              </View>
            ) : (
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <UploadSimple size={16} color={theme.color(rejected ? "text-danger" : "text-secondary")} />
              </View>
            )}
            <HoronText
              variant="label-md"
              tone={rejected ? "text-danger" : "text-secondary"}
              style={uploading ? styles.faded : undefined}
            >
              {label}
            </HoronText>
          </View>
        </>
      )}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  target: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 550,
    overflow: "hidden",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 10,
    borderCurve: "continuous",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  faded: { opacity: 0.6 },
});
