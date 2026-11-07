import { CaretDown, Play } from "@phosphor-icons/react";
import { type ComponentProps, type KeyboardEvent, type ReactNode, useRef, useState } from "react";

import { cn } from "../lib/cn";
import { useActiveIndicator } from "../hooks/use-active-indicator";
import { useDevice } from "../hooks/use-device";
import { Kbd } from "./kbd";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export type PanelPillTabsProps = {
  items: { value: string; label: ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  "aria-label"?: string;
  className?: string;
};

/**
 * The 5% ink pill track shared by the Bot panels (Paper `YNQ-1`): 3px padding, 2px gap, 28px options with
 * 12px inset and a 10% ink selection that slides between options in 280ms.
 */
export function PanelPillTabs({ items, value, defaultValue, onValueChange, className, ...props }: PanelPillTabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value ?? "");
  const selected = value ?? inner;
  const track = useRef<HTMLDivElement>(null);
  const { rect, animate } = useActiveIndicator(track, '[aria-selected="true"]');

  const select = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const at = items.findIndex((item) => item.value === selected);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = items[(at + step + items.length) % items.length];
    if (!next) return;
    event.preventDefault();
    select(next.value);
    track.current?.querySelectorAll<HTMLElement>('[role="tab"]')[items.indexOf(next)]?.focus();
  };

  return (
    <div
      ref={track}
      role="tablist"
      aria-label={props["aria-label"]}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex max-w-full min-w-0 items-center gap-0.5 overflow-x-auto rounded-full bg-overlay-ink-5 p-[3px]",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("pointer-events-none absolute rounded-full bg-overlay-ink-10", animate && "motion-indicator")}
        style={rect ? { ...rect, opacity: 1 } : { opacity: 0 }}
      />
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => select(item.value)}
            className={cn(
              "relative flex h-7.5 cursor-pointer items-center rounded-full px-3 text-label-md whitespace-nowrap motion-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-brand",
              active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export type InstructionVariableTone = "sky" | "brand" | "neutral";

const variableToneClass: Record<InstructionVariableTone, string> = {
  sky: "bg-accent-sky-500-18 ring-accent-sky-500-90/40",
  brand: "bg-accent-sky-700-18 ring-accent-sky-700-90/40",
  neutral: "bg-text-placeholder-18 ring-text-placeholder-90/40",
};

const variableDotClass: Record<InstructionVariableTone, string> = {
  sky: "bg-sky-500",
  brand: "bg-sky-700",
  neutral: "bg-neutral-500",
};

/** One piece of an instruction line: plain text, or a `{{variable}}` chip. */
export type InstructionPart = string | { variable: string; tone?: InstructionVariableTone };

export type InstructionVariable = { name: string; tone?: InstructionVariableTone; value: string };

export type BotInstructionsPanelProps = WithClass<Omit<ComponentProps<"section">, "title">> & {
  title?: ReactNode;
  /** Version label in the header pill, for example `v4`. */
  version?: string;
  /** Status next to the version, rendered with a live dot. */
  versionStatus?: string;
  bot: { initial: string; name: string };
  /** The editable prompt, one array of parts per line. */
  instructions: InstructionPart[][];
  /** Shown under the Example tab instead of the prompt. */
  example?: ReactNode;
  tokenCount?: number;
  /** Test values for each variable in the prompt. */
  variables?: InstructionVariable[];
  scenarios?: string[];
  defaultScenario?: string;
  onRun?: (scenario: string | undefined) => void;
  /** The last run's output, or a hint until there is one. */
  output?: ReactNode;
  /** Makes the version pill actionable; without it the pill is a plain label. */
  onVersionClick?: () => void;
  /** Makes the bot pill actionable; without it the pill is a plain label. */
  onBotClick?: () => void;
};

function partKey(part: InstructionPart) {
  return typeof part === "string" ? part : part.variable;
}

function VariableChip({
  tone = "sky",
  className,
  children,
}: {
  tone?: InstructionVariableTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("rounded-xs px-1.5 py-px ring-1 ring-inset", variableToneClass[tone], className)}>
      {children}
    </span>
  );
}

function Divider() {
  return <div role="separator" className="h-px self-stretch bg-overlay-ink-8" />;
}

/**
 * Bot instructions panel (Paper `YN3-1` / `GOZ-0`): a 24px-radius surface with the bot header, an
 * Instructions / Example tab pair over the prompt text with `{{variable}}` chips, and a test-run block.
 */
export function BotInstructionsPanel({
  title = "Instructions",
  version,
  versionStatus,
  bot,
  instructions,
  example,
  tokenCount,
  variables,
  scenarios,
  defaultScenario,
  onRun,
  output,
  onVersionClick,
  onBotClick,
  className,
  ...props
}: BotInstructionsPanelProps) {
  const [tab, setTab] = useState("instructions");
  const [scenario, setScenario] = useState(defaultScenario ?? scenarios?.[0]);
  const [runCount, setRunCount] = useState(0);
  const { keyboardHints } = useDevice();

  return (
    <section
      className={cn(
        "flex w-full max-w-155 min-w-0 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-3.5">
        <h3 className="min-w-0 text-label-lg text-text-primary">{title}</h3>
        {version ? (
          onVersionClick ? (
            <button
              type="button"
              onClick={onVersionClick}
              className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-6 px-2.5 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              {version}
              {versionStatus ? (
                <>
                  <span
                    aria-hidden
                    className="size-1.5 animate-live-pulse rounded-full bg-status-live text-status-live"
                  />
                  <span className="text-text-secondary">{versionStatus}</span>
                </>
              ) : null}
              <CaretDown aria-hidden className="size-3 text-text-secondary" />
            </button>
          ) : (
            <span className="flex h-7.5 shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-6 px-2.5 text-label-sm text-text-primary">
              {version}
              {versionStatus ? (
                <>
                  <span
                    aria-hidden
                    className="size-1.5 animate-live-pulse rounded-full bg-status-live text-status-live"
                  />
                  <span className="text-text-secondary">{versionStatus}</span>
                </>
              ) : null}
            </span>
          )
        ) : null}
        <span className="min-w-0 flex-1" />
        {onBotClick ? (
          <button
            type="button"
            onClick={onBotClick}
            className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-2.5 pl-1.5 text-label-sm text-text-primary hover:bg-overlay-ink-10 focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <span className="flex size-4.5 items-center justify-center rounded-[5px] bg-interactive-primary text-label-sm text-text-inverse">
              {bot.initial}
            </span>
            {bot.name}
            <CaretDown aria-hidden className="size-3 text-text-secondary" />
          </button>
        ) : (
          <span className="flex h-7.5 shrink-0 items-center gap-1.5 rounded-full bg-overlay-ink-6 pr-2.5 pl-1.5 text-label-sm text-text-primary">
            <span className="flex size-4.5 items-center justify-center rounded-[5px] bg-interactive-primary text-label-sm text-text-inverse">
              {bot.initial}
            </span>
            {bot.name}
          </span>
        )}
      </header>
      <Divider />
      <div className="flex flex-col gap-1 px-5 pt-3 pb-3.5">
        <div className="flex items-center gap-2 pb-2">
          <PanelPillTabs
            aria-label="Instructions view"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: "instructions", label: "Instructions" },
              { value: "example", label: "Example" },
            ]}
          />
          <span className="min-w-0 flex-1" />
          {tokenCount === undefined ? null : (
            <span className="text-caption text-text-secondary">{tokenCount} tokens</span>
          )}
        </div>
        <div
          key={tab}
          className="group flex motion-rise flex-col gap-1 rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-text-brand"
          tabIndex={0}
        >
          {tab === "example" && example !== undefined ? (
            <div className="text-body-sm text-text-primary">{example}</div>
          ) : (
            instructions.map((line, index) => (
              <p
                key={line.map(partKey).join("|")}
                className="flex flex-wrap items-center gap-1 text-body-sm text-text-primary"
              >
                {/* A lone period after a `{{variable}}` is its own flex item; pull it back
                    so the 4px gap between items does not open before the punctuation. */}
                {line.map((part) =>
                  typeof part === "string" ? (
                    <span key={part} className={cn(/^[,.;:!?%)\]]/.test(part) && "-ml-1")}>
                      {part}
                    </span>
                  ) : (
                    <VariableChip key={part.variable} tone={part.tone}>
                      {part.variable}
                    </VariableChip>
                  ),
                )}
                {index === instructions.length - 1 ? (
                  <span
                    aria-hidden
                    className="hidden h-4 w-px animate-caret bg-text-primary group-focus-within:inline-block"
                  />
                ) : null}
              </p>
            ))
          )}
        </div>
        <div className="flex items-center gap-1.5 pt-2 text-caption text-text-secondary">
          Type
          <span className="rounded-md bg-overlay-ink-6 px-1.5 py-px">{"{{"}</span>
          to add a variable
        </div>
      </div>
      {variables || scenarios ? (
        <>
          <Divider />
          <div className="flex flex-col gap-2.5 px-5 pt-3 pb-3.5">
            {variables ? (
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <div key={variable.name} className="flex min-w-0 flex-1 basis-35 flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-caption text-text-secondary">
                      <span
                        aria-hidden
                        className={cn("size-1.5 rounded-full", variableDotClass[variable.tone ?? "sky"])}
                      />
                      {variable.name}
                    </div>
                    <div className="flex h-10 min-w-0 items-center rounded-md bg-overlay-ink-5 px-3 text-body-sm text-text-primary">
                      <span className="min-w-0 truncate">{variable.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {scenarios ? (
                <PanelPillTabs
                  aria-label="Scenario"
                  value={scenario}
                  onValueChange={setScenario}
                  items={scenarios.map((name) => ({ value: name, label: name }))}
                />
              ) : null}
              <span className="min-w-0 flex-1" />
              <button
                type="button"
                onClick={() => {
                  setRunCount((count) => count + 1);
                  onRun?.(scenario);
                }}
                className="flex h-7.5 shrink-0 motion-press cursor-pointer items-center justify-center gap-1.5 rounded-full bg-interactive-primary pr-3 pl-3.5 text-label-sm text-text-inverse hover:bg-interactive-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
              >
                <Play aria-hidden className="size-3.5" />
                Run
                {keyboardHints && (
                  <Kbd keys="Mod+Enter" className="bg-bg-surface-6 text-text-inverse/80" />
                )}
              </button>
            </div>
          </div>
        </>
      ) : null}
      <div className="motion-reveal" data-collapsed={output === undefined || undefined}>
        <div>
          {output === undefined ? null : (
            <div
              key={runCount}
              className="motion-rise bg-overlay-ink-3 px-5 pt-3.5 pb-4 text-body-sm text-text-secondary"
            >
              {output}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
