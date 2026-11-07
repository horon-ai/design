import { useReducedMotion } from "../hooks/use-reduced-motion";
import { useColorScheme } from "../hooks/use-color-scheme";
import { cn } from "../lib/cn";
import type { CSSProperties } from "@lynx-js/types";

/**
 * Every knob of the Flue palette. React uploaded each key to a fragment shader as a uniform named `u`
 * plus the capitalised key (`speed` → `uSpeed`); Lynx has no WebGL, so the same shape is kept and the
 * component reads the keys a CSS composition can honour: `bgColor` and `colorA`-`colorD` paint the
 * gradients, `speed` scales every animation, `density` scales the plumes' opacity, `glow` the bloom on the
 * dense end and `vignette` the ground scrim. The remaining keys are accepted so a config written for react
 * still type-checks, but there is no shader here for them to feed.
 */
export type FlueConfig = {
  /** Flat ground color, hex. Painted on the wrapper, so it is also the fallback when WebGL2 is unavailable. */
  bgColor: string;
  /** Faintest ramp stop, a near-ground tint that only the thinnest smoke reaches. */
  colorA: string;
  /** Second ramp stop: the first visible blue of the plume. */
  colorB: string;
  /** Third ramp stop: the dense body of the plume. */
  colorC: string;
  /** Densest ramp stop, also the glow color at high density. */
  colorD: string;
  /** Zoom of the base noise field; larger values make the smoke finer and busier. */
  scale: number;
  /** Time multiplier, so the drift speed follows it. Larger values scroll faster. */
  speed: number;
  /** Vertical advection added to the curl field per second, the internal flow of the plume. */
  flow: number;
  /** Gain of each fbm octave (0..1); lower values keep the coarse shape dominant. */
  roughness: number;
  /** Frequency step between fbm octaves; larger values add detail at smaller and smaller scale. */
  lacunarity: number;
  /** Zoom of the density field: larger values make individual wisps smaller. */
  smokeScale: number;
  /** Amount of curl-noise displacement; higher values swirl the smoke more. */
  curl: number;
  /** Zoom of the curl potential field, so the swirls themselves change size. */
  curlScale: number;
  /** Upward drift of the smoke in uv per second. */
  rise: number;
  /** Vertical frequency multiplier for the density field; larger values compress the wisps vertically. */
  slender: number;
  /** Half-width (uv) of the vertical corridor the plume is allowed to fill. */
  width: number;
  /** How much the corridor widens from the bottom to the top of the frame. */
  spread: number;
  /** How far the pointer's x pushes the top of the plume sideways. */
  lean: number;
  /** Overall density multiplier before the threshold. */
  density: number;
  /** Gain around `midpoint`: higher values give a harder edge between ground and smoke. */
  contrast: number;
  /** Threshold (0..1) where smoke starts to show; higher values leave more of the ground bare. */
  midpoint: number;
  /** Strength of the `colorD` bloom on the densest part, added as `pow(f, 4)`. */
  glow: number;
  /** Smoothstep width, over the density value, at which the ground gives way to the ramp; 0 floors at 0.01. */
  sink: number;
  /** Film-grain strength; 0 turns grain off. */
  grain: number;
  /** Grain refresh multiplier (24 steps per second at 1); 0 holds one static grain field. */
  grainAnim: number;
  /** Triangle-dither amplitude added to every channel to stop gradient banding. */
  dither: number;
  /** Corner darkening; multiplied by the squared uv distance from the centre. */
  vignette: number;
  /** 1 lets the smoke follow the real pointer; 0 (default) ignores it and a slow virtual pointer sways the smoke. */
  cursor: number;
  /** Radius (uv) of the pointer trail's gaussian falloff. */
  pointerRadius: number;
  /** How strongly the pointer's velocity drags the smoke along, through the trail. */
  draft: number;
  /** How much the pointer trail brightens the density, added as `trail * 0.30 * this`. */
  pointerStrength: number;
  /** How far the whole field shifts against the pointer, in uv. */
  parallax: number;
  /** Device-pixel-ratio cap for the canvas; 1 halves the pixel count on a 2x screen and keeps the fill cheap. */
  maxDpr: number;
};
/**
 * The Horon sky palette for Flue. Recolour through these values only, never the shader.
 *
 * It is a complete `FlueConfig`, so it doubles as the base every variant tunes on top of, and its
 * `cursor: 0` / `maxDpr: 1` keep the default cheap: a still-ish plume at 1x pixel density.
 */
