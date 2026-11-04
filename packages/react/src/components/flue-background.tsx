import { type CSSProperties, useEffect, useRef, useSyncExternalStore } from "react";

import { cn } from "../lib/cn";

export type FlueConfig = {
  bgColor: string;
  colorA: string;
  colorB: string;
  colorC: string;
  colorD: string;
  scale: number;
  speed: number;
  flow: number;
  roughness: number;
  lacunarity: number;
  smokeScale: number;
  curl: number;
  curlScale: number;
  rise: number;
  slender: number;
  width: number;
  spread: number;
  lean: number;
  density: number;
  contrast: number;
  midpoint: number;
  glow: number;
  sink: number;
  grain: number;
  grainAnim: number;
  dither: number;
  vignette: number;
  /** 1 lets the smoke follow the real pointer; 0 (default) ignores it and a slow virtual pointer sways the smoke. */
  cursor: number;
  pointerRadius: number;
  draft: number;
  pointerStrength: number;
  parallax: number;
  maxDpr: number;
};

/** The Horon sky palette for Flue. Recolour through these values only, never the shader. */
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

/** The night palette for dark mode: near-black ground and blue smoke. Same motion as `FLUE_SKY`. */
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

type FlueTuning = { light: Partial<FlueConfig>; dark: Partial<FlueConfig>; tint: string };

/**
 * - `sidebar`: a narrow, tall column under the sidebar's glass. The glass blurs the detail away, so the smoke
 *   is calmer and larger, kept low in the column so the nav labels at the top sit on the quiet part. The sidebar
 *   glass supplies the fill, so the variant lays no tint of its own.
 * - `auth`: the whole sign-in screen behind a centred card. The plume is wider and rises from the bottom
 *   centre so it frames the card, with a vignette that holds the corners in the ground colour. No tint.
 */
const FLUE_VARIANTS: Record<FlueVariant, FlueTuning> = {
  default: { light: {}, dark: {}, tint: "bg-glass-regular dark:bg-transparent" },
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
    tint: "",
  },
  auth: {
    light: { width: 1.9, spread: 1.3, density: 2.0, midpoint: 0.74, glow: 0.45, vignette: 0.18 },
    dark: { width: 1.9, spread: 1.3, density: 2.0, midpoint: 0.76, glow: 0.45, vignette: 0.45 },
    tint: "",
  },
};

