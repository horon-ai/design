import { oklchToHex } from "./color"
import { colorTokens, type ColorScheme, type ColorTokenName } from "./tokens"
import {
	breakpoint,
	duration,
	easing as easingScales,
	fontFamily,
	fontSize,
	fontWeight,
	glassBlur,
	letterSpacing,
	lineHeight,
	radius,
	radiusRem,
	shadow,
	space,
	zIndex,
} from "./scales"

export type ThemeColors = Record<ColorTokenName, string>

function buildColors(scheme: ColorScheme): ThemeColors {
	const entries = Object.entries(colorTokens[scheme]) as [
		ColorTokenName,
		string,
	][]
	return Object.fromEntries(
		entries.map(([name, value]) => [name, oklchToHex(value)])
	) as ThemeColors
}

/** Semantic colors resolved to hex, keyed by scheme. */
export const colors = {
	light: buildColors("light"),
	dark: buildColors("dark"),
} as const

/**
 * Glass surface tokens for React Native: the glass colors as hex, keyed by
 * scheme, plus the backdrop-blur radius (px) from the scales. Glass owns its
 * `foreground`, so it is carried here rather than read from the theme
 * `foreground`.
 */
export const glass = {
	blur: glassBlur,
	light: {
		fill: colors.light["glass-fill"],
		fillStrong: colors.light["glass-fill-strong"],
		fillFrost: colors.light["glass-fill-frost"],
		fillSolid: colors.light["glass-fill-solid"],
		border: colors.light["glass-border"],
		foreground: colors.light["glass-foreground"],
	},
	dark: {
		fill: colors.dark["glass-fill"],
		fillStrong: colors.dark["glass-fill-strong"],
		fillFrost: colors.dark["glass-fill-frost"],
		fillSolid: colors.dark["glass-fill-solid"],
		border: colors.dark["glass-border"],
		foreground: colors.dark["glass-foreground"],
	},
} as const

/**
 * Motion easing as bezier control-point tuples `[x1, y1, x2, y2]`, ready for
 * React Native's `Easing.bezier(...)`. The CSS keyword / cubic-bezier strings
 * stay in the web form (`scales.easing.web`).
 */
export const easing = easingScales.native

export const scales = {
	space,
	radius,
	radiusRem,
	fontSize,
	fontWeight,
	lineHeight,
	letterSpacing,
	fontFamily,
	shadow,
	zIndex,
	breakpoint,
} as const

export const nativeTheme = { colors, ...scales } as const

export type NativeTheme = typeof nativeTheme

export type { ColorScheme, ColorTokenName }

export {
	breakpoint,
	duration,
	fontFamily,
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
	radius,
	radiusRem,
	shadow,
	space,
	zIndex,
}