export const FLUE_SKY: FlueConfig = {
  bgColor: "#eef3f8",
  colorA: "#e3ecf6",
  colorB: "#c3d7ea",
  colorC: "#7fa3c6",
  colorD: "#1d3c5e",
  scale: 0.2,
  speed: 0.33,
  flow: 0.04,
  roughness: 0.36,
  lacunarity: 2.55,
  smokeScale: 2.51,
  curl: 0.36,
  curlScale: 0.88,
  rise: 0.03,
  slender: 1.55,
  width: 1.55,
  spread: 1.11,
  lean: 1.25,
  density: 2.15,
  contrast: 1.7,
  midpoint: 0.76,
  glow: 0.53,
  sink: 0.2,
  grain: 0.02,
  grainAnim: 0,
  dither: 1.1,
  vignette: 0.26,
  cursor: 0,
  pointerRadius: 0.84,
  draft: 1.85,
  pointerStrength: 0.16,
  parallax: 0.028,
  maxDpr: 1,
};

/**
 * The night palette for dark mode: near-black ground and blue smoke. Same motion as `FLUE_SKY`.
 *
 * Only the five colors and `glow` differ; every other number is inherited, so light and dark read as the
 * same plume in two lights.
 */
export const FLUE_NIGHT: FlueConfig = {
  ...FLUE_SKY,
  bgColor: "#050608",
  colorA: "#07090d",
  colorB: "#0c1a2c",
  colorC: "#1f4a78",
  colorD: "#4f8fd0",
  glow: 0.35,
};
/** Where the smoke is drawn; each place tunes the motion and colour on top of `FLUE_SKY` / `FLUE_NIGHT`. */
export type FlueVariant = "default" | "sidebar" | "auth";

/** One variant's overrides: values layered over the base palette per scheme, plus the tint laid on top. */
type FlueTuning = {
  /** Overrides applied on top of `FLUE_SKY` in light mode. */
  light: Partial<FlueConfig>;
  /** Overrides applied on top of `FLUE_NIGHT` in dark mode. */
  dark: Partial<FlueConfig>;
  /**
   * Classes for the tint view over the smoke in light mode. React also carried a `dark:` class here;
   * Tailwind v3 emits `dark:` as a media variant that Lynx never matches, so dark mode lays no tint
   * (react's `dark:bg-transparent`) and the choice is made in JS instead.
   */
  tint: string;
};

/**
 * - `default`: no motion overrides, under a regular glass tint in light mode and none in dark.
 * - `sidebar`: a narrow, tall column under the sidebar's glass. The glass blurs the detail away, so the smoke
 *   is calmer and larger, kept low in the column so the nav labels at the top sit on the quiet part. The
 *   smoke paints above the sidebar's own fill, so in light mode the variant lays the thick glass (80% white)
 *   over it: its dense blue band would otherwise drop secondary labels to 2:1. Dark smoke is already dark
 *   enough behind light text, so dark lays nothing.
 * - `auth`: the whole sign-in screen behind a centred card. The plume is wider and rises from the bottom
 *   centre so it frames the card; light mode keeps the pale ground and stops the plume short of the navy
 *   end of the ramp, while dark mode sinks the corners into the night ground.
 */
const FLUE_VARIANTS: Record<FlueVariant, FlueTuning> = {
  default: { light: {}, dark: {}, tint: "bg-glass-regular" },
  sidebar: {
    light: {
      speed: 0.22,
      smokeScale: 1.9,
      density: 1.85,
      contrast: 1.45,
      midpoint: 0.8,
      glow: 0.3,
      vignette: 0,
    },
    dark: {
      speed: 0.22,
      smokeScale: 1.9,
      density: 1.85,
      contrast: 1.5,
      midpoint: 0.8,
      glow: 0.22,
      vignette: 0,
    },
    tint: "bg-glass-thick",
  },
  auth: {
    light: { width: 1.9, spread: 1.3, density: 1.85, midpoint: 0.8, glow: 0.3, vignette: 0 },
    dark: { width: 1.9, spread: 1.3, density: 2.0, midpoint: 0.76, glow: 0.45, vignette: 0.45 },
    tint: "",
  },
};

