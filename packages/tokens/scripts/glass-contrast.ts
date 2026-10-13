/**
 * WCAG 2.1 contrast check for the glass surface (IS-6).
 *
 * The glass surface owns its own `--glass-foreground` and paints a translucent
 * `--glass-fill` over whatever is behind it. That means the text sits on the
 * COMPOSITE of glass-fill over the backdrop, not on glass-fill alone. This
 * script composites glass-fill over representative real backdrops (a light card,
 * a dark card, a pure-white sheet, and a mid "busy" photo tone) for BOTH themes
 * and reports the contrast ratio of glass-foreground against each composite, so
 * a dark glass sheet that turns muddy over light content is caught before it
 * ships.
 *
 * Run: bun run --filter @horon/tokens contrast
 *      (or: bun run packages/tokens/scripts/glass-contrast.ts)
 * Exits non-zero if any cell is below the 4.5:1 AA threshold.
 */

import { parseOklch } from "../src/color"
import { colorTokens } from "../src/tokens"

const AA = 4.5

/** OKLCH -> gamma-encoded sRGB in 0..255, keeping alpha. */
function oklchToSrgb(input: string) {
	const parsed = parseOklch(input)
	if (!parsed) throw new Error(`unsupported color: ${input}`)
	const { l, c, h, a } = parsed
	const hRad = (h * Math.PI) / 180
	const aLab = c * Math.cos(hRad)
	const bLab = c * Math.sin(hRad)
	const l_ = l + 0.3963377774 * aLab + 0.2158037573 * bLab
	const m_ = l - 0.1055613458 * aLab - 0.0638541728 * bLab
	const s_ = l - 0.0894841775 * aLab - 1.291485548 * bLab
	const l3 = l_ ** 3
	const m3 = m_ ** 3
	const s3 = s_ ** 3
	const lin = [
		4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
		-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
		-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
	]
	const enc = lin.map((x) => {
		const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
		return Math.min(255, Math.max(0, Math.round(v * 255)))
	})
	return { r: enc[0], g: enc[1], b: enc[2], a: Math.min(1, Math.max(0, a)) }
}

// Alpha compositing in gamma-encoded sRGB.
function over(
	fg: { r: number; g: number; b: number; a: number },
	bg: { r: number; g: number; b: number }
) {
	return {
		r: fg.r * fg.a + bg.r * (1 - fg.a),
		g: fg.g * fg.a + bg.g * (1 - fg.a),
		b: fg.b * fg.a + bg.b * (1 - fg.a),
	}
}

function luminance(c: { r: number; g: number; b: number }) {
	const ch = (v: number) => {
		const s = v / 255
		return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
	}
	return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b)
}

function contrast(
	a: { r: number; g: number; b: number },
	b: { r: number; g: number; b: number }
) {
	const la = luminance(a)
	const lb = luminance(b)
	const [hi, lo] = la > lb ? [la, lb] : [lb, la]
	return (hi + 0.05) / (lo + 0.05)
}

/**
 * Representative real backdrops the floating chrome can sit over. The light and
 * dark extremes plus a pure-white sheet and a mid photo tone cover the worst
 * case for each glass sheet: a translucent dark sheet over the lightest
 * backdrop is where light ink loses the most contrast.
 */
const BACKDROPS = [
	{ name: "light card", oklch: colorTokens.light.card },
	{ name: "white sheet", oklch: "oklch(1 0 0)" },
	{ name: "mid busy", oklch: "oklch(0.55 0 0)" },
	{ name: "dark card", oklch: colorTokens.dark.card },
] as const

const FILLS = [
	{ name: "fill", key: "glass-fill" },
	{ name: "fill-strong", key: "glass-fill-strong" },
	{ name: "fill-frost", key: "glass-fill-frost" },
	{ name: "fill-solid", key: "glass-fill-solid" },
] as const

const themes = ["light", "dark"] as const

let failures = 0
let worst = Number.POSITIVE_INFINITY
let worstLabel = ""
const lines: string[] = []

lines.push(
	"WCAG 2.1 contrast of glass-foreground over glass-fill composited on a backdrop"
)
lines.push(`AA threshold: ${AA}:1`)
lines.push("")

for (const theme of themes) {
	const tokens = colorTokens[theme]
	const fg = oklchToSrgb(tokens["glass-foreground"])
	lines.push(
		`## ${theme} theme  (glass-foreground = ${tokens["glass-foreground"]})`
	)
	lines.push("")
	lines.push(`| fill rung | ${BACKDROPS.map((b) => b.name).join(" | ")} |`)
	lines.push(`| --- |${BACKDROPS.map(() => " --- |").join("")}`)
	for (const fill of FILLS) {
		const sheet = oklchToSrgb(tokens[fill.key])
		const cells = BACKDROPS.map((b) => {
			const backdrop = oklchToSrgb(b.oklch)
			const composite = over(sheet, backdrop)
			const ratio = contrast(fg, composite)
			// The AA gate covers every rung, not just the shipping default, so the
			// degraded states stay legible too.
			if (ratio < AA) failures += 1
			if (ratio < worst) {
				worst = ratio
				worstLabel = `${theme}/${fill.name}/${b.name}`
			}
			const mark = ratio >= AA ? "" : " **FAIL**"
			return `${ratio.toFixed(2)}:1${mark}`
		})
		lines.push(`| ${fill.name} | ${cells.join(" | ")} |`)
	}
	lines.push("")
}

lines.push(
	`Worst cell: ${worst.toFixed(2)}:1 at ${worstLabel} (threshold ${AA}:1)`
)
lines.push(
	failures === 0
		? `PASS: every cell >= ${AA}:1`
		: `FAIL: ${failures} cell(s) below ${AA}:1`
)

console.log(lines.join("\n"))
if (failures > 0) process.exit(1)
