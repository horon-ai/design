import { useEffect, useState } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useHoronTheme, type ColorToken } from "../provider";
import { duration, easing } from "../lib/motion";

/**
 * Every knob the react fragment shader read. React uploaded each key as a uniform
 * named `u` plus the capitalised key; a phone has no WebGL, so the port keeps the
 * same shape and reads the keys a gradient composition can honour: the five
 * colours paint the ground, the ramp and the bloom, `speed` scales the drift,
 * `density` the plumes' opacity, `glow` the bloom on the dense end, and `vignette`
 * the corner scrim. The rest are accepted so a config written for react still
 * type-checks, and each one's JSDoc says what it would have done.
 */
export type FlueConfig = {
  /** Flat ground color, hex. Painted on the wrapper, so it is also the ground the plumes fade into. */
  bgColor: string;
  /** Faintest ramp stop, a near-ground tint that only the thinnest smoke reaches. */
  colorA: string;
  /** Second ramp stop: the first visible blue of the plume. */
  colorB: string;
  /** Third ramp stop: the dense body of the plume. */
  colorC: string;
  /** Densest ramp stop, also the glow color at high density. */
  colorD: string;
  /** Zoom of the base noise field; the shader made the smoke finer and busier with it. */
  scale: number;
  /** Time multiplier, so the drift speed follows it. Larger values drift faster. */
  speed: number;
  /** Vertical advection per second, the internal flow of the plume. */
  flow: number;
  /** Gain of each fbm octave (0..1); lower values kept the coarse shape dominant. */
  roughness: number;
  /** Frequency step between fbm octaves. */
  lacunarity: number;
  /** Zoom of the density field: larger values made individual wisps smaller. */
  smokeScale: number;
  /** Amount of curl-noise displacement. */
  curl: number;
  /** Zoom of the curl potential field. */
  curlScale: number;
  /** Upward drift of the smoke in uv per second. */
  rise: number;
  /** Vertical frequency multiplier for the density field. */
  slender: number;
  /** Half-width (uv) of the vertical corridor the plume filled. */
  width: number;
  /** How much the corridor widened from the bottom to the top of the frame. */
  spread: number;
  /** How far the pointer's x pushed the top of the plume sideways. */
  lean: number;
  /** Overall density multiplier before the threshold. */
  density: number;
  /** Gain around `midpoint`: higher values gave a harder edge between ground and smoke. */
  contrast: number;
  /** Threshold (0..1) where smoke starts to show. */
  midpoint: number;
  /** Strength of the `colorD` bloom on the densest part. */
  glow: number;
  /** Smoothstep width, over the density value, at which the ground gave way to the ramp. */
  sink: number;
  /** Film-grain strength; 0 turned grain off. */
  grain: number;
  /** Grain refresh multiplier (24 steps per second at 1). */
  grainAnim: number;
  /** Triangle-dither amplitude added to every channel to stop gradient banding. */
  dither: number;
  /** Corner darkening; multiplied by the squared uv distance from the centre. */
  vignette: number;
  /** 1 let the smoke follow the real pointer; a phone has none, so the port always drifts on its own. */
  cursor: number;
  /** Radius (uv) of the pointer trail's gaussian falloff. */
  pointerRadius: number;
  /** How strongly the pointer's velocity dragged the smoke along. */
  draft: number;
  /** How much the pointer trail brightened the density. */
  pointerStrength: number;
  /** How far the whole field shifted against the pointer. */
  parallax: number;
  /** Device-pixel-ratio cap of react's canvas; a gradient is resolution independent, so it is inert here. */
  maxDpr: number;
};

/**
 * The Horon sky palette for Flue. Recolour through these values only, never the
 * gradients: they are the same stops the react shader uploaded as uniforms.
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
  /** The tint token laid over the smoke in light mode; `""` lays none, which is what dark always does. */
  tint: ColorToken | "";
};

