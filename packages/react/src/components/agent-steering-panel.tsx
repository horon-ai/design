import { ArrowElbowDownLeft, ArrowUp, Check, Lightning, Path, Pause, Play, X } from "@phosphor-icons/react";
import { type ComponentProps, type CSSProperties, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { Kbd } from "./kbd";
import { Spinner } from "./spinner";

export type SteeringStepStatus = "done" | "active" | "todo";

export type SteeringStep = {
  id: string;
  label: ReactNode;
  status: SteeringStepStatus;
  /** Duration of a finished or running step, such as "1.4s". */
  time?: ReactNode;
};

export type SteeringNote = {
  id: string;
  text: ReactNode;
  /** An applied note has left the queue and carries the "Now" pill. */
  applied?: boolean;
};

export type AgentSteeringPanelProps = Omit<ComponentProps<"section">, "className" | "title"> & {
  title: ReactNode;
  subtitle?: ReactNode;
  /** The status text beside the live dot, such as "Running · 2m 10s". */
  status?: ReactNode;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  steps: SteeringStep[];
  notes?: SteeringNote[];
  onApplyNow?: (id: string) => void;
  onRemoveNote?: (id: string) => void;
  /** Called with the text typed in the steer box: Enter queues it for the next step, ⌘Enter interrupts now. */
  onSteer?: (text: string, interrupt: boolean) => void;
  placeholder?: string;
  className?: string;
};

const noNotes: SteeringNote[] = [];
type IndexStyle = CSSProperties & { "--i": number };
const indexStyle = (i: number): IndexStyle => ({ "--i": i });

function Marker({ status }: { status: SteeringStepStatus }) {
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

function SteeringNoteRow({
  note,
  onApplyNow,
  onRemoveNote,
}: {
  note: SteeringNote;
  onApplyNow?: (id: string) => void;
  onRemoveNote?: (id: string) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 rounded-[10px] bg-overlay-ink-4 py-2 pr-2.5 pl-3.5",
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
        "flex w-full max-w-130 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3.5">
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
        {status && <span className="shrink-0 text-body-sm text-text-secondary tabular-nums">{status}</span>}
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
                submit(event.metaKey || event.ctrlKey);
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

        <div className="flex items-center gap-3.5 text-caption text-text-secondary">
          <span className="flex items-center gap-1.25">
            <Kbd>
              <ArrowElbowDownLeft aria-hidden />
            </Kbd>
            next step
          </span>
          <span className="flex items-center gap-1.25">
            <Kbd>⌘</Kbd>
            <Kbd>
              <ArrowElbowDownLeft aria-hidden />
            </Kbd>
            interrupt now
          </span>
        </div>
      </div>
    </section>
  );
}
