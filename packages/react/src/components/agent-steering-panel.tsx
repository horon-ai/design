import { ArrowElbowDownLeft, ArrowUp, Check, Lightning, Pause, Play, Sparkle, X } from "@phosphor-icons/react";
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
  return <span aria-label="Waiting" className="size-4.25 rounded-full border border-dashed border-border-dashed" />;
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
      <div className="flex items-center gap-2.5 pt-4 pr-4 pb-3.5 pl-4.5">
        <Sparkle aria-hidden className="size-4.5 shrink-0 text-text-primary" />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-label-lg text-text-primary">{title}</h3>
          {subtitle && <p className="truncate text-caption text-text-secondary">{subtitle}</p>}
        </div>
        <span
          aria-hidden
          className={cn("size-1.75 shrink-0 rounded-full bg-status-live text-status-live", !paused && "animate-live-pulse")}
        />
        {status && <span className="shrink-0 text-body-sm text-text-secondary">{status}</span>}
        <button
          type="button"
          aria-label={paused ? "Resume" : "Pause"}
          aria-pressed={paused}
          onClick={() => onPausedChange?.(!paused)}
          className="flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-[10px] bg-overlay-ink-6 text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand [&>svg]:size-4"
        >
          {paused ? <Play aria-hidden weight="fill" /> : <Pause aria-hidden weight="fill" />}
        </button>
      </div>
      <div className="h-px bg-overlay-ink-12" />

      <ol className="flex flex-col gap-3 px-4.5 py-3">
        {steps.map((step, index) => (
          <li key={step.id} style={indexStyle(index)} className="motion-rise flex min-h-6.5 items-center gap-3">
            <span className="relative flex h-6.5 w-5 shrink-0 items-center justify-center">
              <Marker key={step.status} status={step.status} />
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-5.5 h-5 w-px",
                    step.status === "done" ? "bg-status-live" : "bg-overlay-ink-10",
                  )}
                />
              )}
            </span>
            <span
              className={cn(
                "min-w-0 flex-1 text-body-sm motion-colors",
                step.status === "todo" ? "text-text-secondary" : "text-text-primary",
              )}
            >
              {step.label}
            </span>
            {step.time && <span className="shrink-0 text-caption text-text-secondary">{step.time}</span>}
          </li>
        ))}
      </ol>
      <div className="h-px bg-overlay-ink-12" />

      <div className="flex flex-col gap-2.5 px-4.5 py-3.5">
        {notes.length > 0 && (
          <>
            <p className="flex items-center gap-2 text-caption tracking-[0.4px] text-text-secondary uppercase">
              Queued for the next step
              <Kbd>{queued.length}</Kbd>
            </p>
            <ul className="flex flex-col gap-2">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="motion-rise flex items-center gap-2.5 rounded-[10px] bg-overlay-ink-4 py-2 pr-2.5 pl-3.5"
                >
                  <span className="min-w-0 flex-1 text-body-sm text-text-primary">{note.text}</span>
                  {note.applied ? (
                    <span className="flex h-6.5 shrink-0 animate-pop-in items-center gap-1 rounded-full bg-interactive-primary px-2 text-label-sm text-text-inverse">
                      <Lightning aria-hidden weight="fill" className="size-3" />
                      Now
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onApplyNow?.(note.id)}
                        className="flex h-6.5 shrink-0 motion-press cursor-pointer items-center gap-1 rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
                      >
                        <Lightning aria-hidden className="size-3" />
                        Now
                      </button>
                      <button
                        type="button"
                        aria-label="Remove note"
                        onClick={() => onRemoveNote?.(note.id)}
                        className="flex size-6 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
                      >
                        <X aria-hidden className="size-3.5" />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex h-11 items-center gap-2 rounded-[14px] bg-overlay-ink-5 pr-1.5 pl-3.5">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
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
            className="flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-[10px] bg-interactive-primary text-text-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
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