/**
 * - `default`: no motion overrides, under a regular glass tint in light mode and none in dark.
 * - `sidebar`: a narrow, tall column under the sidebar's glass. The glass blurs the detail away, so the
 *   smoke is calmer and larger, kept low in the column so the nav labels at the top sit on the quiet
 *   part; light mode lays the thick glass over the smoke so secondary labels keep their contrast.
 * - `auth`: the whole sign-in screen behind a centred card. The plume is wider and rises from the bottom
 *   centre so it frames the card, and dark mode sinks the corners into the night ground.
 */
const FLUE_VARIANTS: Record<FlueVariant, FlueTuning> = {
  default: { light: {}, dark: {}, tint: "glass-regular" },
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
    tint: "glass-thick",
  },
  auth: {
    light: { width: 1.9, spread: 1.3, density: 1.85, midpoint: 0.8, glow: 0.3, vignette: 0 },
    dark: { width: 1.9, spread: 1.3, density: 2.0, midpoint: 0.76, glow: 0.45, vignette: 0.45 },
    tint: "",
  },
};

/** One plume of the composition: where it sits, how it is painted and how long one rise takes. */
type FlueLayer = {
  /** Placement in shares of the wrapper, so the gradient scales with its host. */
  frame: { left?: string; right?: string; width?: string; bottom: string; height: string };
  /** The plume's ramp, from its dense bottom to its clear top. */
  ramp: (config: FlueConfig) => string;
  /** Share of the palette's density this layer paints at, so a variant can weight its layers. */
  weight: number;
  /** Rise length in milliseconds before the palette's `speed` divides it. */
  period: number;
};

/**
 * The three compositions. Each is a vertical ramp per plume over the flat ground, so the smoke reads as
 * a rising column: the dense stop sits at the bottom, the pale stops above it and nothing at the top.
 * A plume drifts 14% of its own height over one period and back, which reads as the slow advection
 * the shader got from its time uniform.
 */
const FLUE_LAYERS: Record<FlueVariant, FlueLayer[]> = {
  default: [
    {
      frame: { left: "-6%", width: "58%", bottom: "-12%", height: "128%" },
      ramp: (config) =>
        `linear-gradient(0deg, ${config.colorD} 0%, ${config.colorC} 30%, ${config.colorB} 62%, transparent 100%)`,
      weight: 1,
      period: 15000,
    },
    {
      frame: { right: "-10%", width: "62%", bottom: "-18%", height: "120%" },
      ramp: (config) => `linear-gradient(0deg, ${config.colorC} 0%, ${config.colorB} 44%, transparent 92%)`,
      weight: 0.75,
      period: 21000,
    },
    {
      frame: { left: "10%", right: "10%", bottom: "-6%", height: "62%" },
      ramp: (config) => `linear-gradient(0deg, ${config.colorD} 0%, transparent 78%)`,
      weight: 0.5,
      period: 9000,
    },
  ],
  sidebar: [
    {
      frame: { left: "-40%", right: "-40%", bottom: "-30%", height: "115%" },
      ramp: (config) =>
        `linear-gradient(0deg, ${config.colorD} 0%, ${config.colorC} 34%, ${config.colorB} 64%, transparent 100%)`,
      weight: 1,
      period: 18000,
    },
    {
      frame: { left: "-20%", right: "-20%", bottom: "-20%", height: "70%" },
      ramp: (config) => `linear-gradient(0deg, ${config.colorC} 0%, ${config.colorB} 48%, transparent 94%)`,
      weight: 0.6,
      period: 26000,
    },
  ],
  auth: [
    {
      frame: { left: "-24%", right: "-24%", bottom: "-24%", height: "120%" },
      ramp: (config) =>
        `linear-gradient(0deg, ${config.colorD} 0%, ${config.colorC} 26%, ${config.colorB} 58%, transparent 100%)`,
      weight: 1,
      period: 17000,
    },
    {
      frame: { left: "6%", right: "6%", bottom: "-12%", height: "82%" },
      ramp: (config) => `linear-gradient(0deg, ${config.colorC} 0%, ${config.colorB} 52%, transparent 96%)`,
      weight: 0.7,
      period: 24000,
    },
  ],
};

