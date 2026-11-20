import { Easing } from "react-native";

/**
 * The motion tokens of `@horon-ai/react` `styles/globals.css`, for
 * `Animated.timing`. Durations are milliseconds.
 */
export const easing = {
  outQuint: Easing.bezier(0.22, 1, 0.36, 1),
  emphasized: Easing.bezier(0.2, 0, 0, 1),
  spring: Easing.bezier(0.34, 1.3, 0.64, 1),
  /** CSS `ease-in`, react's exit curve. */
  in: Easing.bezier(0.42, 0, 1, 1),
  /** CSS `ease-out`. */
  out: Easing.bezier(0, 0, 0.58, 1),
  /** CSS `ease-in-out`, the loop curve of thinking dots and waves. */
  inOut: Easing.bezier(0.42, 0, 0.58, 1),
} as const;

export const duration = {
  /** `motion-press`: the 0.97 press scale and colour change. */
  press: 150,
  popIn: 220,
  popOut: 130,
  slide: 200,
  fadeIn: 160,
  scaleOut: 120,
  tabPanel: 220,
  thinking: 1200,
  livePulse: 2000,
  shimmer: 1400,
  wave: 900,
} as const;
