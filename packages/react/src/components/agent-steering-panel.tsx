import { ArrowUp, Check, Lightning, Path, Pause, Play, X } from "@phosphor-icons/react";
import { type ComponentProps, type CSSProperties, type ReactNode, useState } from "react";

import { useDevice } from "../hooks/use-device";
import { usePlatform } from "../hooks/use-platform";
import { cn } from "../lib/cn";
import { isModKey } from "../lib/platform";
import { Kbd } from "./kbd";
import { Spinner } from "./spinner";

/** Progress of one step: `done` fills the marker green, `active` shows a spinner, `todo` a dashed ring. */
export type SteeringStepStatus = "done" | "active" | "todo";

/** One step in the steering rail: its label, progress status and optional duration. */
export type SteeringStep = {
  /** Stable key for the step. */
  id: string;
  /** Step text; secondary colour while the step is still `todo`. */
  label: ReactNode;
  /** Progress marker to draw. */
  status: SteeringStepStatus;
  /** Duration of a finished or running step, such as "1.4s". */
  time?: ReactNode;
};

/** One steer note: the text and whether it has already been applied. */
export type SteeringNote = {
  /** Stable key for the note. */
  id: string;
  /** The steer text, shown on one row and wrapping as needed. */
  text: ReactNode;
  /** An applied note has left the queue and carries the "Now" pill. @default false */
  applied?: boolean;
};

/** Props for {@link AgentSteeringPanel}: the task header, the steps, queued notes and the steer handlers. */
export type AgentSteeringPanelProps = Omit<ComponentProps<"section">, "className" | "title"> & {
  /** Task name in the header, truncated to one line. */
  title: ReactNode;
  /** Second header line, such as the bot or workspace, truncated to one line. */
  subtitle?: ReactNode;
  /** The status text beside the live dot, such as "Running · 2m 10s". */
  status?: ReactNode;
  /** Pauses the live dot pulse and swaps the button to Play; the panel does not stop work on its own. @default false */
  paused?: boolean;
  /** Fires when the pause/resume button is pressed, with the next paused value. */
  onPausedChange?: (paused: boolean) => void;
  /** Ordered steps of the running task; the connector under a done step turns live green. */
  steps: SteeringStep[];
  /** Notes queued for the next step, plus any already applied. @default [] */
  notes?: SteeringNote[];
  /** Fires with the note id when its "Now" button is pressed, to apply it immediately. */
  onApplyNow?: (id: string) => void;
  /** Fires with the note id after its pop-out animation ends; remove it from `notes` here. */
  onRemoveNote?: (id: string) => void;
  /** Called with the text typed in the steer box: Enter queues it for the next step, Mod+Enter interrupts now. */
  onSteer?: (text: string, interrupt: boolean) => void;
  /** Placeholder of the steer input; also its accessible name. @default "Steer the bot…" */
  placeholder?: string;
  /** Extra classes merged onto the panel, for margins or a width override. */
  className?: string;
};

const noNotes: SteeringNote[] = [];
type IndexStyle = CSSProperties & {
  /** Step index, consumed by the staggered `motion-rise` delay. */
  "--i": number;
};
const indexStyle = (i: number): IndexStyle => ({ "--i": i });

/** Marker for one step: green check when done, spinner when active, dashed ring while waiting. */
// prettier-ignore
function Marker({ status }: {
  /** Progress state, also used as the marker's React key so the pop animation replays on change. */
  status: SteeringStepStatus;
}) {
  if (status === "done") {
    return (
      <span className="flex size-4.5 animate-pop-in items-center justify-center rounded-full bg-status-live text-text-on-ink">
        <Check aria-label="Done" weight="bold" className="size-3" />
      </span>
    );
  }
  if (status === "active") return <Spinner size={18} label="Running" />;
  return <span aria-label="Waiting" className="size-4.5 rounded-full border border-dashed border-border-dashed" />;
}

/** One queued note: the text, a "Now" action and a remove button, or a filled "Now" pill once applied. */
function SteeringNoteRow({
  note,
  onApplyNow,
  onRemoveNote,
}: {
  /** The note to render; `applied` swaps the actions for the filled pill. */
  note: SteeringNote;
  /** Called with the note id when "Now" is pressed. */
  onApplyNow?: (id: string) => void;
  /** Called with the note id when the pop-out animation finishes, so the parent can drop it. */
  onRemoveNote?: (id: string) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 rounded-md bg-overlay-ink-4 py-2 pr-2.5 pl-3.5",
        leaving ? "animate-pop-out" : "motion-rise",
      )}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onRemoveNote?.(note.id);
      }}
    >
      <span className="min-w-0 flex-1 text-body-sm text-text-primary">{note.text}</span>
      <span className="motion-swap shrink-0 justify-items-end">
        <span
          className="flex items-center gap-1.5"
          data-hidden={note.applied || undefined}
          aria-hidden={note.applied || undefined}
        >
          <button
            type="button"
            tabIndex={note.applied ? -1 : undefined}
            onClick={() => onApplyNow?.(note.id)}
            className="flex h-6.5 shrink-0 motion-press cursor-pointer items-center gap-1 rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <Lightning aria-hidden className="size-3" />
            Now
          </button>
          <button
            type="button"
            aria-label="Remove note"
            tabIndex={note.applied ? -1 : undefined}
            onClick={() => setLeaving(true)}
            className="flex size-6 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </span>
        <span
          className="flex h-6.5 items-center gap-1 rounded-full bg-interactive-primary px-2 text-label-sm text-text-inverse"
          data-hidden={!note.applied || undefined}
          aria-hidden={!note.applied || undefined}
        >
          <Lightning aria-hidden weight="fill" className="size-3" />
          Now
        </span>
      </span>
    </li>
  );
}