/** One plume of the composition: where it sits and how it is painted. */
type FlueLayer = {
  /** Position and size classes inside the wrapper; the wrapper is already `absolute inset-0`. */
  className: string;
  /** The plume's ramp, from its dense bottom to its clear top. */
  ramp: (config: FlueConfig) => string;
  /** Share of the palette's density this layer paints at, so a variant can weight its layers. */
  weight: number;
  /** Cycle length in milliseconds before the palette's `speed` divides it. */
  duration: number;
  /** Milliseconds to hold the animation at; a negative value starts it mid-cycle. */
  delay?: number;
};

/**
 * The three compositions. Each is a vertical ramp per plume over the flat ground, so the smoke reads as
 * a rising column without a shader: the dense colour sits at the bottom, the pale stops above it, and
 * nothing at the top.
 */
const FLUE_LAYERS: Record<FlueVariant, FlueLayer[]> = {
  default: [
    {
      className: "left-[-6%] bottom-[-12%] h-[128%] w-[58%]",
      ramp: (config) =>
        `linear-gradient(0deg, ${config.colorD} 0%, ${config.colorC} 30%, ${config.colorB} 62%, transparent 100%)`,
      weight: 1,
      duration: 15000,
    },
    {
      className: "right-[-10%] bottom-[-18%] h-[120%] w-[62%]",
      ramp: (config) => `linear-gradient(0deg, ${config.colorC} 0%, ${config.colorB} 44%, transparent 92%)`,
      weight: 0.75,
      duration: 21000,
      delay: -7000,
    },
    {
      className: "left-[10%] right-[10%] bottom-[-6%] h-[62%]",
      ramp: (config) => `linear-gradient(0deg, ${config.colorD} 0%, transparent 78%)`,
      weight: 0.5,
      duration: 9000,
      delay: -3000,
    },
  ],
  sidebar: [
    {
      className: "left-[-40%] right-[-40%] bottom-[-30%] h-[115%]",
      ramp: (config) =>
        `linear-gradient(0deg, ${config.colorD} 0%, ${config.colorC} 34%, ${config.colorB} 64%, transparent 100%)`,
      weight: 1,
      duration: 18000,
    },
    {
      className: "left-[-20%] right-[-20%] bottom-[-20%] h-[70%]",
      ramp: (config) => `linear-gradient(0deg, ${config.colorC} 0%, ${config.colorB} 48%, transparent 94%)`,
      weight: 0.6,
      duration: 26000,
      delay: -9000,
    },
  ],
  auth: [
    {
      className: "left-[-24%] right-[-24%] bottom-[-24%] h-[120%]",
      ramp: (config) =>
        `linear-gradient(0deg, ${config.colorD} 0%, ${config.colorC} 26%, ${config.colorB} 58%, transparent 100%)`,
      weight: 1,
      duration: 17000,
    },
    {
      className: "left-[6%] right-[6%] bottom-[-12%] h-[82%]",
      ramp: (config) => `linear-gradient(0deg, ${config.colorC} 0%, ${config.colorB} 52%, transparent 96%)`,
      weight: 0.7,
      duration: 24000,
      delay: -8000,
    },
  ],
};

/** The ground scrim: the flat colour at both edges, so the plume fades into the page and never ends hard. */
const groundScrim = (config: FlueConfig): string =>
  `linear-gradient(180deg, ${config.bgColor} 0%, transparent 26%, transparent 68%, ${config.bgColor} 100%)`;

/** Cheap clamp to a sane opacity, so a tuned `density` or `glow` cannot blank the surface. */
const shade = (value: number): number => Math.min(1, Math.max(0.04, value));

