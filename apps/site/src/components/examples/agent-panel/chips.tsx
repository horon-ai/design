import { ComposerChip, TaskComposer } from "@horon-ai/react";
import { Folder } from "@phosphor-icons/react";

export default function AgentPanelChips() {
  return (
    <TaskComposer
      className="w-full max-w-168"
      placeholder="Describe a task for a bot"
      pickers={
        <>
          <ComposerChip leading="C">Chief of staff</ComposerChip>
          <ComposerChip leading={<Folder />} tileClassName="bg-sky-600">
            Horon HQ
          </ComposerChip>
        </>
      }
    />
  );
}