/**
 * Paper `Agent steering` (Y51-1): a 24px-radius surface panel with the running task header, a step rail, the notes
 * queued for the next step, and a steer box. The live dot pulses every 2s, a step marker swaps with a short pop,
 * new steps rise in 220ms, and send and pause press in 150ms.
 *
 * The steer draft is local state: it clears after `onSteer` fires, and the panel never queues a note itself.
 * Enter queues the text for the next step and Mod+Enter sends it as an interrupt — ⌘Enter on macOS and iOS,
 * Ctrl+Enter on Windows, Linux and Android. The two hint chips draw the same OS keys through `Kbd` and are
 * hidden on touch devices that show no keyboard hints. IME composition keystrokes are ignored so Korean and
 * Japanese input do not submit mid-character.
 *
 * @example
 * ```tsx
 * <AgentSteeringPanel
 *   title="Quarterly revenue review"
 *   status="Running · 2m 10s"
 *   steps={[
 *     { id: "read", label: "Read the sheet", status: "done", time: "1.4s" },
 *     { id: "summarise", label: "Summarise the rows", status: "active" },
 *   ]}
 *   onSteer={(text, interrupt) => steer(text, interrupt)}
 * />
 * ```
 */
export function AgentSteeringPanel({
  title,
  subtitle,
  status,
  paused = false,
  onPausedChange,
  steps,
  notes = noNotes,
  onApplyNow,
  onRemoveNote,
  onSteer,
  placeholder = "Steer the bot…",
  className,
  ...props
}: AgentSteeringPanelProps) {
  const [draft, setDraft] = useState("");
  const { os } = usePlatform();
  const { keyboardHints } = useDevice();
  const queued = notes.filter((note) => !note.applied);
  const submit = (interrupt: boolean) => {
    const text = draft.trim();
    if (!text) return;
    onSteer?.(text, interrupt);
    setDraft("");
  };

  return (
    <section
      className={cn(
        "flex w-full max-w-130 min-w-0 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 px-5 pt-4 pb-3.5">
        <Path aria-hidden className="size-4.5 shrink-0 text-text-primary" />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-label-lg text-text-primary">{title}</h3>
          {subtitle && <p className="truncate text-caption text-text-secondary">{subtitle}</p>}
        </div>
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full bg-status-live text-status-live",
            !paused && "animate-live-pulse",
          )}
        />
        {status && <span className="min-w-0 truncate text-body-sm text-text-secondary tabular-nums">{status}</span>}
        <button
          type="button"
          aria-label={paused ? "Resume" : "Pause"}
          aria-pressed={paused}
          onClick={() => onPausedChange?.(!paused)}
          className="flex size-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          <span className="motion-swap size-4">
            <Play aria-hidden weight="fill" data-hidden={!paused || undefined} className="size-4" />
            <Pause aria-hidden weight="fill" data-hidden={paused || undefined} className="size-4" />
          </span>
        </button>
      </div>
      <div className="h-px bg-overlay-ink-8" />

      <ol className="flex flex-col gap-3 px-5 py-3">
        {steps.map((step, index) => (
          <li
            key={step.id}
            style={indexStyle(index)}
            className="relative flex min-h-6.5 motion-rise items-center gap-3"
          >
            <span className="flex h-6.5 w-5 shrink-0 items-center justify-center">
              <Marker key={step.status} status={step.status} />
            </span>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-[calc(50%+12.5px)] bottom-[-18px] left-2.5 w-px",
                  step.status === "done" ? "bg-status-live" : "bg-overlay-ink-10",
                )}
              />
            )}
            <span
              className={cn(
                "min-w-0 flex-1 text-body-sm motion-colors",
                step.status === "todo" ? "text-text-secondary" : "text-text-primary",
              )}
            >
              {step.label}
            </span>
            {step.time && <span className="shrink-0 text-caption text-text-secondary tabular-nums">{step.time}</span>}
          </li>
        ))}
      </ol>
      <div className="h-px bg-overlay-ink-8" />

      <div className="flex flex-col gap-2.5 px-5 py-3.5">
        <div className="motion-reveal" data-collapsed={notes.length === 0 || undefined}>
          <div className="flex flex-col gap-2.5">
            <p className="flex items-center gap-2 text-caption text-text-secondary">
              Queued for the next step
              <Kbd>{queued.length}</Kbd>
            </p>
            <ul className="flex flex-col gap-2">
              {notes.map((note) => (
                <SteeringNoteRow key={note.id} note={note} onApplyNow={onApplyNow} onRemoveNote={onRemoveNote} />
              ))}
            </ul>
          </div>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full bg-overlay-ink-5 pr-1.5 pl-4">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing || event.keyCode === 229) return;
              if (event.key === "Enter") {
                event.preventDefault();
                submit(isModKey(event, os));
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="min-w-0 flex-1 bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
          <button
            type="button"
            aria-label="Send"
            onClick={() => submit(false)}
            className="flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-interactive-primary text-text-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
          >
            <ArrowUp aria-hidden className="size-4" />
          </button>
        </div>

        {keyboardHints && (
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-caption text-text-secondary">
            <span className="flex items-center gap-1.25">
              <Kbd keys="Enter" />
              next step
            </span>
            <span className="flex items-center gap-1.25">
              <Kbd keys="Mod+Enter" />
              interrupt now
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
