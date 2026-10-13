import { oklchToHex } from "./color"
import { colorTokens, type ColorScheme, type ColorTokenName } from "./tokens"
import {
	breakpoint,
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
