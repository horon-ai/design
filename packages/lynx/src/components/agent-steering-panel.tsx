import { useRef, useState, type ReactNode } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types/background";
import type { CSSProperties } from "@lynx-js/types";

import { useDevice } from "../hooks/use-device";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
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

/** Props of the native `section` react spread onto the panel; Lynx has no such element, so it is a `view`. */
type PortedSectionAttributes = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the panel's own. */
  style?: CSSProperties;
};

/** Props for {@link AgentSteeringPanel}: the task header, the steps, queued notes and the steer handlers. */
export type AgentSteeringPanelProps = Omit<PortedSectionAttributes, "className"> & {
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

/** The Figma spring (`--ease-spring`), written out because an inline animation cannot read a variable. */
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/** The quint curve the live dot runs, written out for an inline style. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Lynx's engine paints the placeholder from this variable, which the class list sets on the field. */
const PLACEHOLDER_CLASS = "[--placeholder-color:var(--color-text-secondary)]";

/** The only part of a Lynx text event the panel reads. */
type LynxTextEvent = { detail: { value: string } };

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** Marker for one step: green check when done, spinner when active, dashed ring while waiting. */
// prettier-ignore
function Marker({ status }: {
  /** Progress state, also used as the marker's React key so the pop animation replays on change. */
  status: SteeringStepStatus;
}) {
  if (status === "done") {
    return (
      <view
        className="flex size-[18px] flex-row items-center justify-center rounded-full bg-status-live"
        style={{
          animationName: "pop-in",
          animationDuration: "220ms",
          animationTimingFunction: EASE_SPRING,
          animationFillMode: "both",
        }}
        accessibility-element
        accessibility-label="Done"
        accessibility-role-description="image"
      >
        <Icon name="Check" size={12} weight="bold" color="text-on-ink" />
      </view>
    );
  }
  if (status === "active") return <Spinner size={18} label="Running" />;
  return (
    <view
      className="size-[18px] rounded-full border border-dashed border-border-dashed"
      accessibility-element
      accessibility-label="Waiting"
      accessibility-role-description="image"
    />
  );
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
    <view
      className={cn(
        "flex flex-row items-center gap-2.5 rounded-[10px] bg-overlay-ink-4 py-2 pr-2.5 pl-3.5",
        leaving ? "" : "motion-rise",
      )}
      style={{
        animationName: leaving ? "pop-out" : "pop-in",
        animationDuration: leaving ? "130ms" : "220ms",
        animationTimingFunction: leaving ? "ease-in" : EASE_SPRING,
        animationFillMode: "both",
      }}
      bindanimationend={() => {
        if (leaving) onRemoveNote?.(note.id);
      }}
    >
      {isPlainText(note.text) ? (
        <text className="min-w-0 flex-1 text-body-sm break-all text-text-primary">{note.text}</text>
      ) : (
        <view className="min-w-0 flex-1">{note.text}</view>
      )}
      {note.applied ? (
        <view className="flex h-[26px] shrink-0 flex-row items-center gap-1 rounded-full bg-interactive-primary px-2">
          <Icon name="Lightning" size={12} weight="fill" color="text-inverse" />
          <text className="text-label-sm text-text-inverse">Now</text>
        </view>
      ) : (
        <view className="flex shrink-0 flex-row items-center gap-1.5">
          <view
            className="flex h-[26px] shrink-0 flex-row items-center gap-1 rounded-full bg-overlay-ink-6 px-2 motion-press active:bg-overlay-ink-10"
            bindtap={() => onApplyNow?.(note.id)}
            accessibility-element
            accessibility-traits="button"
          >
            <Icon name="Lightning" size={12} color="text-primary" />
            <text className="text-label-sm text-text-primary">Now</text>
          </view>
          <view
            className="flex size-6 shrink-0 flex-row items-center justify-center rounded-full motion-press active:bg-overlay-ink-6"
            bindtap={() => setLeaving(true)}
            accessibility-element
            accessibility-traits="button"
            accessibility-label="Remove note"
          >
            <Icon name="X" size={14} color="text-secondary" />
          </view>
        </view>
      )}
    </view>
  );
}

