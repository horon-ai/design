import { Platform, useWindowDimensions, type TextStyle } from "react-native";
import { fontFamily, textStyles } from "@horon-ai/tokens";

import { useHoronTheme, type TextStyleName } from "../provider";

/**
 * The largest OS text-size multiplier a text field follows, the same cap `HoronText` uses. Pass it
 * as `maxFontSizeMultiplier` on the `TextInput` so the field and its line-box maths agree.
 */
export const FIELD_MAX_FONT_SCALE = 2;

/**
 * Each family's natural line height as a multiple of its font size: (hhea ascender − descender +
 * line gap) / units per em, read from the font files the kit ships. iOS sets a text field's glyphs
 * at that height and puts all of a token's extra line height above them, so this is what the
 * multiline correction below has to undo. Unknown families fall back to their token family.
 */
const NATURAL_LINE_HEIGHT: Record<string, number> = {
  [fontFamily.sans[0]]: (1950 + 494) / 2048,
  [fontFamily.mono[0]]: (1005 + 295) / 1000,
};

/**
 * The text style a `TextInput` needs for one type token so typed text and the placeholder sit in
 * the vertical centre of their line, on iOS and Android, at any OS text size.
 *
 * `useHoronTheme().text()` is right for `Text`, which React Native centres inside its line height.
 * A `TextInput` does not:
 *
 * - **Single line**: iOS draws a field with a line height below its centre (measured 3pt for the
 *   placeholder and 7pt for typed text at `body-md`). The field sets the line height to the font's
 *   natural one, so there is no extra leading to misplace, and the box it sits in keeps the control
 *   height and centres it. The line height is set rather than left out: iOS reuses text-field views
 *   between screens, and a reused field keeps the previous field's placeholder line height unless
 *   the new one sets its own.
 * - **Multiline**: the line height stays, because it spaces the lines, but the platforms place the
 *   glyphs inside it unevenly, by half the gap between the token line height and the font's
 *   natural one:
 *   - iOS puts all the extra leading above every line, typed text and placeholder alike, so the
 *     field moves its text up by that half gap.
 *   - Android centres typed lines but draws the placeholder at the top of the line box, so while
 *     the field is `empty` it moves the text down by that half gap.
 *
 *   The move goes through the margins when a parent draws the box, or through `padding` when the
 *   `TextInput` draws its own border and fill.
 * - **Android** font padding is off, so the platform adds nothing on top of the token metrics.
 *
 * One case stays off centre, and the caller decides it: iOS shrinks a single-line placeholder that
 * is wider than the field and keeps it on the full-size baseline, so it sits up to 3pt low under
 * the larger accessibility text sizes. Keep placeholders short enough to fit at those sizes.
 *
 * Add `maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}` on the same `TextInput`, and let the box it
 * sits in centre it (`justifyContent: "center"` or `alignItems: "center"`) with a `minHeight`.
 *
 * @example
 * ```tsx
 * const fieldText = useFieldText("body-md");
 * <TextInput maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE} style={[{ flex: 1 }, fieldText]} />
 * ```
 */
export function useFieldText(
  name: TextStyleName,
  {
    multiline = false,
    empty = false,
    padding = 0,
  }: {
    /** A multiline field keeps the token line height and corrects the platform's line placement. */
    multiline?: boolean;
    /** The field shows its placeholder (no text yet); Android places the placeholder differently. */
    empty?: boolean;
    /** Vertical padding of a `TextInput` that draws its own box; the correction moves inside it. */
    padding?: number;
  } = {},
): TextStyle {
  const theme = useHoronTheme();
  const { fontScale } = useWindowDimensions();
  const { lineHeight, ...face } = theme.text(name);
  const base: TextStyle = {
    ...face,
    paddingTop: padding,
    paddingBottom: padding,
    includeFontPadding: false,
    textAlignVertical: multiline ? "top" : "center",
  };
  const natural =
    (NATURAL_LINE_HEIGHT[face.fontFamily] ?? NATURAL_LINE_HEIGHT[fontFamily[textStyles[name].family][0]]) *
    face.fontSize;
  if (!multiline) return { ...base, lineHeight: natural };
  const scale = Math.min(fontScale, FIELD_MAX_FONT_SCALE);
  // iOS scales the font and the line height alike, so the gap between them scales too. Android's
  // placeholder grows with the font only, so its gap shrinks as the OS text size grows (measured:
  // 2.5pt at `body-md` and 1×, none at 1.6×).
  const offset =
    Platform.OS === "ios"
      ? (-Math.max(0, lineHeight - natural) / 2) * scale
      : empty
        ? Math.max(0, lineHeight - natural * scale) / 2
        : 0;
  if (offset === 0) return { ...base, lineHeight };
  return padding >= Math.abs(offset)
    ? { ...base, lineHeight, paddingTop: padding + offset, paddingBottom: padding - offset }
    : { ...base, lineHeight, marginTop: offset, marginBottom: -offset };
}
