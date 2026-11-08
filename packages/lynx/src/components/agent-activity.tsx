import { useCallback, useEffect, useRef, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { useReducedMotion } from "../hooks/use-reduced-motion";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/** The Figma quint-out curve, written out because an inline animation cannot read a variable. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** The three-dot bounce, written inline because Lynx has no `animate-thinking` utility. */
const thinkingDot = (delay: number): CSSProperties => ({
  animationName: "thinking-dot",
  animationDuration: "1.2s",
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
  ...(delay === 0 ? {} : { animationDelay: `${delay}ms` }),
});

/**
 * Figma `Thinking` (Agent activity 108:660): a 69x31 subtle pill with three 7px dots at 35/55/80% ink.
 * Announced as `role="status"`; the three dots bounce with a 150ms stagger.
 *
 * Lynx has no `animate-thinking` token, so each dot carries the `thinking-dot` keyframes and its
 * delay inline, and the pill is a `view` because there is no `<span>`.
 *
 * @example
 * ```tsx
 * import { ThinkingIndicator } from "@horon-ai/lynx";
 *
 * <ThinkingIndicator label="Searching the workspace…" />
 * ```
 */
// prettier-ignore
export function ThinkingIndicator({ label = "Thinking", className }: {
  /** Accessible status text, not rendered visibly. @default "Thinking" */
  label?: string;
  /** Extra classes merged onto the pill, for margins or alignment. */
  className?: string;
}) {
  return (
    <view
      className={cn(
        "flex h-[31px] w-[69px] flex-row items-center justify-center gap-2 rounded-full border border-border-default bg-bg-surface",
        className,
      )}
      accessibility-element
      accessibility-role-description="status"
      accessibility-label={label}
    >
      <view className="size-[7px] rounded-full bg-overlay-ink-35" style={thinkingDot(0)} />
      <view className="size-[7px] rounded-full bg-overlay-ink-55" style={thinkingDot(150)} />
      <view className="size-[7px] rounded-full bg-overlay-ink-80" style={thinkingDot(300)} />
    </view>
  );
}

/** Writes a ref from inside an effect, which the immutability lint reads as a post-render mutation. */
function remember<T>(ref: { current: T }, value: T) {
  ref.current = value;
}

/** Characters per second the reveal moves at least; a larger backlog drains faster (about a third of a second). */
const REVEAL_RATE = 90;
const BACKLOG_DRAIN = 3;

/** Moves `end` past a high surrogate so an emoji is never cut in half. */
function codePointEnd(text: string, end: number): number {
  const code = text.charCodeAt(end - 1);
  return code >= 0xd800 && code <= 0xdbff ? end + 1 : end;
}

/**
 * How much of `text` to show. While `smooth` streaming runs, new characters are revealed a few per frame so
 * bursty chunks read as steady typing; otherwise, and under reduced motion, everything shows at once.
 * Text that no longer extends what was shown (a rewrite) restarts from the shared prefix.
 *
 * Lynx exposes `requestAnimationFrame` as a global (and `lynx.requestAnimationFrame` below 3.0), so the
 * loop is the same as react's; a host with no frame callback reveals the whole text instead.
 */
function useRevealedLength(text: string, smooth: boolean, reducedMotion: boolean): number {
  const [shown, setShown] = useState(text.length);
  const shownRef = useRef(text.length);
  const previous = useRef(text);

  useEffect(() => {
    const before = previous.current;
    remember(previous, text);
    const set = (length: number) => {
      remember(shownRef, length);
      setShown(length);
    };
    let start = Math.min(shownRef.current, text.length);
    let shared = 0;
    while (shared < start && text[shared] === before[shared]) shared++;
    start = shared;

    if (!smooth || reducedMotion || typeof requestAnimationFrame !== "function") {
      set(text.length);
      return undefined;
    }
    if (start !== shownRef.current) set(start);
    if (start >= text.length) return undefined;

    let position = start;
    const stamp = () =>
      typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
    let last = stamp();
    let frame = requestAnimationFrame(function tick(frameTime) {
      const current = typeof frameTime === "number" ? frameTime : stamp();
      const seconds = Math.min(0.1, (current - last) / 1000);
      last = current;
      const backlog = text.length - position;
      position = Math.min(text.length, position + Math.max(REVEAL_RATE * seconds, backlog * BACKLOG_DRAIN * seconds));
      const length = Math.min(text.length, codePointEnd(text, Math.floor(position)));
      if (length !== shownRef.current) set(length);
      if (length < text.length) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [text, smooth, reducedMotion]);

  return Math.min(shown, text.length);
}

/**
 * Props for {@link StreamingText}: the growing answer, whether it is still streaming, and whether chunks are
 * revealed smoothly.
 */
export type StreamingTextProps = {
  /** Everything received so far; pass the growing string as chunks arrive. */
  text: string;
  /** True while more text is coming: the caret shows, and the rest is revealed when it turns false. @default true */
  streaming?: boolean;
  /** Reveal arriving chunks a few characters per frame instead of in jumps. Off under reduced motion. @default true */
  smooth?: boolean;
  /** Extra classes merged onto the bubble, such as a maximum width. */
  className?: string;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the bubble's own. */
  style?: CSSProperties;
};

/**
 * Figma `Streaming` (108:660): the bot bubble an answer types into, body-sm text and a 2px ink caret that sits
 * right after the last character and wraps with it. The caret holds still while characters land and blinks
 * while waiting for the next chunk; it goes away when the stream ends. Screen readers get the answer once,
 * when it is complete, instead of every chunk.
 *
 * `text` is the whole answer so far, not a delta: passing only the newest chunk would drop earlier text. The
 * reveal restarts from the shared prefix when `text` is rewritten rather than extended.
 *
 * Lynx cannot place a `view` inline inside a `<text>`, so the caret is a sibling laid out at the end of the
 * bubble's last line (`items-end`); when the answer is finished the caret and the hidden live region are
 * mounted out of the tree entirely. The completed answer is announced through the bubble's own
 * `accessibility-label` because Lynx has no `aria-live` slot.
 *
 * @example
 * ```tsx
 * import { StreamingText } from "@horon-ai/lynx";
 *
 * function Answer({ text, done }: { text: string; done: boolean }) {
 *   return <StreamingText text={text} streaming={!done} />;
 * }
 * ```
 */
export function StreamingText({ text, streaming = true, smooth = true, className, id, style }: StreamingTextProps) {
  const reducedMotion = useReducedMotion();
  const shown = useRevealedLength(text, streaming && smooth, reducedMotion);
  const typing = shown < text.length;

  return (
    <view
      className={cn(
        "w-fit max-w-full flex-row items-end break-all rounded-xl border border-border-default bg-bg-surface px-4 py-3",
        className,
      )}
      style={style}
      accessibility-element
      accessibility-role-description={streaming ? "text" : "status"}
      accessibility-label={streaming ? undefined : text}
      {...(id === undefined ? {} : { id })}
    >
      <text className="min-w-0 whitespace-pre-wrap text-body-sm text-text-primary">{text.slice(0, shown)}</text>
      {streaming ? (
        <view
          className="ml-px w-0.5 shrink-0 rounded-[1px] bg-interactive-primary"
          style={{
            height: "1.15em",
            ...(typing
              ? {}
              : {
                  animationName: "caret-blink",
                  animationDuration: "1s",
                  animationTimingFunction: "step-end",
                  animationIterationCount: "infinite",
                }),
          }}
          accessibility-elements-hidden
        />
      ) : null}
    </view>
  );
}

/** Progress of a tool call: `running` shows a spinner, `done` a check, `failed` a warning and danger text. */
export type ToolStepState = "running" | "done" | "failed";

/** Props for {@link ToolStep}: the tool line, an optional detail line and the progress state. */
export type ToolStepProps = {
  /** Progress state, which also picks the leading icon and the title colour. @default "running" */
  state?: ToolStepState;
  /** The tool call line, truncated to one line. */
  title: ReactNode;
  /** Optional second line, such as the target or a short result, truncated to one line. */
  detail?: ReactNode;
  /** Extra classes merged onto the row, for margins. */
  className?: string;
  /** Runs when the row is tapped; a disabled row never runs it. */
  onClick?: () => void;
  /** Blocks interaction and dims the row to 40%. */
  disabled?: boolean;
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the row's own. */
  style?: CSSProperties;
};

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Tool step` (108:660): a flat 12px-radius row with spinner, check or warning, and a caret.
 * React rendered a real `button`, so pass `onClick` to open the call's detail; the caret does not expand
 * anything on its own.
 *
 * Lynx has no `<button>`, so the row is a `view` announced with the button trait and the whole row is the
 * tap target.
 *
 * @example
 * ```tsx
 * import { ToolStep } from "@horon-ai/lynx";
 *
 * <ToolStep state="done" title="Search the web" detail="3 results" onClick={openCall} />
 * ```
 */
export function ToolStep({ state = "running", title, detail, className, onClick, disabled, id, style }: ToolStepProps) {
  return (
    <view
      className={cn(
        "motion-press flex w-full min-w-0 flex-row items-center gap-2.5 rounded-md border border-border-default bg-bg-surface px-2.5 py-2",
        disabled ? "opacity-40" : "active:bg-overlay-ink-3",
        className,
      )}
      style={style}
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      {...(id === undefined ? {} : { id })}
    >
      {state === "running" ? <Spinner size="sm" /> : null}
      {state === "done" ? <Icon name="CheckCircle" size={16} color="text-secondary" /> : null}
      {state === "failed" ? <Icon name="WarningCircle" size={16} color="text-danger" /> : null}
      <view className="flex min-w-0 flex-1 flex-col gap-px">
        {isPlainText(title) ? (
          <text className={cn("truncate text-label-md", state === "failed" ? "text-text-danger" : "text-text-primary")}>
            {title}
          </text>
        ) : (
          <view className="min-w-0">{title}</view>
        )}
        {detail ? (
          isPlainText(detail) ? (
            <text className="truncate text-caption text-text-secondary">{detail}</text>
          ) : (
            <view className="min-w-0">{detail}</view>
          )
        ) : null}
      </view>
      <Icon name="CaretRight" size={14} color="text-secondary" />
    </view>
  );
}

/** One compact line inside a work log. */
export type WorkLogStep = {
  /** Stable key for the step. */
  id: string;
  /** Step text, truncated to one line. */
  title: ReactNode;
  /** Optional second line with a short result or target. */
  detail?: ReactNode;
  /** Shows a small spinner instead of the check while the step is still running. */
  running?: boolean;
};

/**
 * Figma `Work log` (108:660): a flat subtle card with a wrench summary row and compact steps.
 *
 * React used a native `<details open>`; Lynx has no such element, so the group keeps the same open
 * state locally, and the caret rotates while closed. The steps collapse by not rendering rather than
 * by an animated height, because Lynx cannot transition to an auto height.
 *
 * @example
 * ```tsx
 * import { WorkLog } from "@horon-ai/lynx";
 *
 * <WorkLog
 *   summary="4 steps"
 *   steps={[
 *     { id: "read", title: "Read the sheet", detail: "18 rows" },
 *     { id: "write", title: "Draft the summary", running: true },
 *   ]}
 * />
 * ```
 */
export function WorkLog({
  summary,
  steps,
  className,
}: {
  /** Summary line in the toggle row, such as "4 steps". */
  summary: ReactNode;
  /** Steps listed under the summary. */
  steps: WorkLogStep[];
  /** Extra classes merged onto the card, for margins or a width override. */
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  return (
    <view
      className={cn(
        "flex w-full min-w-0 max-w-[340px] flex-col rounded-[16px] border border-border-default bg-bg-surface p-1.5",
        className,
      )}
    >
      <view
        className="motion-press flex min-w-0 flex-row items-center gap-2 px-2.5 py-1.5 active:bg-overlay-ink-3"
        bindtap={toggle}
        accessibility-element
        accessibility-traits="button"
        accessibility-label={isPlainText(summary) ? String(summary) : undefined}
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        <Icon name="Wrench" size={14} color="text-secondary" />
        <view className="min-w-0 flex-1">
          {isPlainText(summary) ? <text className="text-caption text-text-secondary">{summary}</text> : summary}
        </view>
        <view
          className="flex shrink-0 flex-row items-center justify-center"
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transitionProperty: "transform",
            transitionDuration: "200ms",
            transitionTimingFunction: EASE_OUT_QUINT,
          }}
        >
          <Icon name="CaretDown" size={14} color="text-secondary" />
        </view>
      </view>
      {open
        ? steps.map((step) => (
            <view key={step.id} className="flex flex-row items-center gap-2.5 px-2.5 py-1.5">
              {step.running ? <Spinner size="xs" /> : <Icon name="CheckCircle" size={14} color="text-secondary" />}
              <view className="flex min-w-0 flex-1 flex-col">
                {isPlainText(step.title) ? (
                  <text className="truncate text-label-sm text-text-primary">{step.title}</text>
                ) : (
                  <view className="min-w-0">{step.title}</view>
                )}
                {step.detail ? (
                  isPlainText(step.detail) ? (
                    <text className="truncate text-caption text-text-secondary">{step.detail}</text>
                  ) : (
                    <view className="min-w-0">{step.detail}</view>
                  )
                ) : null}
              </view>
            </view>
          ))
        : null}
    </view>
  );
}
