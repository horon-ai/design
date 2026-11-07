import { CodePanel } from "@horon-ai/react";

const settings = `{
  "model": "horon-1",
  "retention_days": 30,
  "notify": { "channel": "email", "digest": "friday" }
}`;

export default function CodePanelJson() {
  return (
    <CodePanel className="w-full max-w-126.5">{settings}</CodePanel>
  );
}
