/**
 * The size scale every sized control shares. `md` is the default and the
 * original Figma/Paper size; `sm` and `lg` step one rung down and up:
 *
 * - control height: sm 32px, md 40px, lg 48px (h-8 / h-10 / h-12)
 * - control text: sm `label-md` / `body-sm`, md `label-lg` / `body-md`, lg `label-lg` / `body-lg`
 * - icon: sm 16px, md 16-20px, lg 20-24px
 * - selection marks (checkbox, radio): sm 16px, md 20px, lg 24px
 *
 * ## The touch rung
 *
 * A finger needs a 44x44px target; a pointer does not, and a 44px row in a dense
 * desktop sidebar is wrong. So the sizes above stay the painted size and the
 * provider carries a second, orthogonal rung: `<HoronProvider touch>` sets
 * `touch: true` in theme context, `useTouch()` reads it, and each pressable adds
 * `h-11` (or `size-11` for a square) after its own size class. Tailwind-merge
 * replaces the rung rather than adding to it, so nothing is restyled twice.
 *
 * The rung is NOT a size. `touch` is independent of `size` and of `platform`:
 * `platform="mobile"` selects mobile web typography and says nothing about
 * targets, and `touch` says nothing about type. Do not fold it into
 * `ControlSize` and do not read it from a media query — Lynx evaluates none.
 *
 * Two controls are exempt because both dimensions are already large: `TabBar`
 * `md`/`lg` (64x48, 72x56). Everything else grows, and where the box is the only
 * thing that can grow, the painted content stays put inside it.
 */
export type ControlSize = "sm" | "md" | "lg";
