import { CaretDown, CaretRight, CheckCircle, WarningCircle, Wrench } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "../hooks/use-reduced-motion";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/** Figma `Thinking` (Agent activity 108:660): a 69x31 subtle pill with three 7px dots at 35/55/80% ink. */
export function ThinkingIndicator({ label = "Thinking", className }: { label?: string; className?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex h-7.75 w-17.25 items-center justify-center gap-2 rounded-full border border-border-default bg-bg-surface",
        className,
      )}
    >
      <span className="size-[7px] animate-thinking rounded-full bg-overlay-ink-35" />
      <span className="size-[7px] animate-thinking rounded-full bg-overlay-ink-55 [animation-delay:150ms]" />
      <span className="size-[7px] animate-thinking rounded-full bg-overlay-ink-80 [animation-delay:300ms]" />
    </span>
  );
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
 */
function useRevealedLength(text: string, smooth: boolean, reducedMotion: boolean): number {
  const [shown, setShown] = useState(text.length);
  const shownRef = useRef(text.length);
  const previous = useRef(text);

  useEffect(() => {
    const set = (length: number) => {
      shownRef.current = length;
      setShown(length);
    };
    let start = Math.min(shownRef.current, text.length);
    const before = previous.current;
    previous.current = text;
    let shared = 0;
    while (shared < start && text[shared] === before[shared]) shared++;
    start = shared;

    if (!smooth || reducedMotion) {
      set(text.length);
      return undefined;
    }
    if (start !== shownRef.current) set(start);
    if (start >= text.length) return undefined;

    let position = start;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const seconds = Math.min(0.1, (now - last) / 1000);
      last = now;
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

export type StreamingTextProps = Omit<ComponentProps<"div">, "className" | "children"> & {
  /** Everything received so far; pass the growing string as chunks arrive. */
  text: string;
  /** True while more text is coming: the caret shows, and the rest is revealed when it turns false. */
  streaming?: boolean;
  /** Reveal arriving chunks a few characters per frame instead of in jumps. Off under reduced motion. */
  smooth?: boolean;
  className?: string;
};

/**
 * Figma `Streaming` (108:660): the bot bubble an answer types into, body-sm text and a 2px ink caret that sits
 * right after the last character and wraps with it. The caret holds still while characters land and blinks
 * while waiting for the next chunk; it goes away when the stream ends. Screen readers get the answer once,
 * when it is complete, instead of every chunk.
 */
export function StreamingText({ text, streaming = true, smooth = true, className, ...props }: StreamingTextProps) {
  const reducedMotion = useReducedMotion();
  const shown = useRevealedLength(text, streaming && smooth, reducedMotion);
  const typing = shown < text.length;
  return (
    <div
      className={cn(
        "w-fit max-w-full rounded-xl border border-border-default bg-bg-surface px-4 py-3 text-body-sm wrap-break-word whitespace-pre-wrap text-text-primary",
        className,
      )}
      {...props}
    >
      <span aria-hidden>{text.slice(0, shown)}</span>
      {streaming && (
        <span
          aria-hidden
          className={cn(
            "ml-px inline-block h-[1.15em] w-0.5 rounded-[1px] bg-interactive-primary align-[-0.2em]",
            !typing && "animate-caret",
          )}
        />
      )}
      <span className="sr-only" aria-live="polite" aria-busy={streaming}>
        {streaming ? "" : text}
      </span>
    </div>
  );
}

export type ToolStepState = "running" | "done" | "failed";

export type ToolStepProps = Omit<ComponentProps<"button">, "className" | "title"> & {
  state?: ToolStepState;
  title: ReactNode;
  detail?: ReactNode;
  className?: string;
};

/** Figma `Tool step` (108:660): a flat 12px-radius row with spinner, check or warning, and a caret. */
export function ToolStep({ state = "running", title, detail, className, ...props }: ToolStepProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full min-w-0 motion-press cursor-pointer items-center gap-2.5 rounded-md border border-border-default bg-bg-surface px-2.5 py-2 text-left focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {state === "running" && <Spinner size="sm" />}
      {state === "done" && <CheckCircle aria-hidden className="size-4 shrink-0 text-text-secondary" />}
      {state === "failed" && <WarningCircle aria-hidden className="size-4 shrink-0 text-text-danger" />}
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className={cn("truncate text-label-md", state === "failed" ? "text-text-danger" : "text-text-primary")}>
          {title}
        </span>
        {detail && <span className="truncate text-caption text-text-secondary">{detail}</span>}
      </span>
      <CaretRight aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
    </button>
  );
}

export type WorkLogStep = { id: string; title: ReactNode; detail?: ReactNode; running?: boolean };

/** Figma `Work log` (108:660): a flat subtle card with a wrench summary row and compact steps. */
export function WorkLog({
  summary,
  steps,
  className,
}: {
  summary: ReactNode;
  steps: WorkLogStep[];
  className?: string;
}) {
  return (
    <details
      open
      className={cn(
        "group flex w-full max-w-85 min-w-0 flex-col motion-details rounded-[16px] border border-border-default bg-bg-surface p-1.5",
        className,
      )}
    >
      <summary className="flex min-w-0 cursor-pointer list-none items-center gap-2 px-2.5 py-1.5 text-caption text-text-secondary [&::-webkit-details-marker]:hidden">
        <Wrench aria-hidden className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1">{summary}</span>
        <CaretDown
          aria-hidden
          className="size-3.5 shrink-0 transition-transform duration-200 ease-out-quint group-not-open:-rotate-90"
        />
      </summary>
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2.5 px-2.5 py-1.5">
          {step.running ? (
            <Spinner size="xs" />
          ) : (
            <CheckCircle aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
          )}
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-label-sm text-text-primary">{step.title}</span>
            {step.detail && <span className="truncate text-caption text-text-secondary">{step.detail}</span>}
          </span>
        </div>
      ))}
    </details>
  );
}
