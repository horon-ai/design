import { useState, type ReactNode } from "@lynx-js/react";

import { useActiveIndicator } from "../hooks/use-active-indicator";
import { useDevice } from "../hooks/use-device";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/** Drops the base type's `className` so the panel can own it. */
type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged onto the root element. */
  className?: string;
};

/** Props for {@link PanelPillTabs}: the tab items, the controlled or default selection and the change handler. */
export type PanelPillTabsProps = {
  /** Tabs in display order; the first one is the default selection. */
  items: {
    /** Value handed to `onValueChange` and compared against `value`. */
    value: string;
    /** Tab label. */
    label: ReactNode;
  }[];
  /** Controlled selected value; omit it to let the track keep its own selection. */
  value?: string;
  /** Selection used before the first tap, falling back to the first item. */
  defaultValue?: string;
  /** Fires with the next value on tap or arrow-key navigation. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the tab list. */
  "aria-label"?: string;
  /** Extra classes merged onto the track, for width overrides. */
  className?: string;
};

/** The subset of a Lynx key event the tab list reads. */
type LynxKeyEvent = {
  /** Key name, e.g. `ArrowRight`. */
  key?: string;
};

/**
 * The 5% ink pill track shared by the Bot panels (Paper `YNQ-1`): 3px padding, 2px gap, 30px options with
 * 12px inset and a 10% ink selection that slides between options in 280ms.
 *
 * Works controlled (`value`) or uncontrolled (`defaultValue`). Lynx cannot focus an element from code, so
 * the arrow keys move the selection but the focus stays where the keyboard already is.
 *
 * @example
 * ```tsx
 * import { PanelPillTabs } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <PanelPillTabs
 *       aria-label="Instructions view"
 *       items={[
 *         { value: "instructions", label: "Instructions" },
 *         { value: "example", label: "Example" },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function PanelPillTabs({ items, value, defaultValue, onValueChange, className, ...props }: PanelPillTabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value ?? "");
  const selected = value ?? inner;
  const activeIndex = items.findIndex((item) => item.value === selected);
  const { rect, animate, bindTrack, bindItem } = useActiveIndicator(activeIndex);

  const select = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };
  const onKeyDown = (event: LynxKeyEvent) => {
    const key = event.key;
    if (key !== "ArrowRight" && key !== "ArrowLeft") return;
    const step = key === "ArrowRight" ? 1 : -1;
    const next = items[(activeIndex + step + items.length) % items.length];
    if (!next) return;
    select(next.value);
  };

  return (
    <view
      className={cn(
        "relative flex min-w-0 max-w-full flex-row items-center gap-0.5 overflow-hidden rounded-full bg-overlay-ink-5 p-[3px]",
        className,
      )}
      bindlayoutchange={bindTrack}
      bindkeydown={onKeyDown}
      accessibility-element
      accessibility-role-description="tablist"
      accessibility-label={props["aria-label"]}
    >
      <view
        className={cn("pointer-events-none absolute rounded-full bg-overlay-ink-10", animate && "motion-indicator")}
        style={{
          left: rect ? rect.left : 0,
          top: rect ? rect.top : 0,
          width: rect ? rect.width : 0,
          height: rect ? rect.height : 0,
          opacity: rect ? 1 : 0,
        }}
      />
      {items.map((item, index) => {
        const active = item.value === selected;
        return (
          <view key={item.value} className="relative shrink-0" {...bindItem(index)}>
            <view
              className={cn(
                "motion-colors flex h-[30px] flex-row items-center whitespace-nowrap rounded-full px-3",
                active ? "text-text-primary" : "text-text-secondary active:text-text-primary",
              )}
              bindtap={() => select(item.value)}
              accessibility-element
              accessibility-traits={active ? "selected" : "button"}
              accessibility-value={active ? "true" : "false"}
            >
              {typeof item.label === "string" || typeof item.label === "number" ? (
                <text
                  className={cn(
                    "whitespace-nowrap text-label-md",
                    active ? "text-text-primary" : "text-text-secondary",
                  )}
                >
                  {item.label}
                </text>
              ) : (
                item.label
              )}
            </view>
          </view>
        );
      })}
    </view>
  );
}

/** Chip tint: `sky` the default light blue, `brand` the deeper sky-700, `neutral` grey. */
export type InstructionVariableTone = "sky" | "brand" | "neutral";