/** The ground scrim: the flat colour at both edges, so the plume fades into the page and never ends hard. */
const groundScrim = (config: FlueConfig): string =>
  `linear-gradient(180deg, ${config.bgColor} 0%, transparent 26%, transparent 68%, ${config.bgColor} 100%)`;

/** Cheap clamp to a sane opacity, so a tuned `density` or `glow` cannot blank the surface. */
const shade = (value: number): number => Math.min(1, Math.max(0.04, value));

/** Props of {@link FlueBackground}: placement, which variant, and per-instance gradient overrides. */
export type FlueBackgroundProps = {
  /** Layout of the wrapper; `backgroundColor` is set from the resolved `bgColor` before these apply. */
  style?: StyleProp<ViewStyle>;
  /** `sidebar` under the sidebar glass, `auth` behind the sign-in screen, `default` otherwise. @default "default" */
  variant?: FlueVariant;
  /** Overrides on top of the variant's `FLUE_SKY` (light) or `FLUE_NIGHT` (dark) tuning. */
  config?: Partial<FlueConfig>;
  /**
   * The tint token laid over the smoke, by name (`"glass-thick"`); defaults to the variant's tint.
   * An empty string lays none. React took a class name here, and a class name is not a colour token.
   */
  tintClassName?: string;
};

/**
 * Flue: the Horon smoke gradient, drawn as rising token-coloured plumes.
 *
 * React drew one fullscreen triangle with a WebGL2 fragment shader — curl-noise smoke, film grain,
 * dither and pointer parallax. React Native has no WebGL and this package may not add a shader
 * dependency, so **the shader is substituted**: the same palette resolves into vertical
 * `backgroundImage` gradients, and each plume drifts upward on an alternating loop scaled by `speed`
 * (a 9–26s rise and fall per plume). The substitution keeps what the smoke reads as — the ground, the
 * four-stop ramp, the dense `colorD` band, the bloom and the corner scrim — and drops the per-pixel
 * noise, grain, dither and pointer fields, which a gradient cannot express; those config keys stay so a
 * react call site type-checks.
 *
 * It fills its positioned parent behind the content, ignores touches and is hidden from assistive
 * technology, so it never intercepts input and the content above it stays readable. Under Reduce Motion
 * every plume holds still at full rise: a still plume rather than a frozen mid-cycle frame. Light mode
 * paints the white-and-sky `FLUE_SKY`; dark mode paints the black-and-blue `FLUE_NIGHT`.
 *
 * @example
 * ```tsx
 * import { FlueBackground, HoronText } from "@horon-ai/expo";
 *
 * function Sidebar() {
 *   return (
 *     <View style={{ position: "relative", overflow: "hidden", borderRadius: 12, minHeight: 384 }}>
 *       <FlueBackground variant="sidebar" config={{ speed: 0.5 }} />
 *       <View style={{ padding: 24 }}>
 *         <HoronText>Navigation</HoronText>
 *       </View>
 *     </View>
 *   );
 * }
 * ```
 */
