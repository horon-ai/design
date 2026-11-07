import { CodeKey, CodePanel } from "@horon-ai/react";

export default function CodePanelThumbnail() {
  return (
    <CodePanel className="w-[320px]">
      {"---\n"}
      <CodeKey>name:</CodeKey> weekly-report{"\n"}
      <CodeKey>description:</CodeKey> Friday digest{"\n"}
      {"---\n"}
      {"1. Pull MRR from Stripe.\n"}
      {"2. Keep it under 200 words."}
    </CodePanel>
  );
}