/** Border and fill of a `{{variable}}` chip; Lynx has no inset ring, so the 1px rim is a border. */
const variableToneClass: Record<InstructionVariableTone, string> = {
  sky: "bg-accent-sky-500-18 border-accent-sky-500-90",
  brand: "bg-accent-sky-700-18 border-accent-sky-700-90",
  neutral: "bg-text-placeholder-18 border-text-placeholder-90",
};

const variableDotClass: Record<InstructionVariableTone, string> = {
  sky: "bg-sky-500",
  brand: "bg-sky-700",
  neutral: "bg-neutral-500",
};

/** One piece of an instruction line: plain text, or a `{{variable}}` chip. */
export type InstructionPart =
  | string
  | {
      /** Variable name, rendered inside the chip without the braces. */
      variable: string;
      /** Chip tint. @default "sky" */
      tone?: InstructionVariableTone;
    };

/** A test value for one `{{variable}}` in the prompt, shown under the instructions. */
export type InstructionVariable = {
  /** Variable name shown above the test value. */
  name: string;
  /** Dot tint matching the chip in the prompt. @default "sky" */
  tone?: InstructionVariableTone;
  /** Test value used when the instruction is run. */
  value: string;
};

/** Props for {@link BotInstructionsPanel}: the bot, the prompt lines, the optional example, variables and scenarios, and the run handler. */
export type BotInstructionsPanelProps = WithClass<{
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
}> & {
  /** Panel heading. @default "Instructions" */
  title?: ReactNode;
  /** Version label in the header pill, for example `v4`. */
  version?: string;
  /** Status next to the version, rendered with a live dot. */
  versionStatus?: string;
  /** Bot whose prompt is shown; the initial fills the 18px tile. */
  bot: {
    /** One-character tile label. */
    initial: string;
    /** Bot name next to the tile. */
    name: string;
  };
  /** The prompt text, one array of parts per line, rendered read-only. */
  instructions: InstructionPart[][];
  /** Shown under the Example tab instead of the prompt. */
  example?: ReactNode;
  /** Prompt length shown at the right of the tab row; hidden when undefined. */
  tokenCount?: number;
  /** Test values for each variable in the prompt. */
  variables?: InstructionVariable[];
  /** Test scenarios offered as pills under the prompt. */
  scenarios?: string[];
  /** Scenario selected on first render, falling back to the first scenario. */
  defaultScenario?: string;
  /** Fires with the selected scenario (or undefined) when Run is pressed; the panel does not run anything itself. */
  onRun?: (scenario: string | undefined) => void;
  /** The last run's output, or a hint until there is one. */
  output?: ReactNode;
  /** Makes the version pill actionable; without it the pill is a plain label. */
  onVersionClick?: () => void;
  /** Makes the bot pill actionable; without it the pill is a plain label. */
  onBotClick?: () => void;
};

/** The quint curve the live dot runs, written out because an inline style cannot read a CSS variable. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Inline rounded chip that stands in for a `{{variable}}` inside a prompt line. */
function VariableChip({
  tone = "sky",
  className,
  children,
}: {
  /** Chip tint. @default "sky" */
  tone?: InstructionVariableTone;
  /** Extra classes merged onto the chip. */
  className?: string;
  /** Variable name shown without braces. */
  children: ReactNode;
}) {
  return (
    <view className={cn("rounded-xs border px-1.5 py-px", variableToneClass[tone], className)}>
      {typeof children === "string" || typeof children === "number" ? (
        <text className="text-body-sm text-text-primary">{children}</text>
      ) : (
        children
      )}
    </view>
  );
}

function Divider() {
  return <view className="h-px self-stretch bg-overlay-ink-8" accessibility-role-description="separator" />;
}

/** The live dot beside the version label; Lynx has no `animate-live-pulse` utility, so the pulse runs inline. */
function LiveDot() {
  return (
    <view
      className="size-1.5 rounded-full bg-status-live"
      style={{
        animationName: "live-pulse",
        animationDuration: "2s",
        animationTimingFunction: EASE_OUT_QUINT,
        animationIterationCount: "infinite",
      }}
    />
  );
}