/**
 * Paper `Agent steering` (Y51-1): a 24px-radius surface panel with the running task header, a step rail, the
 * notes queued for the next step, and a steer box. The live dot pulses every 2s, a step marker swaps with a
 * short pop, new steps rise in 220ms, and send and pause press in 150ms.
 *
 * The steer draft is local state: it clears after `onSteer` fires, and the panel never queues a note itself.
 * Enter queues the text for the next step and Mod+Enter sends it as an interrupt — ⌘Enter on macOS and iOS,
 * Ctrl+Enter on Windows, Linux and Android. React read those keys from `keydown`; Lynx delivers the soft
 * keyboard's confirm key instead, so `bindconfirm` interrupts while the send button queues, and the two hint
 * chips still draw the OS keys through `Kbd` (hidden on touch devices that show no keyboard hints).
 *
 * React stacked the pause/play glyphs and the two note actions inside `motion-swap`; Lynx cannot match
 * `[data-hidden]` in its stylesheet, so only the active state is mounted.
 *
 * @example
 * ```tsx
 * import { AgentSteeringPanel } from "@horon-ai/lynx";
 *
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
  id,
  style,
}: AgentSteeringPanelProps) {
  const [draft, setDraft] = useState("");
  const { keyboardHints } = useDevice();
  const queued = notes.filter((note) => !note.applied);
  const field = useRef<NodesRef | null>(null);

  /** Empties the native editor too, because a Lynx `<input>` keeps its own text. */
  const clear = () => {
    setDraft("");
    const element = field.current;
    if (!element) return;
    try {
      element.invoke({ method: "setValue", params: { value: "" } }).exec();
    } catch {
      // Nothing to clear in a test host; the empty state is the observable.
    }
  };

  const submit = (interrupt: boolean) => {
    const text = draft.trim();
    if (!text) return;
    onSteer?.(text, interrupt);
    clear();
  };

  return (
    <view
      className={cn(
        "flex w-full max-w-[520px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex flex-row flex-wrap items-center gap-x-2.5 gap-y-2 px-5 pt-4 pb-3.5">
        <Icon name="Path" size={18} color="text-primary" />
        <view className="flex min-w-0 flex-1 flex-col">
          {isPlainText(title) ? (
            <text className="truncate text-label-lg text-text-primary">{title}</text>
          ) : (
            <view className="min-w-0">{title}</view>
          )}
          {subtitle ? (
            isPlainText(subtitle) ? (
              <text className="truncate text-caption text-text-secondary">{subtitle}</text>
            ) : (
              <view className="min-w-0">{subtitle}</view>
            )
          ) : null}
        </view>
        <view
          className="size-1.5 shrink-0 rounded-full bg-status-live"
          style={
            paused
              ? undefined
              : {
                  animationName: "live-pulse",
                  animationDuration: "2s",
                  animationTimingFunction: EASE_OUT_QUINT,
                  animationIterationCount: "infinite",
                }
          }
          accessibility-elements-hidden
        />
        {status ? (
          isPlainText(status) ? (
            <text className="min-w-0 truncate text-body-sm text-text-secondary tabular-nums">{status}</text>
          ) : (
            <view className="min-w-0">{status}</view>
          )
        ) : null}
        <view
          className="flex size-[30px] shrink-0 flex-row items-center justify-center rounded-full bg-overlay-ink-6 motion-press active:bg-overlay-ink-10"
          bindtap={() => onPausedChange?.(!paused)}
          accessibility-element
          accessibility-traits="button"
          accessibility-label={paused ? "Resume" : "Pause"}
          accessibility-value={paused ? "true" : "false"}
        >
          {paused ? (
            <Icon name="Play" size={16} weight="fill" color="text-primary" />
          ) : (
            <Icon name="Pause" size={16} weight="fill" color="text-primary" />
          )}
        </view>
      </view>
      <view className="h-px bg-overlay-ink-8" accessibility-role-description="separator" />

      <view className="flex flex-col gap-3 px-5 py-3">
        {steps.map((step, index) => (
          <view
            key={step.id}
            className="relative flex min-h-[26px] flex-row items-center gap-3 motion-rise"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <view className="flex h-[26px] w-5 shrink-0 flex-row items-center justify-center">
              <Marker key={step.status} status={step.status} />
            </view>
            {index < steps.length - 1 ? (
              <view
                className={cn(
                  "absolute left-2.5 w-px",
                  step.status === "done" ? "bg-status-live" : "bg-overlay-ink-10",
                )}
                style={{ top: "calc(50% + 12.5px)", bottom: "-18px" }}
                accessibility-elements-hidden
              />
            ) : null}
            {isPlainText(step.label) ? (
              <text
                className={cn(
                  "min-w-0 flex-1 text-body-sm motion-colors",
                  step.status === "todo" ? "text-text-secondary" : "text-text-primary",
                )}
              >
                {step.label}
              </text>
            ) : (
              <view className="min-w-0 flex-1">{step.label}</view>
            )}
            {step.time ? (
              isPlainText(step.time) ? (
                <text className="shrink-0 text-caption text-text-secondary tabular-nums">{step.time}</text>
              ) : (
                <view className="shrink-0">{step.time}</view>
              )
            ) : null}
          </view>
        ))}
      </view>
      <view className="h-px bg-overlay-ink-8" accessibility-role-description="separator" />

      <view className="flex flex-col gap-2.5 px-5 py-3.5">
        {notes.length > 0 ? (
          <view className="flex flex-col gap-2.5">
            <view className="flex flex-row items-center gap-2">
              <text className="text-caption text-text-secondary">Queued for the next step</text>
              <Kbd>{queued.length}</Kbd>
            </view>
            <view className="flex flex-col gap-2">
              {notes.map((note) => (
                <SteeringNoteRow key={note.id} note={note} onApplyNow={onApplyNow} onRemoveNote={onRemoveNote} />
              ))}
            </view>
          </view>
        ) : null}

        <view className="flex h-11 flex-row items-center gap-2 rounded-full bg-overlay-ink-5 pr-1.5 pl-4">
          <input
            className={cn("min-w-0 flex-1 text-body-sm text-text-primary", PLACEHOLDER_CLASS)}
            ref={field}
            default-value={draft}
            placeholder={placeholder}
            accessibility-element
            accessibility-label={placeholder}
            bindinput={(event: LynxTextEvent) => setDraft(event.detail.value)}
            bindconfirm={() => submit(true)}
          />
          <view
            className="flex size-8 shrink-0 flex-row items-center justify-center rounded-full bg-interactive-primary motion-press active:bg-interactive-primary-hover"
            bindtap={() => submit(false)}
            accessibility-element
            accessibility-traits="button"
            accessibility-label="Send"
          >
            <Icon name="ArrowUp" size={16} color="text-inverse" />
          </view>
        </view>

        {keyboardHints ? (
          <view className="flex flex-row flex-wrap items-center gap-x-3.5 gap-y-1.5">
            <view className="flex flex-row items-center gap-[5px]">
              <Kbd keys="Enter" />
              <text className="text-caption text-text-secondary">next step</text>
            </view>
            <view className="flex flex-row items-center gap-[5px]">
              <Kbd keys="Mod+Enter" />
              <text className="text-caption text-text-secondary">interrupt now</text>
            </view>
          </view>
        ) : null}
      </view>
    </view>
  );
}
