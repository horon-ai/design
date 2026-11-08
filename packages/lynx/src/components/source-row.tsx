import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { useMediaQuery } from "../hooks/use-media-query";

/**
 * Overall state of an indexed source: `ready` when every stage finished, `indexing` while the
 * pipeline runs, and `failed` when a stage broke and Retry is offered.
 */
export type SourceStatus = "ready" | "indexing" | "failed";

/** Props of {@link SourceRow}: the source's identity, its pipeline state and the Retry action. */
export type SourceRowProps = {
  /** Drives the default stage states, the detail color and which trailing control appears. */
  status: SourceStatus;
  /** 16px source icon on the 32px tile. */
  icon: ReactNode;
  /** Source name, one truncated line at `label-md`. */
  name: ReactNode;
  /** Pages and chunks, progress, or the error. */
  detail: ReactNode;
  /** 0-100 while indexing. @default 0 */
  progress?: number;
  /** Called by the Retry button, which only appears when `status` is `failed`. */
  onRetry?: () => void;
  /** `card` is a standalone subtle row; `list` is transparent with a 1px divider, for stacking inside a list. @default "card" */
  variant?: "card" | "list";
  /** Pipeline stage states; defaults to Parse, Chunk, Embed, Index derived from `status`. @default `defaultStages[status]`: `ready` is all `done`, `indexing` is `done, done, active, todo`, `failed` is `done, done, failed, todo` */
  stages?: SourceStages;
  /** Extra classes on the row, which owns the radius, border or divider. */
  className?: string;
};

/**
 * One stage of the parse → chunk → embed → index pipeline: `done` is a 35% ink bar, `active`
 * shows the live progress fill, `todo` is 8% ink and `failed` takes the red accent.
 */
export type SourceStage = "done" | "active" | "todo" | "failed";

/** The four pipeline stages in display order: parse, chunk, embed, index. */
export type SourceStages = [SourceStage, SourceStage, SourceStage, SourceStage];
const stageNames = ["parse", "chunk", "embed", "index"] as const;

const defaultStages: Record<SourceStatus, SourceStages> = {
  ready: ["done", "done", "done", "done"],
  indexing: ["done", "done", "active", "todo"],
  failed: ["done", "done", "failed", "todo"],
};

const stageFill = { done: "bg-overlay-ink-35", todo: "bg-overlay-ink-8", failed: "bg-accent-red-500-90" } as const;

/**
 * React's bar is 24px wide and 44px from `sm` up; Lynx has no width breakpoints in CSS, so the same
 * two stops come from {@link useMediaQuery} and the class list of the bar.
 */
const stageBar = (state: keyof typeof stageFill, wide: boolean) =>
  cn("h-[3px] overflow-hidden rounded-full", wide ? "w-11" : "w-6", stageFill[state]);

/** Whether a value can be dropped into a `<text>` as its child. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The tile is 32px and React sized its glyph through `[&>svg]:size-4`; `<Icon>` takes the px number. */
const TILE_ICON_SIZE = 16;

/**
 * Figma `Source row` (Knowledge base): a flat row with a four-stage pipeline (parse, chunk, embed, index).
 *
 * The four stage bars (24px, 44px from 640px up) show the pipeline; the `active` bar fills to
 * `progress`. The trailing slot is state-specific: a check when ready, a live percentage while
 * indexing, and a Retry button when failed, where the detail line turns danger red with a warning icon.
 *
 * Lynx has no `::after` and no `:last-child`, so the `list` variant paints its divider as a real
 * view pinned to the row's bottom edge; stack such rows and the last one simply ends with its own
 * hairline unless the caller passes `variant="card"` for it.
 *
 * @example
 * ```tsx
 * import { Icon, SourceRow } from "@horon-ai/lynx";
 *
 * function IndexingSource() {
 *   return (
 *     <SourceRow
 *       status="indexing"
 *       icon={<Icon name="FilePdf" />}
 *       name="Q4 launch brief.pdf"
 *       detail="42 pages · embedding"
 *       progress={68}
 *     />
 *   );
 * }
 * ```
 */
export function SourceRow({
  status,
  icon,
  name,
  detail,
  progress = 0,
  onRetry,
  variant = "card",
  stages = defaultStages[status],
  className,
}: SourceRowProps) {
  const wide = useMediaQuery("(min-width: 640px)");

  return (
    <view
      className={cn(
        "flex flex-row flex-wrap items-center gap-x-3 gap-y-2 px-2 py-3",
        variant === "list" ? "relative" : "rounded-[14px] border border-border-default bg-bg-surface px-3",
        className,
      )}
    >
      {variant === "list" ? (
        <view className="absolute inset-x-2 bottom-0 h-px bg-overlay-ink-8" accessibility-element={false} />
      ) : null}
      <view className="flex size-8 shrink-0 flex-row items-center justify-center rounded-[10px] bg-overlay-ink-5">
        {isValidElement<IconProps>(icon) && icon.type === Icon
          ? cloneElement(icon, { size: TILE_ICON_SIZE, color: "text-primary" })
          : icon}
      </view>
      <view className="flex min-w-0 grow flex-col gap-0.5">
        {isPlainText(name) ? <text className="truncate text-label-md text-text-primary">{name}</text> : name}
        <view className="flex flex-row items-center gap-1">
          {status === "failed" ? <Icon name="WarningCircle" size={12} color="text-danger" /> : null}
          {isPlainText(detail) ? (
            <text
              className={cn("truncate text-caption", status === "failed" ? "text-text-danger" : "text-text-secondary")}
            >
              {detail}
            </text>
          ) : (
            detail
          )}
        </view>
      </view>
      <view className="flex shrink-0 flex-row items-center gap-1" accessibility-element={false}>
        {stages.map((state, index) => {
          const stageName = stageNames[index];
          return state === "active" ? (
            <view key={stageName} className={stageBar("todo", wide)}>
              <view
                className="h-full rounded-full bg-status-live"
                style={{
                  width: `${progress}%`,
                  transitionProperty: "width",
                  transitionDuration: "400ms",
                  transitionTimingFunction: "var(--ease-out-quint)",
                }}
              />
            </view>
          ) : (
            <view key={stageName} className={stageBar(state, wide)} />
          );
        })}
      </view>
      <view className="flex h-[30px] w-[72px] shrink-0 flex-row items-center justify-end">
        {status === "ready" ? (
          <view accessibility-element accessibility-label="Ready">
            <Icon name="Check" size={16} color="text-secondary" />
          </view>
        ) : null}
        {status === "indexing" ? (
          <text className="w-9 text-right text-label-md text-text-secondary">
            <text
              key={progress}
              style={{
                animationName: "fade-in",
                animationDuration: "160ms",
                animationTimingFunction: "var(--ease-out-quint)",
                animationFillMode: "both",
              }}
            >
              {`${progress}%`}
            </text>
          </text>
        ) : null}
        {status === "failed" ? (
          <view
            className="motion-press flex h-[30px] flex-row items-center rounded-full bg-overlay-ink-6 px-3"
            bindtap={onRetry}
            accessibility-element
            accessibility-traits="button"
          >
            <text className="text-label-sm text-text-primary">Retry</text>
          </view>
        ) : null}
      </view>
    </view>
  );
}
