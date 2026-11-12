import { BookmarkSimple, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { PanelPillTabs } from "./bot-instructions-panel";
import { Switch } from "./switch";

type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged onto the root element. */
  className?: string;
};

/** One switch row of {@link BotMemoryPanel}: a label, an optional description and the Switch state. */
export type BotMemorySetting = {
  /** Stable key of the row, passed back to `onSettingChange`. */
  id: string;
  /** Row title, also used as the switch's `aria-label`. */
  label: string;
  /** Optional second line under the label, e.g. what the setting does. */
  description?: string;
  /** Initial switch state; the switch is uncontrolled after mount. */
  defaultChecked?: boolean;
};

/** One remembered item of {@link BotMemoryPanel}, grouped under its `group` heading. */
export type BotMemoryItem = {
  /** Stable key of the memory. */
  id: string;
  /** The remembered text, on the first line of the row. */
  text: string;
  /** Where the memory came from, for example `From a chat · Oct 8`. */
  source: string;
  /** Group label; the filter tabs are built from these in order of appearance. */
  group: string;
  /** Highlights a memory that was just added. */
  fresh?: boolean;
};

/** The transient "Memory updated" pill of {@link BotMemoryPanel}: a title and an optional second line. */
export type BotMemoryToast = {
  /** Bold pill text, e.g. "Memory updated". */
  title: string;
  /** Optional detail shown after the title, e.g. what was saved. */
  message?: string;
};

/** Props of {@link BotMemoryPanel}. */
export type BotMemoryPanelProps = WithClass<Omit<ComponentProps<"section">, "title">> & {
  /**
   * Heading of the panel.
   * @default "Memory"
   */
  title?: ReactNode;
  /** Muted second line under the heading, e.g. how many memories are stored. */
  subtitle?: ReactNode;
  /** Fill of the memory meter, 0 to 100. */
  usage: number;
  /** Switch rows shown under the header, in order. */
  settings?: BotMemorySetting[];
  /** All memories; they are grouped by `group` and filtered by the pill tabs. */
  memories: BotMemoryItem[];
  /** The "Memory updated" pill; it enters with a pop and leaves through its close button. */
  toast?: BotMemoryToast;
  /** Fires once the closing pill has finished its exit animation. */
  onToastDismiss?: () => void;
  /** "Add memory" at the bottom of the panel. */
  onAdd?: () => void;
  /** Fires when a settings switch is flipped, with the setting `id` and the new state. */
  onSettingChange?: (id: string, checked: boolean) => void;
  /** Makes the search button actionable; without it the icon is a plain decoration. */
  onSearch?: () => void;
};

/** Hairline separator between panel rows. */
// prettier-ignore
function Divider({ inset }: {
  /** Indents the rule by 20px to match the surrounding rows. */
  inset?: boolean;
}) {
  return (
    <div className={cn("flex self-stretch", inset && "px-5")}>
      <div role="separator" className="h-px flex-1 bg-overlay-ink-8" />
    </div>
  );
}

/**
 * Bot memory panel (Paper `ZO2-1` / `HPY-0`): a 24px-radius surface with a memory meter, two switch rows,
 * a filter pill track, a transient "Memory updated" pill and the grouped memories.
 *
 * The meter clamps `usage` to 0–100 and exposes it as a `progressbar`. The filter tabs are built from the
 * memories' `group` values plus an "All" tab and are component state; each row rises in with a 30ms
 * stagger. The toast pill shows while a `toast` is passed, plays its exit animation when its close button
 * is pressed, re-enters with a pop for a new toast object, and calls `onToastDismiss` when the exit
 * animation ends.
 *
 * @example
 * ```tsx
 * import { BotMemoryPanel } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <BotMemoryPanel
 *       usage={42}
 *       settings={[{ id: "auto", label: "Memory", description: "Let the assistant remember chats", defaultChecked: true }]}
 *       memories={[{ id: "m1", text: "Prefers Korean replies", source: "From a chat · Oct 8", group: "Preference" }]}
 *       onAdd={() => {}}
 *     />
 *   );
 * }
 * ```
 */
