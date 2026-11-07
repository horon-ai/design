/**
 * Types for the generated `tailwind-preset.cjs`. The values themselves are
 * generated; this declaration is the stable shape a Tailwind v3 config and the
 * token tests read.
 */
declare const preset: {
  theme: {
    extend: {
      colors: Record<string, string>;
      borderRadius: Record<string, string>;
      boxShadow: Record<string, string>;
      fontSize: Record<string, [string, { lineHeight: string; letterSpacing: string; fontWeight: string }]>;
      fontFamily: Record<string, string[]>;
    };
  };
};

export = preset;
