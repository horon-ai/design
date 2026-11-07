import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import type { LayoutChangeLike } from "../hooks";
import { readViewport } from "../lib/media";
import { useHoronTheme } from "../provider";

/**
 * Props for {@link Tooltip}.
 */
export type TooltipProps = {
  /** The element that shows the tooltip on hover and focus. */
  children: ReactNode;
  /** Bubble content; keep it to a short phrase because the bubble caps at 256px. */
  label: ReactNode;
  /** Preferred side of the trigger; Base UI flips it when there is no room. @default "top" */
  side?: "top" | "bottom" | "left" | "right";
  /** Hover delay in milliseconds before the bubble opens; Base UI's default when omitted. */
  delay?: number;
};

/** What {@link TooltipProvider} shares with its tooltips: the delays Base UI groups. */
type TooltipProviderProps = {
  /** The tooltips that share these timings. */
  children?: ReactNode;
  /** Milliseconds before a bubble opens. @default 600 */
  delay?: number;
  /** Milliseconds before a bubble closes after the pointer leaves. @default 0 */
  closeDelay?: number;
  /** Milliseconds during which the next tooltip opens instantly after one closed. @default 400 */
  timeout?: number;
};

type TooltipTimings = {
  delay: number;
  closeDelay: number;
};

const DEFAULT_DELAY = 600;

const TooltipTimingContext = createContext<TooltipTimings>({ delay: DEFAULT_DELAY, closeDelay: 0 });

/** The trigger's box on the page, measured by `bindlayoutchange`; all values in CSS px. */
type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Reads the box a `layoutchange` event reports, relative to the LynxView viewport. */
const boxOf = (event: LayoutChangeLike): AnchorRect => {
  const box = event.detail ?? event.params ?? {};
  return {
    left: typeof box.left === "number" ? box.left : 0,
    top: typeof box.top === "number" ? box.top : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };
};

/** The bubble's height, measured after it paints, so a `top` bubble clears the trigger. */
type PanelSize = { width: number; height: number };

/**
 * The bubble's position and the side it ended up on.
 *
 * Base UI's positioner does this on React, with a flip when the requested side
 * has no room; Lynx has no floating-ui, so the same flip is computed here and
 * reported back so the arrow turns with the bubble. A zero viewport (a plain
 * render test) keeps the requested side.
 */
function resolveBubble(anchor: AnchorRect, panel: PanelSize, side: TooltipProps["side"]): { side: TooltipProps["side"]; style: CSSProperties } {
  const viewport = readViewport();
  const known = viewport.width > 0 && viewport.height > 0;
  const gap = 6;

  const fitsTop = !known || anchor.top - gap - panel.height >= 0;
  const fitsBottom = !known || anchor.top + anchor.height + gap + panel.height <= viewport.height;
  const fitsLeft = !known || anchor.left - gap - panel.width >= 0;
  const fitsRight = !known || anchor.left + anchor.width + gap + panel.width <= viewport.width;

  let resolved = side;
  if (side === "top" && !fitsTop && fitsBottom) resolved = "bottom";
  else if (side === "bottom" && !fitsBottom && fitsTop) resolved = "top";
  else if (side === "left" && !fitsLeft && fitsRight) resolved = "right";
  else if (side === "right" && !fitsRight && fitsLeft) resolved = "left";

  const centeredLeft = anchor.left + anchor.width / 2 - panel.width / 2;
  const centeredTop = anchor.top + anchor.height / 2 - panel.height / 2;

  if (resolved === "bottom") return { side: resolved, style: { top: anchor.top + anchor.height + gap, left: centeredLeft } };
  if (resolved === "left") return { side: resolved, style: { top: centeredTop, right: viewport.width - anchor.left + gap } };
  if (resolved === "right") return { side: resolved, style: { top: centeredTop, left: anchor.left + anchor.width + gap } };
  return { side: resolved, style: { bottom: viewport.height - anchor.top + gap, left: centeredLeft } };
}

/** The arrow's offset per side, and the rotation that turns the downward triangle that way. */
const arrowStyle = (side: TooltipProps["side"]): CSSProperties => {
  if (side === "bottom") return { top: -6, left: "50%", marginLeft: -5, transform: "rotate(180deg)" };
  if (side === "left") return { right: -8, top: "50%", marginTop: -3, transform: "rotate(90deg)" };
  if (side === "right") return { left: -8, top: "50%", marginTop: -3, transform: "rotate(-90deg)" };
  return { bottom: -6, left: "50%", marginLeft: -5 };
};

