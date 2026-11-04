/**
 * The size scale every sized control shares. `md` is the default and the
 * original Figma/Paper size; `sm` and `lg` step one rung down and up:
 *
 * - control height: sm 32px, md 40px, lg 48px (h-8 / h-10 / h-12)
 * - control text: sm `label-md` / `body-sm`, md `label-lg` / `body-md`, lg `label-lg` / `body-lg`
 * - icon: sm 16px, md 16-20px, lg 20-24px
 * - selection marks (checkbox, radio): sm 16px, md 20px, lg 24px
 */
export type ControlSize = "sm" | "md" | "lg";
