import { AgentPanel, ComposerChip, TaskComposer } from "@horon-ai/react";
import { Folder } from "@phosphor-icons/react";

/* The FilterBar draws its selected pill from a measured rect, which only exists after mount; the same pill
   is drawn here with the library's own classes so the static thumbnail shows the selected filter. */
function FilterPills() {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]">
      <span className="flex h-7.5 items-center gap-1.5 rounded-full bg-overlay-ink-10 px-4 text-label-md text-text-primary">
        All <span className="text-caption text-text-secondary">2</span>
      </span>
      <span className="flex h-7.5 items-center gap-1.5 rounded-full px-4 text-label-md text-text-secondary">
        Running <span className="text-caption text-text-secondary">1</span>
      </span>
      <span className="flex h-7.5 items-center rounded-full px-4 text-label-md text-text-secondary">Done</span>
    </div>
  );
}

export default function AgentPanelThumbnail() {
  return (
    <AgentPanel className="w-84" filter={<FilterPills />}>
      <TaskComposer
        pickers={
          <>
            <ComposerChip leading="C">Chief of staff</ComposerChip>
            <ComposerChip leading={<Folder aria-hidden />}>Horon HQ</ComposerChip>
          </>
        }
      />
    </AgentPanel>
  );
}