const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/**
 * Figma `Tooltip` (62:282): an ink bubble, 10/6px padding, 8px radius, with a 10x6 arrow.
 *
 * React anchors the bubble to the child element through Base UI and opens it on
 * hover and keyboard focus. Lynx has no hover and no portal: the trigger is a
 * measuring wrapper view, a long press opens the bubble on touch and a plain tap
 * opens it where react would have hovered, and the bubble itself is a
 * `position: fixed` view placed 6px from the measured trigger box with the arrow
 * turned to the resolved side. Because there is no hover-out, a transparent
 * full-viewport backdrop behind the bubble closes it on the next tap, and tapping
 * the trigger again closes it as well.
 *
 * @example
 * ```tsx
 * import { IconButton, Tooltip } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <Tooltip label="Copy link" side="top">
 *       <IconButton icon={<Icon name="Copy" />} label="Copy link" />
 *     </Tooltip>
 *   );
 * }
 * ```
 */
export function Tooltip({ children, label, side = "top", delay }: TooltipProps) {
  const timings = useContext(TooltipTimingContext);
  const theme = useHoronTheme();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState<PanelSize>({ width: 0, height: 0 });
  const wait = delay ?? timings.delay;
  const [intent, setIntent] = useState<{ open: boolean; after: number } | null>(null);

  // The pending transition lives in state, so a second tap replaces the first
  // delay through this effect's cleanup instead of letting both timers fire.
  useEffect(() => {
    if (!intent) return undefined;
    if (intent.after <= 0) {
      setOpen(intent.open);
      setIntent(null);
      return undefined;
    }
    const timer = setTimeout(() => {
      setOpen(intent.open);
      setIntent(null);
    }, intent.after);
    return () => clearTimeout(timer);
  }, [intent]);

  const toggle = () => setIntent({ open: !open, after: open ? timings.closeDelay : wait });

  const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="${theme.color("interactive-primary")}"><path d="M0.67 1.5h8.66L5 6z"/></svg>`;
  const placement = anchor ? resolveBubble(anchor, panel, side) : null;

  return (
    <view className="flex flex-row items-center">
      <view
        className="flex flex-row items-center"
        bindlayoutchange={(event: LayoutChangeLike) => setAnchor(boxOf(event))}
        bindlongpress={toggle}
        bindtap={toggle}
        accessibility-element
        accessibility-traits="button"
      >
        {children}
      </view>

      {open && placement ? (
        <view
          className="fixed"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          bindtap={() => setIntent({ open: false, after: timings.closeDelay })}
          accessibility-element={false}
        />
      ) : null}

      {open && placement ? (
        <view
          className="fixed z-50 flex max-w-[256px] flex-row motion-popup rounded-sm bg-interactive-primary px-2.5 py-1.5 duration-150"
          style={placement.style}
          bindlayoutchange={(event: LayoutChangeLike) => {
            const box = boxOf(event);
            setPanel((previous) =>
              previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height },
            );
          }}
          accessibility-element
          accessibility-traits="summary"
        >
          {isPlainText(label) ? <text className="text-label-sm text-interactive-on-primary">{label}</text> : label}
          <view className="absolute" style={arrowStyle(placement.side)}>
            <svg content={arrow} style={{ width: 10, height: 6 }} />
          </view>
        </view>
      ) : null}
    </view>
  );
}

/**
 * Base UI tooltip provider, re-exported unchanged. Wrap a group of tooltips in it to share hover
 * timing, so moving between adjacent triggers does not restart each delay.
 *
 * On Lynx there is no hover: the provider shares the open delay (and the close
 * delay) with every {@link Tooltip} below it, which is the part of Base UI's
 * grouping a tap-driven bubble can honour.
 */
export function TooltipProvider({ children, delay = DEFAULT_DELAY, closeDelay = 0, timeout: _timeout }: TooltipProviderProps) {
  const value = useMemo<TooltipTimings>(() => ({ delay, closeDelay }), [delay, closeDelay]);
  return <TooltipTimingContext.Provider value={value}>{children}</TooltipTimingContext.Provider>;
}
