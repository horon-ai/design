import { CodeKey, CodePanel } from "@horon-ai/react";

export default function CodePanelWidth() {
  return (
    <div className="flex w-full flex-col gap-3">
      <CodePanel className="w-full max-w-100">
        {"tool: linear.create_issue\nbody: [long payload that keeps going past the panel edge]"}
      </CodePanel>
      <CodePanel className="w-full max-w-100">
        {"stage: review\n"}
        <CodeKey>assignee:</CodeKey> chief-of-staff
      </CodePanel>
    </div>
  );
}
