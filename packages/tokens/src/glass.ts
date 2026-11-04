/**
 * The one glass material every platform draws: web (Chromium, Safari, Firefox),
 * desktop (WebView2, WKWebView) and Flutter (iOS, Android).
 *
 * It is limited to what all of them render the same way, so there is no
 * refraction, no blend mode and no height-dependent blur. Bottom to top:
 *
 * 1. Backdrop: the content behind is blurred by `blur` and saturated by
 *    `saturate`. CSS `blur(r)` and Flutter `ImageFilter.blur(sigma)` both take
 *    the Gaussian standard deviation, so the same number is passed to both, and
 *    both apply the Filter Effects saturate matrix.
 * 2. Fill: the tier colour `glass-clear` / `glass-regular` / `glass-thick` from
 *    `color.ts`. Saturation is linear and keeps white, so filling over the
 *    saturated backdrop (Flutter) equals saturating backdrop plus fill (CSS).
 * 3. Rim: a `rimWidth` ring inside the edge, a top-to-bottom gradient that is
 *    bright at the top, faint at `rimMidStop` and picks up again at the bottom.
 *
 * Elevation is not part of the material: a floating surface adds its own
 * `shadow` from `scale.ts`. Where the backdrop cannot be filtered (no
 * backdrop-filter support, reduced transparency), the fill becomes
 * `glass-fill-frost` and the rim stays.
 */

export const glass = {
  blur: 20,
  saturate: 1.8,
  rimWidth: 1,
  rimMidStop: 0.5,
  rim: {
    light: { top: "rgba(255, 255, 255, 0.7)", mid: "rgba(255, 255, 255, 0.12)", bottom: "rgba(255, 255, 255, 0.3)" },
    dark: { top: "rgba(255, 255, 255, 0.22)", mid: "rgba(255, 255, 255, 0.04)", bottom: "rgba(255, 255, 255, 0.1)" },
  },
} as const;

/**
 * The veil: a lighter glass for fields and overlays, drawn the same on every
 * platform. The backdrop is blurred by `blur` and saturated by `saturate`, then
 * filled, then a `ringWidth` ring and a soft drop shadow, with no rim gradient.
 *
 * - `field` is a faint wash for inputs that sit on imagery; `fieldFocus` while
 *   typing. `fieldShadow` is `0 2px 10px`.
 * - `overlay` is the elevated surface at 74% so menus, popups and dialogs stay
 *   readable over any content. `overlayShadow` is `0 6px 24px`.
 *
 * Where the backdrop cannot be filtered (reduced transparency, no
 * backdrop-filter), fields and overlays fall back to `glass-fill-frost`.
 */
export const veil = {
  blur: 8,
  saturate: 1.6,
  ringWidth: 1,
  scheme: {
    light: {
      ring: "rgba(23, 24, 26, 0.06)",
      field: "rgba(23, 24, 26, 0.06)",
      fieldFocus: "rgba(23, 24, 26, 0.09)",
      fieldShadow: "rgba(23, 24, 26, 0.06)",
      overlay: "rgba(255, 255, 255, 0.74)",
      overlayShadow: "rgba(23, 24, 26, 0.1)",
    },
    dark: {
      ring: "rgba(255, 255, 255, 0.06)",
      field: "rgba(255, 255, 255, 0.09)",
      fieldFocus: "rgba(255, 255, 255, 0.12)",
      fieldShadow: "rgba(0, 0, 0, 0.06)",
      overlay: "rgba(23, 24, 26, 0.74)",
      overlayShadow: "rgba(0, 0, 0, 0.3)",
    },
  },
} as const;
