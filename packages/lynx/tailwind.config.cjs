/**
 * Tailwind v3 for ReactLynx: the Lynx preset supplies the supported utility
 * set (flex layout, no DOM-only properties), and the generated Horon preset
 * adds the design tokens so the class names match `@horon-ai/react`
 * (`text-label-md`, `text-text-primary`, `bg-glass-regular`, `rounded-xl`).
 */
const lynxPreset = require("@lynx-js/tailwind-preset");
const horonPreset = require("./tailwind-preset.cjs");

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./example/**/*.{ts,tsx}"],
  presets: [lynxPreset, horonPreset],
  corePlugins: {
    preflight: false,
  },
};