/**
 * Bot instructions panel (Paper `YN3-1` / `GOZ-0`): a 24px-radius surface with the bot header, an
 * Instructions / Example tab pair over the prompt text with `{{variable}}` chips, and a test-run block.
 *
 * The tab and the selected scenario are local state; the panel only reports a run through `onRun`. Output
 * is re-keyed per run so it animates in every time. The prompt area is focusable (`focusable` plus
 * `bindfocus`/`bindblur`) and a caret blinks at its end while it holds focus; Lynx has no
 * `group-focus-within`, so the caret reads that state directly. The Run button carries a `Mod+Enter`
 * chip — ⌘↵ on macOS and iOS, Ctrl+Enter elsewhere — which is hidden on touch devices that show no
 * keyboard hints. The prompt is read-only, as in react: the panel reports runs instead of editing text.
 *
 * @example
 * ```tsx
 * import { BotInstructionsPanel } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <BotInstructionsPanel
 *       version="v4"
 *       bot={{ initial: "R", name: "Researcher" }}
 *       instructions={[["Summarise ", { variable: "sheet" }, " for the team."]]}
 *       variables={[{ name: "sheet", value: "Q3 metrics" }]}
 *       scenarios={["Weekly digest", "Board update"]}
 *       onRun={(scenario) => run(scenario)}
 *     />
 *   );
 * }
 * ```
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
  id,
}: BotInstructionsPanelProps) {
  const [tab, setTab] = useState("instructions");
  const [scenario, setScenario] = useState(defaultScenario ?? scenarios?.[0]);
  const [runCount, setRunCount] = useState(0);
  const [focused, setFocused] = useState(false);
  const { keyboardHints } = useDevice();

  const versionParts = versionStatus ? (
    <view className="flex flex-row items-center gap-1.5">
      <LiveDot />
      <text className="text-label-sm text-text-secondary">{versionStatus}</text>
    </view>
  ) : null;

  return (
    <view
      className={cn(
        "flex w-full min-w-0 max-w-[620px] flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex flex-row flex-wrap items-center gap-2 px-5 pb-3.5 pt-4">
        <view className="min-w-0">
          {typeof title === "string" || typeof title === "number" ? (
            <text className="text-label-lg text-text-primary">{title}</text>
          ) : (
            title
          )}
        </view>
        {version ? (
          onVersionClick ? (
            <view
              className="motion-press flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 px-2.5 active:bg-overlay-ink-10"
              bindtap={onVersionClick}
              accessibility-element
              accessibility-traits="button"
              accessibility-label={version}
            >
              <text className="text-label-sm text-text-primary">{version}</text>
              {versionParts}
              <Icon name="CaretDown" size={12} color="text-secondary" />
            </view>
          ) : (
            <view className="flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 px-2.5">
              <text className="text-label-sm text-text-primary">{version}</text>
              {versionParts}
            </view>
          )
        ) : null}
        <view className="min-w-0 flex-1" />
        {onBotClick ? (
          <view
            className="motion-press flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 pl-1.5 pr-2.5 active:bg-overlay-ink-10"
            bindtap={onBotClick}
            accessibility-element
            accessibility-traits="button"
            accessibility-label={bot.name}
          >
            <view className="flex size-[18px] flex-row items-center justify-center rounded-[5px] bg-interactive-primary">
              <text className="text-label-sm text-text-inverse">{bot.initial}</text>
            </view>
            <text className="text-label-sm text-text-primary">{bot.name}</text>
            <Icon name="CaretDown" size={12} color="text-secondary" />
          </view>
        ) : (
          <view className="flex h-[30px] shrink-0 flex-row items-center gap-1.5 rounded-full bg-overlay-ink-6 pl-1.5 pr-2.5">
            <view className="flex size-[18px] flex-row items-center justify-center rounded-[5px] bg-interactive-primary">
              <text className="text-label-sm text-text-inverse">{bot.initial}</text>
            </view>
            <text className="text-label-sm text-text-primary">{bot.name}</text>
          </view>
        )}
      </view>
      <Divider />
      <view className="flex flex-col gap-1 px-5 pb-3.5 pt-3">
        <view className="flex flex-row items-center gap-2 pb-2">
          <PanelPillTabs
            aria-label="Instructions view"
            value={tab}
            onValueChange={setTab}
            items={[
              { value: "instructions", label: "Instructions" },
              { value: "example", label: "Example" },
            ]}
          />
          <view className="min-w-0 flex-1" />
          {tokenCount === undefined ? null : (
            <text className="text-caption text-text-secondary">{`${tokenCount} tokens`}</text>
          )}
        </view>
        <view
          key={tab}
          className="motion-rise flex flex-col gap-1 rounded-lg"
          focusable
          bindfocus={() => setFocused(true)}
          bindblur={() => setFocused(false)}
        >
          {tab === "example" && example !== undefined ? (
            <view>
              {typeof example === "string" || typeof example === "number" ? (
                <text className="text-body-sm text-text-primary">{example}</text>
              ) : (
                example
              )}
            </view>
          ) : (
            instructions.map((line, index) => (
              <view
                key={line.map((part) => (typeof part === "string" ? part : part.variable)).join("|")}
                className="flex flex-row flex-wrap items-center gap-1"
              >
                {line.map((part) =>
                  typeof part === "string" ? (
                    <text
                      key={part}
                      className={cn("text-body-sm text-text-primary", /^[,.;:!?%)\]]/.test(part) && "-ml-1")}
                    >
                      {part}
                    </text>
                  ) : (
                    <VariableChip key={part.variable} tone={part.tone}>
                      {part.variable}
                    </VariableChip>
                  ),
                )}
                {index === instructions.length - 1 && focused ? (
                  <view
                    className="h-4 w-px bg-text-primary"
                    style={{
                      animationName: "caret-blink",
                      animationDuration: "1s",
                      animationTimingFunction: "step-end",
                      animationIterationCount: "infinite",
                    }}
                  />
                ) : null}
              </view>
            ))
          )}
        </view>
        <view className="flex flex-row items-center gap-1.5 pt-2">
          <text className="text-caption text-text-secondary">Type</text>
          <view className="rounded-md bg-overlay-ink-6 px-1.5 py-px">
            <text className="text-caption text-text-secondary">{"{{"}</text>
          </view>
          <text className="text-caption text-text-secondary">to add a variable</text>
        </view>
      </view>
      {variables || scenarios ? (
        <>
          <Divider />
          <view className="flex flex-col gap-2.5 px-5 pb-3.5 pt-3">
            {variables ? (
              <view className="flex flex-row flex-wrap gap-2">
                {variables.map((variable) => (
                  <view key={variable.name} className="flex min-w-0 flex-[1_1_140px] flex-col gap-1.5">
                    <view className="flex flex-row items-center gap-1.5">
                      <view className={cn("size-1.5 rounded-full", variableDotClass[variable.tone ?? "sky"])} />
                      <text className="text-caption text-text-secondary">{variable.name}</text>
                    </view>
                    <view className="flex h-10 min-w-0 flex-row items-center rounded-md bg-overlay-ink-5 px-3">
                      <text className="truncate text-body-sm text-text-primary">{variable.value}</text>
                    </view>
                  </view>
                ))}
              </view>
            ) : null}
            <view className="flex flex-row flex-wrap items-center gap-2">
              {scenarios ? (
                <PanelPillTabs
                  aria-label="Scenario"
                  value={scenario}
                  onValueChange={setScenario}
                  items={scenarios.map((name) => ({ value: name, label: name }))}
                />
              ) : null}
              <view className="min-w-0 flex-1" />
              <view
                className="motion-press flex h-[30px] shrink-0 flex-row items-center justify-center gap-1.5 rounded-full bg-interactive-primary pl-3.5 pr-3 active:bg-interactive-primary-hover"
                bindtap={() => {
                  setRunCount((count) => count + 1);
                  onRun?.(scenario);
                }}
                accessibility-element
                accessibility-traits="button"
                accessibility-label="Run"
              >
                <Icon name="Play" size={14} color="text-inverse" />
                <text className="text-label-sm text-text-inverse">Run</text>
                {keyboardHints ? <Kbd keys="Mod+Enter" className="bg-bg-surface-6" /> : null}
              </view>
            </view>
          </view>
        </>
      ) : null}
      {output === undefined ? null : (
        <view
          key={runCount}
          className="motion-rise bg-overlay-ink-3 px-5 pb-4 pt-3.5"
          accessibility-role-description="status"
        >
          {typeof output === "string" || typeof output === "number" ? (
            <text className="text-body-sm text-text-secondary">{output}</text>
          ) : (
            output
          )}
        </view>
      )}
    </view>
  );
}
