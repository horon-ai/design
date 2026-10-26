import type { Decorator } from "@storybook/react-vite";

/**
 * The Figma section bodies put components on a sky backdrop so the glass has
 * something to blur. This reproduces it with the sky primitives.
 */
export const onBackdrop: Decorator = (Story) => (
  <div className="rounded-3xl bg-[linear-gradient(135deg,var(--color-sky-100),var(--color-sky-400)_55%,var(--color-sky-700))] p-10">
    <Story />
  </div>
);