export function BotMemoryPanel({
  title = "Memory",
  subtitle,
  usage,
  settings,
  memories,
  toast,
  onToastDismiss,
  onAdd,
  onSettingChange,
  onSearch,
  className,
  ...props
}: BotMemoryPanelProps) {
  const [filter, setFilter] = useState("all");
  // Both marks are tied to the toast object, so a new toast event revives the pill without an effect.
  const [leavingFor, setLeavingFor] = useState<BotMemoryToast | undefined>();
  const [dismissedFor, setDismissedFor] = useState<BotMemoryToast | undefined>();
  const leaving = toast !== undefined && leavingFor === toast;
  const dismissed = toast !== undefined && dismissedFor === toast;

  const groups = [...new Set(memories.map((memory) => memory.group))];
  const visible = filter === "all" ? groups : groups.filter((group) => group === filter);
  const percent = Math.min(100, Math.max(0, usage));
  let rowIndex = 0;

  return (
    <section
      className={cn(
        "flex w-full max-w-140 min-w-0 flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <header className="flex flex-wrap items-center gap-x-2.5 gap-y-2 px-5 pt-4 pb-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="min-w-0 truncate text-label-lg text-text-primary">{title}</h3>
          {subtitle ? <p className="min-w-0 truncate text-caption text-text-secondary">{subtitle}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-caption text-text-secondary">{percent}% full</span>
          <div
            role="progressbar"
            aria-label="Memory used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-1.25 w-20 shrink-0 overflow-clip rounded-full bg-overlay-ink-8"
          >
            <div
              className="h-full rounded-full bg-interactive-primary transition-[width] duration-280 ease-emphasized"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </header>
      {settings?.map((setting, index) => (
        <div key={setting.id} className="flex flex-col">
          {index > 0 ? <Divider inset /> : null}
          <div className="flex items-center gap-3 px-5 py-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-label-md text-text-primary">{setting.label}</span>
              {setting.description ? (
                <span className="text-caption text-text-secondary">{setting.description}</span>
              ) : null}
            </div>
            <Switch
              size="compact"
              aria-label={setting.label}
              defaultChecked={setting.defaultChecked}
              onCheckedChange={(checked) => onSettingChange?.(setting.id, checked)}
            />
          </div>
        </div>
      ))}
      <Divider />
      <div className="flex items-center gap-2 px-5 pt-3 pb-1.5">
        <PanelPillTabs
          aria-label="Memory filter"
          value={filter}
          onValueChange={setFilter}
          items={[{ value: "all", label: "All" }, ...groups.map((group) => ({ value: group, label: group }))]}
        />
        <span className="min-w-0 flex-1" />
        {onSearch ? (
          <button
            type="button"
            aria-label="Search memories"
            onClick={onSearch}
            className="flex size-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 text-text-secondary hover:bg-overlay-ink-10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
          >
            <MagnifyingGlass aria-hidden className="size-4" />
          </button>
        ) : (
          <span
            aria-hidden
            className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-overlay-ink-6 text-text-secondary"
          >
            <MagnifyingGlass className="size-4" />
          </span>
        )}
      </div>
      <div className="motion-reveal" data-collapsed={!toast || dismissed || undefined}>
        <div className="px-5 py-1.5">
          {toast && !dismissed ? (
            <div
              role="status"
              onAnimationEnd={() => {
                if (leaving && toast) {
                  setDismissedFor(toast);
                  onToastDismiss?.();
                }
              }}
              className={cn(
                "inline-flex h-8 max-w-full min-w-0 items-center gap-2 rounded-full bg-accent-sky-500-16 pr-3 pl-2.5",
                leaving ? "animate-pop-out" : "animate-pop-in",
              )}
            >
              <BookmarkSimple aria-hidden className="size-3.5 shrink-0 text-text-primary" />
              <span className="min-w-0 truncate text-label-sm text-text-primary">{toast.title}</span>
              {toast.message ? (
                <span className="min-w-0 truncate text-caption text-text-secondary">{toast.message}</span>
              ) : null}
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setLeavingFor(toast)}
                className="flex size-3 shrink-0 cursor-pointer items-center justify-center text-text-secondary motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
              >
                <X aria-hidden className="size-3" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div key={filter} className="flex flex-col">
        {visible.map((group) => {
          const items = memories.filter((memory) => memory.group === group);
          return (
            <div key={group} className="flex flex-col">
              <div className="flex items-center gap-1.5 px-5 pt-3 pb-1">
                <span className="text-label-sm text-text-secondary">{group}</span>
                <span className="text-caption text-text-secondary">{items.length}</span>
              </div>
              {items.map((memory) => (
                <div
                  key={memory.id}
                  className={cn(
                    "flex motion-rise flex-col gap-0.5 px-5 py-2 motion-colors",
                    memory.fresh && "bg-accent-sky-500-10",
                  )}
                  style={{ animationDelay: `${rowIndex++ * 30}ms` }}
                >
                  <span className="text-body-sm wrap-break-word text-text-primary">{memory.text}</span>
                  <span className="text-caption wrap-break-word text-text-secondary">{memory.source}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex cursor-pointer items-center gap-2 px-5 pt-3 pb-4 text-label-md text-text-secondary motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
      >
        <Plus aria-hidden className="size-3.5" />
        Add memory
      </button>
    </section>
  );
}