export function FlueBackground({ style, variant = "default", config, tintClassName }: FlueBackgroundProps) {
  const theme = useHoronTheme();
  const dark = theme.scheme === "dark";
  const tuning = FLUE_VARIANTS[variant];
  const settings: FlueConfig = { ...(dark ? FLUE_NIGHT : FLUE_SKY), ...(dark ? tuning.dark : tuning.light), ...config };
  const layers = FLUE_LAYERS[variant];
  // `speed` is a time multiplier, so a slower palette stretches every cycle in the same proportion.
  const cycle = 1 / Math.max(0.05, settings.speed);
  // A caller names a colour token, as react named a class; an unknown name lays no tint rather than
  // painting a colour that does not exist.
  const wanted = tintClassName ?? (dark ? "" : tuning.tint);
  const tint = Object.entries(theme.colors).find(([token]) => token === wanted)?.[1];
  const drift = useDrift(layers.map((layer) => Math.round(layer.period * cycle)), theme.reducedMotion);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.root, { backgroundColor: settings.bgColor }, style]}
    >
      {layers.map((layer, index) => (
        <Animated.View
          key={`${layer.frame.left ?? ""}:${layer.frame.right ?? ""}:${layer.frame.bottom}:${layer.frame.height}`}
          style={[
            styles.plume,
            layer.frame,
            {
              backgroundImage: layer.ramp(settings),
              opacity: shade((settings.density / 3) * layer.weight),
              transform: [
                {
                  translateY: drift.plume(index).interpolate({
                    inputRange: [0, 1],
                    outputRange: ["-14%", "0%"],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
      {/* The bloom's tuned opacity sits on the frame; the child pulses, because animating `opacity`
          here would replace the inline value instead of scaling it. */}
      <View style={[styles.fill, { opacity: shade(settings.glow / 2) }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundImage: `linear-gradient(0deg, ${settings.colorD} 0%, transparent 62%)`,
              opacity: drift.bloom.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
            },
          ]}
        />
      </View>
      {settings.vignette > 0 ? (
        <View style={[styles.fill, { backgroundImage: groundScrim(settings), opacity: shade(settings.vignette * 1.6) }]} />
      ) : null}
      {tint ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.fill, { backgroundColor: tint }]}
        />
      ) : null}
    </View>
  );
}

/** One loop driver per plume, plus the bloom's, kept across renders because a loop owns its value. */
type Drift = { plume: (index: number) => Animated.Value; bloom: Animated.Value };

/**
 * The loop drivers of one instance, one per plume at its own period. The values rest at the end
 * state and the loops run only while the theme allows motion, so Reduce Motion leaves a still plume
 * instead of a frame that froze wherever the clock was; every loop stops on unmount and on the
 * switch's change.
 */
function useDrift(periods: number[], reducedMotion: boolean): Drift {
  const [driver] = useState(() => ({
    values: [] as Animated.Value[],
    bloom: new Animated.Value(0),
  }));

  // One value per plume, created once and reused when the variant changes its layer count.
  while (driver.values.length < periods.length) driver.values.push(new Animated.Value(0));

  // A caller builds the period list inline, so the effect keys on its contents instead of the array,
  // and reads the periods back from that key rather than closing over the caller's array.
  const key = periods.join(",");

  useEffect(() => {
    const list = key === "" ? [] : key.split(",").map(Number);
    const loops: Animated.CompositeAnimation[] = [];
    for (let index = 0; index < list.length; index += 1) {
      const value = driver.values[index];
      value.stopAnimation();
      value.setValue(0);
      if (reducedMotion) continue;
      const period = Math.max(250, list[index]);
      loops.push(
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, { toValue: 1, duration: period, easing: easing.inOut, useNativeDriver: true }),
            Animated.timing(value, { toValue: 0, duration: period, easing: easing.inOut, useNativeDriver: true }),
          ]),
        ),
      );
    }
    driver.bloom.stopAnimation();
    driver.bloom.setValue(0);
    if (!reducedMotion) {
      loops.push(
        Animated.loop(
          Animated.sequence([
            Animated.timing(driver.bloom, {
              toValue: 1,
              duration: duration.thinking,
              easing: easing.inOut,
              useNativeDriver: true,
            }),
            Animated.timing(driver.bloom, {
              toValue: 0,
              duration: duration.thinking,
              easing: easing.inOut,
              useNativeDriver: true,
            }),
          ]),
        ),
      );
    }
    for (const loop of loops) loop.start();
    return () => {
      for (const loop of loops) loop.stop();
    };
    // `driver` is created once; `key` carries the periods, so neither the caller's array nor its
    // identity has to be a dependency.
  }, [key, reducedMotion, driver]);

  return { plume: (index: number) => driver.values[index], bloom: driver.bloom };
}

const styles = StyleSheet.create({
  root: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" },
  plume: { position: "absolute" },
  fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
});
