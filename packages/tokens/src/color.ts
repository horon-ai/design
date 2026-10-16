/**
 * Minimal OKLCH -> sRGB conversion so the design tokens can live in one place
 * (OKLCH, which is what the CSS side wants) and still be handed to React Native,
 * which only understands hex / rgb() values.
 */

export type Rgba = { r: number; g: number; b: number; a: number }

const clamp = (n: number, min: number, max: number) =>
	Math.min(max, Math.max(min, n))

function linearToSrgb(x: number): number {
	const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
	return clamp(Math.round(v * 255), 0, 255)
}

/** Parse `oklch(L C H)` or `oklch(L C H / A)`; L and A may be percentages. */
export function parseOklch(
	input: string
): { l: number; c: number; h: number; a: number } | null {
	const match = input.trim().match(/^oklch\(\s*([^)]+?)\s*\)$/i)
	if (!match) return null

	const [head, alphaPart] = match[1].split("/")
	const parts = head.trim().split(/\s+/)
	if (parts.length < 3) return null

	const l = parts[0].endsWith("%")
		? parseFloat(parts[0]) / 100
		: parseFloat(parts[0])
	const c = parts[1].endsWith("%")
		? (parseFloat(parts[1]) / 100) * 0.4
		: parseFloat(parts[1])
	const h = parseFloat(parts[2])
	const a = alphaPart
		? alphaPart.trim().endsWith("%")
			? parseFloat(alphaPart.trim()) / 100
			: parseFloat(alphaPart.trim())
		: 1

	if ([l, c, h, a].some((n) => Number.isNaN(n))) return null
	return { l, c, h, a }
}

export function oklchToRgba(input: string): Rgba {
	const parsed = parseOklch(input)
	if (!parsed) throw new Error(`@horon/tokens: unsupported color value "${input}"`)
	const { l, c, h, a } = parsed

	const hRad = (h * Math.PI) / 180
	const aLab = c * Math.cos(hRad)
	const bLab = c * Math.sin(hRad)

	// Cone response (LMS) before the cube: the linear-sRGB conversion below
	// expects the cubed values, so the intermediate names carry the cube.
	const lLinear = l + 0.3963377774 * aLab + 0.2158037573 * bLab
	const mLinear = l - 0.1055613458 * aLab - 0.0638541728 * bLab
	const sLinear = l - 0.0894841775 * aLab - 1.291485548 * bLab

	const l3 = lLinear ** 3
	const m3 = mLinear ** 3
	const s3 = sLinear ** 3

	const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
	const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
	const b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

	return {
		r: linearToSrgb(r),
		g: linearToSrgb(g),
		b: linearToSrgb(b),
		a: clamp(a, 0, 1),
	}
}

const hex = (n: number) => n.toString(16).padStart(2, "0")

/** React Native friendly string: `#rrggbb`, or `#rrggbbaa` when translucent. */
export function oklchToHex(input: string): string {
	const { r, g, b, a } = oklchToRgba(input)
	if (a >= 1) return `#${hex(r)}${hex(g)}${hex(b)}`
	return `#${hex(r)}${hex(g)}${hex(b)}${hex(Math.round(a * 255))}`
}

export function oklchToRgbString(input: string): string {
	const { r, g, b, a } = oklchToRgba(input)
	return a >= 1
		? `rgb(${r}, ${g}, ${b})`
		: `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`
}