export type FlueBackgroundProps = {
  /** Extra classes for the wrapper, which is already `absolute inset-0 -z-10 overflow-hidden`. */
  className?: string;
  /** Inline styles for the wrapper; `backgroundColor` is set from the resolved `bgColor` before these apply. */
  style?: CSSProperties;
  /** `sidebar` under the sidebar glass, `auth` behind the sign-in screen, `default` otherwise. @default "default" */
  variant?: FlueVariant;
  /** Overrides on top of the variant's `FLUE_SKY` (light) or `FLUE_NIGHT` (dark) tuning. */
  config?: Partial<FlueConfig>;
  /** Classes for the tint laid over the smoke; defaults to the variant's tint. */
  tintClassName?: string;
};

/**
 * Flue: an animated smoke gradient drawn with token-colour gradients.
 *
 * React drew this with one fragment shader and a WebGL2 canvas; Lynx has neither, so the plume is a
 * composition of vertical gradient layers that breathe on the existing keyframes (`wave-level` for the
 * growth, `fade-in` for the bloom), scaled by the palette's `speed`. It fills its positioned parent
 * behind the content (the parent needs `relative`) and paints the flat `bgColor` first, so a missing
 * animation still leaves the palette's ground. Light mode paints the white-and-sky `FLUE_SKY`; dark mode
 * paints the black-and-blue `FLUE_NIGHT`; `reducedMotion` freezes every layer on its first frame.
 *
 * The wrapper is `absolute inset-0`, `pointer-events-none` and hidden from assistive tech, with a tint
 * view over the plumes, so it never intercepts input and the content above it stays readable. Settings
 * resolve as palette + variant tuning + `config`, exactly as react resolved the shader uniforms. Lynx's
 * engines cannot read `prefers-reduced-motion` alone, so the flag comes from the theme root.
 *
 * @example
 * ```tsx
 * import { FlueBackground } from "@horon-ai/lynx";
 *
 * function Sidebar() {
 *   return (
 *     <view className="relative flex min-h-[384px] flex-col overflow-hidden rounded-xl bg-bg-default">
 *       <FlueBackground variant="sidebar" config={{ speed: 0.5 }} />
 *       <view className="relative p-6">
 *         <text className="text-body-md text-text-primary">Navigation</text>
 *       </view>
 *     </view>
 *   );
 * }
 * ```
 */
export function FlueBackground({ className, style, variant = "default", config, tintClassName }: FlueBackgroundProps) {
  const scheme = useColorScheme();
  const reducedMotion = useReducedMotion();
  const dark = scheme === "dark";
  const tuning = FLUE_VARIANTS[variant];
  const settings: FlueConfig = { ...(dark ? FLUE_NIGHT : FLUE_SKY), ...(dark ? tuning.dark : tuning.light), ...config };
  const layers = FLUE_LAYERS[variant];
  const cycle = 1 / Math.max(0.05, settings.speed);
  const tint = tintClassName ?? (dark ? "" : tuning.tint);

  return (
    <view
      accessibility-elements-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: settings.bgColor, ...style }}
    >
      {layers.map((layer) => (
        <view
          key={layer.className}
          className={cn("absolute", layer.className)}
          style={{
            backgroundImage: layer.ramp(settings),
            opacity: shade((settings.density / 3) * layer.weight),
            transformOrigin: "50% 100%",
            ...(reducedMotion
              ? {}
              : {
                  animationName: "wave-level",
                  animationDuration: `${Math.round(layer.duration * cycle)}ms`,
                  animationDelay: `${layer.delay ?? 0}ms`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDirection: "alternate",
                }),
          }}
        />
      ))}
      <view
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(0deg, ${settings.colorD} 0%, transparent 62%)`,
          opacity: shade(settings.glow / 2),
          ...(reducedMotion
            ? {}
            : {
                animationName: "fade-in",
                animationDuration: `${Math.round(8000 * cycle)}ms`,
                animationDelay: "-2600ms",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
              }),
        }}
      />
      {settings.vignette > 0 ? (
        <view
          className="absolute inset-0"
          style={{ backgroundImage: groundScrim(settings), opacity: shade(settings.vignette * 1.6) }}
        />
      ) : null}
      {tint === "" ? null : <view className={cn("absolute inset-0", tint)} accessibility-elements-hidden />}
    </view>
  );
}
