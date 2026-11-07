import { HoronGlyph, ListDetailMeta } from "@horon-ai/react";

/**
 * The shipped ListDetail holds a fixed 250px list beside the detail pane, which leaves the
 * detail pane nothing at the 400px thumbnail canvas, so the list column here is a static
 * facsimile of the same shell (inset column with a 10px-radius selected row, mono titles,
 * hairline divider) and the detail pane uses the real `ListDetailMeta`.
 */
export default function ListDetailThumbnail() {
  return (
    <div className="flex w-[340px] overflow-clip rounded-2xl border border-border-default bg-bg-surface">
      <div className="flex w-[122px] shrink-0 flex-col gap-1 border-r border-border-default bg-bg-inset p-2">
        <span className="px-2 pt-1 pb-1.5 text-label-sm font-semibold tracking-[0.04em] text-text-secondary">
          ACTIVE
        </span>
        <div className="flex flex-col gap-0.5 rounded-[10px] bg-overlay-ink-6 px-2 py-1.5">
          <span className="truncate font-mono text-label-sm text-text-primary">weekly</span>
          <span className="truncate text-caption text-text-secondary">Every Friday</span>
        </div>
        <div className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="truncate font-mono text-label-sm text-text-primary">triage</span>
          <span className="truncate text-caption text-text-secondary">On new issue</span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
            <HoronGlyph name="sparkles" size={16} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-mono text-label-md font-semibold text-text-primary">Weekly report</span>
            <span className="truncate text-caption text-text-secondary">Scheduled</span>
          </span>
        </div>
        <ListDetailMeta
          className="px-3 py-2"
          items={[
            { id: "trigger", label: "Trigger", value: "Schedule" },
            { id: "last", label: "Last run", value: "Yesterday" },
            { id: "runs", label: "Runs", value: "48" },
            { id: "owner", label: "Owner", value: "You" },
          ]}
        />
      </div>
    </div>
  );
}
