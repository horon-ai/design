/** Types for the parts of liquid-gl that Horon calls; the package ships none. */
/** Options of `liquidGL()` that Horon uses; see the liquid-gl README for the full list. */
export interface LiquidGLOptions {
  target: string;
  snapshot?: string;
  resolution?: number;
  engine?: "auto" | "webgpu" | "webgl2" | "webgl";
  zIndex?: number;
  refraction?: number;
  aberration?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: "none" | "fade";
  tint?: string | null;
  on?: { init?: (lens: LiquidGLLens) => void };
}

export interface LiquidGLLens {
  el: HTMLElement;
  destroy(): void;
}

declare const liquidGL: ((options: LiquidGLOptions) => LiquidGLLens | LiquidGLLens[] | undefined) | undefined;
export default liquidGL;
