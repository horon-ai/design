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
	text,
	zIndex,
} from "./scales"

export type ThemeColors = Record<ColorTokenName, string>

const isColorTokenName = (name: string): name is ColorTokenName =>
	name in colorTokens.light

const colorTokenNames = Object.keys(colorTokens.light).filter(isColorTokenName)

const isThemeColors = (value: Record<string, string>): value is ThemeColors =>
	colorTokenNames.every((name) => typeof value[name] === "string")

function buildColors(scheme: ColorScheme): ThemeColors {
	const theme = colorTokens[scheme]
	const built: Record<string, string> = {}
	for (const name of colorTokenNames) {
		built[name] = oklchToHex(theme[name])
	}
	if (!isThemeColors(built)) {
		throw new Error(`@horon/tokens: color scheme "${scheme}" is incomplete`)
	}
	return built
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
		tint: colors.light["glass-tint"],
		foreground: colors.light["glass-foreground"],
	},
	dark: {
		fill: colors.dark["glass-fill"],
		fillStrong: colors.dark["glass-fill-strong"],
		fillFrost: colors.dark["glass-fill-frost"],
		fillSolid: colors.dark["glass-fill-solid"],
		border: colors.dark["glass-border"],
		tint: colors.dark["glass-tint"],
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
	text,
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
	text,
	zIndex,
}