/** Follows the `.dark` class on <html>, the switch the theme uses. */
function subscribeScheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function useDarkScheme(): boolean {
  return useSyncExternalStore(
    subscribeScheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

const ENGINE_KEYS = new Set(["cursor", "maxDpr"]);

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 iResolution; uniform float iTime; uniform vec2 iMouse; uniform vec2 iMouseVel; uniform vec2 iMouseWake;
uniform vec3 uBgColor, uColorA, uColorB, uColorC, uColorD;
uniform float uScale, uSpeed, uFlow, uRoughness, uLacunarity;
uniform float uSmokeScale, uCurl, uCurlScale, uRise, uSlender;
uniform float uWidth, uSpread, uLean, uDensity;
uniform float uContrast, uMidpoint, uGlow, uSink;
uniform float uGrain, uDither, uVignette;
uniform float uPointerRadius, uDraft, uPointerStrength, uParallax;
uniform float uGrainAnim;
#define OCTAVES 3
#define TRAIL_TAPS 6
vec2 hash2(vec2 p){ p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return -1.0+2.0*fract(sin(p)*43758.5453123); }
float snoise(vec2 p){ const float K1=0.366025404,K2=0.211324865; vec2 i=floor(p+(p.x+p.y)*K1); vec2 a=p-i+(i.x+i.y)*K2; float m=step(a.y,a.x); vec2 o=vec2(m,1.0-m); vec2 b=a-o+K2; vec2 c=a-1.0+2.0*K2; vec3 h=max(0.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.0); vec3 n=h*h*h*h*vec3(dot(a,hash2(i)),dot(b,hash2(i+o)),dot(c,hash2(i+1.0))); return dot(n,vec3(70.0)); }
float fbm(vec2 p){ float v=0.0,amp=0.5; for(int i=0; i<OCTAVES; i++){ v+=amp*snoise(p); p*=uLacunarity; amp*=uRoughness; } return v; }
float trail(vec2 uv,float radius){ vec2 wob=vec2(snoise(uv*1.7+vec2(0.0,iTime*0.05)),snoise(uv*1.7+vec2(4.3,-iTime*0.04))); uv+=wob*radius*0.18; float a=0.0,wsum=0.0; float r2=max(1e-4,radius*radius); for(int i=0; i<TRAIL_TAPS; i++){ float k=float(i)/float(TRAIL_TAPS-1); vec2 c=mix(iMouseWake,iMouse,k); vec2 dd=uv-c; float w=mix(0.30,1.0,k); a+=w*exp(-dot(dd,dd)/r2); wsum+=w; } return a/wsum; }
float potential(vec2 p){ return snoise(p)+0.5*snoise(p*2.03+vec2(3.7,-1.9)); }
vec2 curl(vec2 p,float e){ float nx1=potential(p+vec2(0.0,e)); float nx2=potential(p-vec2(0.0,e)); float ny1=potential(p+vec2(e,0.0)); float ny2=potential(p-vec2(e,0.0)); return vec2(nx1-nx2,ny2-ny1)/(2.0*e); }
vec3 ramp4(float t){ vec3 c=mix(uColorA,uColorB,smoothstep(0.00,0.36,t)); c=mix(c,uColorC,smoothstep(0.32,0.70,t)); c=mix(c,uColorD,smoothstep(0.66,1.00,t)); return c; }
float triDither(vec2 fc){ float a=fract(sin(dot(fc,vec2(12.9898,78.233)))*43758.5453); float b=fract(sin(dot(fc+17.0,vec2(12.9898,78.233)))*43758.5453); return (a+b-1.0)/255.0; }
float houseGrain(vec2 fc){ uvec2 q=uvec2(fc)*uvec2(1597334677u,3812015801u)+uint(floor(iTime*24.0*uGrainAnim))*2654435769u; uint n=q.x^q.y; n=n*1664525u+1013904223u; n^=n>>16u; n*=2246822519u; n^=n>>13u; float a=float(n&0xffffu)/65535.0; n*=3266489917u; n^=n>>16u; float b=float(n&0xffffu)/65535.0; return a+b-1.0; }
void main(){ vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y; float t=iTime*uSpeed; float tr=trail(uv,uPointerRadius); vec2 p=(uv-iMouse*uParallax)*uScale; vec2 sp=p+vec2(0.0,-t*uRise); vec2 c=curl(sp*uCurlScale+vec2(0.0,t*uFlow),0.14)*uCurl; c+=iMouseVel*uDraft*tr; vec2 mp=vec2(sp.x,sp.y*uSlender)*uSmokeScale+c; float dens=fbm(mp)*0.5+0.5; float h=uv.y+0.55; float lean=iMouse.x*uLean*clamp(h,0.0,1.6); float width=max(0.06,uWidth*(0.45+uSpread*clamp(h,0.0,1.8))); float xr=(uv.x-lean)/width; float corridor=exp(-xr*xr); float cool=smoothstep(-0.65,0.85,uv.y); float smoke=dens*corridor*mix(1.0,0.30,cool)*uDensity; float f=clamp((smoke-uMidpoint)*uContrast+0.5+tr*uPointerStrength*0.30,0.0,1.0); vec3 col=ramp4(f); col+=uColorD*uGlow*pow(f,4.0); col=mix(uBgColor,col,smoothstep(0.0,max(0.01,uSink),f)*0.90+0.10); col*=1.0-uVignette*dot(uv,uv); { float hgL=clamp(dot(col,vec3(0.299,0.587,0.114)),0.0,1.0); col+=houseGrain(gl_FragCoord.xy)*uGrain*mix(1.0,4.0*hgL*(1.0-hgL),0.6); } col+=triDither(gl_FragCoord.xy)*uDither; fragColor=vec4(clamp(col,0.0,1.0),1.0); }`;

function hexToVec3(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Flue: createShader failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader) ?? "Flue: compile failed");
  return shader;
}

const USE_PROGRAM = "useProgram";

function activate(gl: WebGL2RenderingContext, program: WebGLProgram): void {
  gl[USE_PROGRAM](program);
}

export type FlueBackgroundProps = {
  className?: string;
  style?: CSSProperties;
  /** `sidebar` under the sidebar glass, `auth` behind the sign-in screen, `default` otherwise. */
  variant?: FlueVariant;
  /** Overrides on top of the variant's `FLUE_SKY` (light) or `FLUE_NIGHT` (dark) tuning. */
  config?: Partial<FlueConfig>;
  /** Classes for the tint laid over the smoke; defaults to the variant's tint. */
  tintClassName?: string;
};

/**
 * Flue: an animated WebGL2 smoke gradient, one fullscreen triangle and one fragment shader.
 * It fills its positioned parent behind the content (the parent needs `isolate`) and falls
 * back to the flat `bgColor` when WebGL2 is missing. Reduced motion draws a single still frame.
 * Light mode paints the white-and-sky `FLUE_SKY`; dark mode paints the black-and-blue `FLUE_NIGHT`.
 */
export function FlueBackground({ className, style, variant = "default", config, tintClassName }: FlueBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dark = useDarkScheme();
  const tuning = FLUE_VARIANTS[variant];
  const settings = { ...(dark ? FLUE_NIGHT : FLUE_SKY), ...(dark ? tuning.dark : tuning.light), ...config };
  const key = JSON.stringify(settings);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const cfg: FlueConfig = JSON.parse(key);
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    // StrictMode replays the effect on the same canvas. A context that a previous run lost
    // cannot compile again, so fall back to the flat bgColor instead of throwing.
    if (!gl || gl.isContextLost()) return undefined;

    const program = gl.createProgram();
    if (!program) return undefined;
    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program) ?? "Flue: link failed");
    activate(gl, program);
    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);

    const locations = new Map<string, WebGLUniformLocation | null>();
    const loc = (name: string) => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
      return locations.get(name) ?? null;
    };
    for (const [name, value] of Object.entries(cfg)) {
      if (ENGINE_KEYS.has(name)) continue;
      const uniform = `u${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      if (typeof value === "string") gl.uniform3f(loc(uniform), ...hexToVec3(value));
      else gl.uniform1f(loc(uniform), value);
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDpr);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(loc("iResolution"), width, height);
    };

    const mouse = { x: 0, y: 0, ax: 0, ay: 0, wx: 0, wy: 0, tx: 0, ty: 0 };
    const aim = (event: PointerEvent) => {
      if (!cfg.cursor) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouse.tx = ((event.clientX - rect.left) / rect.width - 0.5) * (rect.width / rect.height);
      mouse.ty = 0.5 - (event.clientY - rect.top) / rect.height;
    };

    let clock = 0;
    const draw = () => {
      gl.uniform1f(loc("iTime"), clock);
      gl.uniform2f(loc("iMouse"), mouse.x, mouse.y);
      gl.uniform2f(loc("iMouseVel"), mouse.ax - mouse.x, mouse.ay - mouse.y);
      gl.uniform2f(loc("iMouseWake"), mouse.wx, mouse.wy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let still = motionQuery.matches;
    let resizeQueued = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeQueued);
      resizeQueued = requestAnimationFrame(() => {
        resize();
        if (still) draw();
      });
    });
    observer.observe(canvas);
    resize();
    clock = still ? 12 : 0;
    draw();

    let visible = true;
    const visibility = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });
    visibility.observe(canvas);

    let raf = 0;
    let previous = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const raw = now - previous;
      previous = now;
      if (!visible || document.hidden) return;
      const ms = Math.min(50, Math.max(4.167, raw));
      const step = ms > 36.7 ? 2.2 : ms * 0.06;
      clock += ms * 0.001;
      // Without the real pointer, a slow virtual one wanders across the canvas on two incommensurate
      // sines, so the plume leans, sways and trails on its own the way it does under a moving cursor.
      if (!cfg.cursor) {
        const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        mouse.tx = aspect * (0.3 * Math.sin(clock * 0.23) + 0.12 * Math.sin(clock * 0.57 + 0.8));
        mouse.ty = 0.22 * Math.sin(clock * 0.19 + 1.3) + 0.08 * Math.sin(clock * 0.41);
      }
      const kLead = 0.105 * step;
      const kBody = 0.043 * step;
      const kWake = 0.017 * step;
      mouse.ax += (mouse.tx - mouse.ax) * kLead;
      mouse.ay += (mouse.ty - mouse.ay) * kLead;
      mouse.x += (mouse.ax - mouse.x) * kBody;
      mouse.y += (mouse.ay - mouse.y) * kBody;
      mouse.wx += (mouse.x - mouse.wx) * kWake;
      mouse.wy += (mouse.y - mouse.wy) * kWake;
      draw();
    };
    // The plume follows the OS switch while the page is open: turning on "reduce motion"
    // freezes the current frame, turning it off resumes from the same clock.
    const listen = () => {
      if (still) {
        window.removeEventListener("pointermove", aim);
        window.removeEventListener("pointerdown", aim);
        return;
      }
      if (cfg.cursor) {
        window.addEventListener("pointermove", aim, { passive: true });
        window.addEventListener("pointerdown", aim, { passive: true });
      }
      previous = performance.now();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      still = event.matches;
      if (still) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      listen();
    };
    motionQuery.addEventListener("change", onMotionChange);
    listen();

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeQueued);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("pointerdown", aim);
      // Release this run's GL objects without losing the context: the next effect run
      // (StrictMode, config change) reuses the same WebGL2RenderingContext.
      gl.bindVertexArray(null);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [key]);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      style={{ backgroundColor: settings.bgColor, ...style }}
    >
      <canvas ref={canvasRef} className="block size-full" />
      <div className={cn("absolute inset-0", tintClassName ?? tuning.tint)} />
    </div>
  );
}
