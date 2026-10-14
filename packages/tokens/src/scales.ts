/**
 * Non-color scales. Values are plain numbers (pixels) so React Native can use
 * them directly; the CSS generator turns the ones Tailwind needs into rem.
 */

/** 4px base scale, aligned with Tailwind's default spacing scale. */
export const space = {
	0: 0,
	0.5: 2,
	1: 4,
	1.5: 6,
	2: 8,
	2.5: 10,
	3: 12,
	3.5: 14,
	4: 16,
	5: 20,
	6: 24,
	7: 28,
	8: 32,
	9: 36,
	10: 40,
	11: 44,
	12: 48,
	14: 56,
	16: 64,
	20: 80,
	24: 96,
} as const

/** Base radius in rem (14px) - the canvas `radius` token. */
export const radiusRem = 0.875

/** Radius scale in pixels, from the canvas `radius-*` tokens. */
export const radius = {
	none: 0,
	xs: 6,
	sm: 8,
	md: 12,
	lg: 14,
	xl: 20,
	"2xl": 25,
	"3xl": 31,
	"4xl": 36,
	full: 9999,
} as const

export const fontSize = {
	xs: 12,
	sm: 14,
	base: 16,
	lg: 18,
	xl: 20,
	"2xl": 24,
	"3xl": 30,
	"4xl": 36,
} as const

/** Semantic type scale from the canvas `Typography` board. */
export const text = {
	caption: 12,
	body: 14,
	lead: 16,
	subtitle: 18,
	heading: 24,
	display: 36,
	hero: 48,
} as const

export const fontWeight = {
	regular: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
} as const

export const lineHeight = {
	none: 1,
	tight: 1.25,
	snug: 1.375,
	normal: 1.5,
	relaxed: 1.625,
	loose: 2,
} as const

export const letterSpacing = {
	tighter: -0.05,
	tight: -0.025,
	normal: 0,
	wide: 0.025,
	wider: 0.05,
} as const

/**
 * Font families, split by platform. `web` keeps the CSS stacks; `native`
 * exposes single React Native family names (loaded via expo-font in the app),
 * because RN cannot resolve a CSS font-stack string.
 */
export const fontFamily = {
	web: {
		sans: "'Geist Variable', ui-sans-serif, system-ui, sans-serif",
		mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
	},
	native: {
		sans: "Geist",
		mono: "GeistMono",
	},
} as const

/**
 * Elevation, split by platform. `web` is the CSS `box-shadow` string;
 * `native.ios` carries the four RN shadow props and `native.android` the
 * `elevation` level (Android renders shadows through elevation only).
 */
export const shadow = {
	sm: {
		web: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
		native: {
			ios: {
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.05,
				shadowRadius: 2,
				shadowColor: "#000000",
			},
			android: { elevation: 1 },
		},
	},
	md: {
		web: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
		native: {
			ios: {
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 6,
				shadowColor: "#000000",
			},
			android: { elevation: 4 },
		},
	},
	lg: {
		web: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
		native: {
			ios: {
				shadowOffset: { width: 0, height: 10 },
				shadowOpacity: 0.1,
				shadowRadius: 15,
				shadowColor: "#000000",
			},
			android: { elevation: 8 },
		},
	},
} as const

/**
 * Motion durations in milliseconds, mirroring `core/packages/tokens` DURATION.
 * Plain numbers so React Native can use them directly.
 */
export const duration = {
	instant: 50,
	fast: 100,
	normal: 150,
	slow: 200,
	slower: 300,
} as const

/**
 * Motion easing in both platform forms. `web` keeps the CSS keyword /
 * cubic-bezier string; `native` exposes the same curve as a bezier
 * control-point tuple `[x1, y1, x2, y2]` for React Native's `Easing.bezier`.
 */
export const easing = {
	web: {
		default: "ease",
		in: "ease-in",
		out: "ease-out",
		"in-out": "ease-in-out",
		"in-strong": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
		"out-strong": "cubic-bezier(0.165, 0.84, 0.44, 1)",
		"out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
		"out-quint": "cubic-bezier(0.16, 1, 0.3, 1)",
		"in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
	},
	native: {
		default: [0.25, 0.1, 0.25, 1],
		in: [0.42, 0, 1, 1],
		out: [0, 0, 0.58, 1],
		"in-out": [0.42, 0, 0.58, 1],
		"in-strong": [0.895, 0.03, 0.685, 0.22],
		"out-strong": [0.165, 0.84, 0.44, 1],
		"out-cubic": [0.215, 0.61, 0.355, 1],
		"out-quint": [0.16, 1, 0.3, 1],
		"in-out-strong": [0.77, 0, 0.175, 1],
	},
} as const

/**
 * Backdrop-blur radius (px) for glass surfaces. A non-color value, so it lives
 * here rather than in the color token map (which runs through `oklchToHex`).
 */
export const glassBlur = 32

export const zIndex = {
	base: 0,
	dropdown: 1000,
	sticky: 1100,
	overlay: 1300,
	modal: 1400,
	toast: 1700,
} as const

export const breakpoint = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
} as const
