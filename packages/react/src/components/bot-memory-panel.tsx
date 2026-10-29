import { BookmarkSimple, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { PanelPillTabs } from "./bot-instructions-panel";
import { Switch } from "./switch";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export type BotMemorySetting = {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
};

export type BotMemoryItem = {
  id: string;
  text: string;
  /** Where the memory came from, for example `From a chat · Oct 8`. */
  source: string;
  /** Group label; the filter tabs are built from these in order of appearance. */
  group: string;
  /** Highlights a memory that was just added. */
  fresh?: boolean;
};

export type BotMemoryToast = { title: string; message?: string };

export type BotMemoryPanelProps = WithClass<Omit<ComponentProps<"section">, "title">> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Fill of the memory meter, 0 to 100. */
  usage: number;
  settings?: BotMemorySetting[];
  memories: BotMemoryItem[];
  /** The "Memory updated" pill; it enters with a pop and leaves through its close button. */
  toast?: BotMemoryToast;
  onToastDismiss?: () => void;
  onAdd?: () => void;
  onSettingChange?: (id: string, checked: boolean) => void;
};

function Divider({ inset }: { inset?: boolean }) {
  return (
    <div className={cn("flex self-stretch", inset && "px-4.5")}>
      <div role="separator" className="h-px flex-1 bg-overlay-ink-8" />
    </div>
  );
}

/**
 * Bot memory panel (Paper `ZO2-1` / `HPY-0`): a 24px-radius surface with a memory meter, two switch rows,
 * a filter pill track, a transient "Memory updated" pill and the grouped memories.
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
  className,
  ...props
}: BotMemoryPanelProps) {
  const [filter, setFilter] = useState("all");
  const [leaving, setLeaving] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const groups = [...new Set(memories.map((memory) => memory.group))];
  const visible = filter === "all" ? groups : groups.filter((group) => group === filter);
  const percent = Math.min(100, Math.max(0, usage));
  let rowIndex = 0;

  return (
    <section
      className={cn(
        "flex w-full max-w-140 flex-col overflow-clip rounded-[24px] border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-2.5 px-4.5 pt-4 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="text-label-lg text-text-primary">{title}</h3>
          {subtitle ? <p className="text-caption text-text-secondary">{subtitle}</p> : null}
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
              className="h-full rounded-full bg-interactive-primary transition-[width] duration-400 ease-out-quint"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </header>
      {settings?.map((setting, index) => (
        <div key={setting.id} className="flex flex-col">
          {index > 0 ? <Divider inset /> : null}
          <div className="flex items-center gap-3 px-4.5 py-2.5">
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
      <div className="flex items-center gap-2 pt-3 pr-3.5 pb-1.5 pl-3.5">
        <PanelPillTabs
          aria-label="Memory filter"
          value={filter}
          onValueChange={setFilter}
          items={[{ value: "all", label: "All" }, ...groups.map((group) => ({ value: group, label: group }))]}
        />
        <span className="min-w-0 flex-1" />
        <button
          type="button"
          aria-label="Search memories"
          className="flex size-7.5 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary hover:bg-overlay-ink-8 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          <MagnifyingGlass aria-hidden className="size-4" />
        </button>
      </div>
      {toast && !dismissed ? (
        <div className="px-3.5 py-1.5">
          <div
            role="status"
            onAnimationEnd={() => {
              if (leaving) {
                setDismissed(true);
                onToastDismiss?.();
              }
            }}
            className={cn(
              "inline-flex h-8 max-w-full items-center gap-2 rounded-full bg-accent-sky-500-16 pr-3 pl-2.5",
              leaving ? "animate-pop-out" : "animate-pop-in",
            )}
          >
            <BookmarkSimple aria-hidden className="size-3.5 shrink-0 text-text-primary" />
            <span className="shrink-0 text-label-sm text-text-primary">{toast.title}</span>
            {toast.message ? (
              <span className="min-w-0 truncate text-caption text-text-secondary">{toast.message}</span>
            ) : null}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setLeaving(true)}
              className="flex size-3 shrink-0 cursor-pointer items-center justify-center text-text-secondary motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
            >
              <X aria-hidden className="size-3" />
            </button>
          </div>
        </div>
      ) : null}
      <div key={filter} className="flex flex-col">
        {visible.map((group) => {
          const items = memories.filter((memory) => memory.group === group);
          return (
            <div key={group} className="flex flex-col">
              <div className="flex items-center gap-1.5 px-4.5 pt-3 pb-1">
                <span className="text-label-sm text-text-secondary">{group}</span>
                <span className="text-caption text-text-secondary">{items.length}</span>
              </div>
              {items.map((memory) => (
                <div
                  key={memory.id}
                  className={cn(
                    "flex motion-rise flex-col gap-0.5 px-4.5 py-2 motion-colors",
                    memory.fresh && "bg-accent-sky-500-10",
                  )}
                  style={{ animationDelay: `${rowIndex++ * 30}ms` }}
                >
                  <span className="text-body-sm text-text-primary">{memory.text}</span>
                  <span className="text-caption text-text-secondary">{memory.source}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex cursor-pointer items-center gap-2 px-4.5 pt-3 pb-4 text-label-md text-text-secondary motion-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand"
      >
        <Plus aria-hidden className="size-3.5" />
        Add memory
      </button>
    </section>
  );
}
