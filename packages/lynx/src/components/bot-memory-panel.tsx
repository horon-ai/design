import { useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
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
  /** Row title, also used as the switch's accessible name. */
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
export type BotMemoryPanelProps = WithClass<{
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
}> & {
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
function Divider({
  /** Indents the rule by 20px to match the surrounding rows. */
  inset,
}: {
  inset?: boolean;
}) {
  return (
    <view className={cn("flex self-stretch", inset && "px-5")}>
      <view className="h-px flex-1 bg-overlay-ink-8" accessibility-role-description="separator" />
    </view>
  );
}

/** The spring the pill's pop and the fill's travel run, written out for an inline style. */
const EASE_EMPHASIZED = "cubic-bezier(0.2, 0, 0, 1)";

/**
 * Bot memory panel (Paper `ZO2-1` / `HPY-0`): a 24px-radius surface with a memory meter, two switch rows,
 * a filter pill track, a transient "Memory updated" pill and the grouped memories.
 *
 * The meter clamps `usage` to 0–100 and announces it as a progress bar. The filter tabs are built from the
 * memories' `group` values plus an "All" tab and are component state; each row rises in with a 30ms
 * stagger. The toast pill shows while a `toast` is passed, plays its exit animation when its close button
 * is pressed, re-enters with a pop for a new toast object, and calls `onToastDismiss` when the exit
 * animation ends — the animation end arrives on `bindanimationend`, which is Lynx's counterpart of
 * react's `onAnimationEnd`.
 *
 * @example
 * ```tsx
 * import { BotMemoryPanel } from "@horon-ai/lynx";
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
  id,
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
    <view
      className={cn(
        "flex w-full max-w-[560px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...(id === undefined ? {} : { id })}
    >
      <view className="flex flex-row flex-wrap items-center gap-x-2.5 gap-y-2 px-5 pt-4 pb-3.5">
        <view className="flex min-w-0 flex-1 flex-col gap-0.5">
          {typeof title === "string" || typeof title === "number" ? (
            <text className="truncate text-label-lg text-text-primary">{title}</text>
          ) : (
            title
          )}
          {subtitle ? (
            typeof subtitle === "string" || typeof subtitle === "number" ? (
              <text className="truncate text-caption text-text-secondary">{subtitle}</text>
            ) : (
              subtitle
            )
          ) : null}
        </view>
        <view className="flex flex-col items-end gap-1">
          <text className="text-caption text-text-secondary">{`${percent}% full`}</text>
          <view
            className="h-[5px] w-20 shrink-0 overflow-hidden rounded-full bg-overlay-ink-8"
            accessibility-element
            accessibility-role-description="progressbar"
            accessibility-label="Memory used"
            accessibility-value={`${percent}%`}
          >
            <view
              className="h-full rounded-full bg-interactive-primary"
              style={{
                width: `${percent}%`,
                transitionProperty: "width",
                transitionDuration: "280ms",
                transitionTimingFunction: EASE_EMPHASIZED,
              }}
            />
          </view>
        </view>
      </view>
      {settings?.map((setting, index) => (
        <view key={setting.id} className="flex flex-col">
          {index > 0 ? <Divider inset /> : null}
          <view className="flex flex-row items-center gap-3 px-5 py-2.5">
            <view className="flex min-w-0 flex-1 flex-col gap-0.5">
              <text className="text-label-md text-text-primary">{setting.label}</text>
              {setting.description ? (
                <text className="text-caption text-text-secondary">{setting.description}</text>
              ) : null}
            </view>
            <Switch
              size="compact"
              aria-label={setting.label}
              defaultChecked={setting.defaultChecked}
              onCheckedChange={(checked) => onSettingChange?.(setting.id, checked)}
            />
          </view>
        </view>
      ))}
      <Divider />
      <view className="flex flex-row items-center gap-2 px-5 pt-3 pb-1.5">
        <PanelPillTabs
          aria-label="Memory filter"
          value={filter}
          onValueChange={setFilter}
          items={[{ value: "all", label: "All" }, ...groups.map((group) => ({ value: group, label: group }))]}
        />
        <view className="min-w-0 flex-1" />
        {onSearch ? (
          <view
            className="flex size-[30px] shrink-0 flex-row items-center justify-center rounded-full bg-overlay-ink-6 motion-press active:bg-overlay-ink-10"
            bindtap={onSearch}
            accessibility-element
            accessibility-traits="button"
            accessibility-label="Search memories"
          >
            <Icon name="MagnifyingGlass" size={16} color="text-secondary" />
          </view>
        ) : (
          <view
            className="flex size-[30px] shrink-0 flex-row items-center justify-center rounded-full bg-overlay-ink-6"
            accessibility-elements-hidden
          >
            <Icon name="MagnifyingGlass" size={16} color="text-secondary" />
          </view>
        )}
      </view>
      {toast && !dismissed ? (
        <view className="px-5 py-1.5">
          <view
            className="flex h-8 max-w-full min-w-0 flex-row items-center gap-2 self-start rounded-full bg-accent-sky-500-16 pr-3 pl-2.5"
            style={{
              animationName: leaving ? "pop-out" : "pop-in",
              animationDuration: leaving ? "130ms" : "220ms",
              animationTimingFunction: leaving ? "ease-in" : EASE_EMPHASIZED,
              animationFillMode: "both",
            }}
            bindanimationend={() => {
              if (leaving && toast) {
                setDismissedFor(toast);
                onToastDismiss?.();
              }
            }}
            accessibility-element
            accessibility-role-description="status"
          >
            <Icon name="BookmarkSimple" size={14} color="text-primary" />
            <text className="min-w-0 truncate text-label-sm text-text-primary">{toast.title}</text>
            {toast.message ? (
              <text className="min-w-0 truncate text-caption text-text-secondary">{toast.message}</text>
            ) : null}
            <view
              className="flex size-3 shrink-0 flex-row items-center justify-center motion-colors active:text-text-primary"
              bindtap={() => setLeavingFor(toast)}
              accessibility-element
              accessibility-traits="button"
              accessibility-label="Dismiss"
            >
              <Icon name="X" size={12} color="text-secondary" />
            </view>
          </view>
        </view>
      ) : null}
      <view key={filter} className="flex flex-col">
        {visible.map((group) => {
          const items = memories.filter((memory) => memory.group === group);
          return (
            <view key={group} className="flex flex-col">
              <view className="flex flex-row items-center gap-1.5 px-5 pt-3 pb-1">
                <text className="text-label-sm text-text-secondary">{group}</text>
                <text className="text-caption text-text-secondary">{`${items.length}`}</text>
              </view>
              {items.map((memory) => (
                <view
                  key={memory.id}
                  className={cn(
                    "flex motion-rise flex-col gap-0.5 px-5 py-2 motion-colors",
                    memory.fresh && "bg-accent-sky-500-10",
                  )}
                  style={{ animationDelay: `${rowIndex++ * 30}ms` }}
                >
                  <text className="text-body-sm break-all text-text-primary">{memory.text}</text>
                  <text className="text-caption break-all text-text-secondary">{memory.source}</text>
                </view>
              ))}
            </view>
          );
        })}
      </view>
      <view
        className="flex flex-row items-center gap-2 px-5 pt-3 pb-4 motion-colors active:text-text-primary"
        bindtap={onAdd}
        accessibility-element
        accessibility-traits="button"
      >
        <Icon name="Plus" size={14} color="text-secondary" />
        <text className="text-label-md text-text-secondary">Add memory</text>
      </view>
    </view>
  );
}
