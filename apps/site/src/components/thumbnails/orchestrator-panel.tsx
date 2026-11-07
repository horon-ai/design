import { OrchestratorPanel } from "@horon-ai/react";

export default function OrchestratorPanelThumbnail() {
  return (
    <div className="w-88 [&_h3]:m-0! [&_h3]:text-label-lg!">
      <OrchestratorPanel
        title="Prepare Monday’s investor update"
        parallelOptions={[1, 2, 3, 4]}
        parallelValue={3}
        stopLabel="Stop"
        onStop={() => undefined}
        lead={{
          initial: "C",
          name: "Chief of staff",
          role: "Lead",
          running: true,
          status: "1 working",
          elapsed: "12s",
        }}
        plan={[{ label: "Pull Q3 metrics from Notion", dotClassName: "bg-sky-600", running: true }]}
      />
    </div>
  );
}
