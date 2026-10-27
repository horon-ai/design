import { CodeKey, CodePanel } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function CodePanelDemo() {
  return (
    <Backdrop>
      <CodePanel className="w-full max-w-126.5">
        {"---\n"}
        <CodeKey>name:</CodeKey> weekly-investor-update{"\n"}
        <CodeKey>description:</CodeKey> Draft the Friday investor email{"\n"}
        {"---\n\n"}
        {"1. Pull MRR, burn and runway from Stripe.\n"}
        {"2. Summarize shipped work from Linear.\n"}
        {"3. Keep it under 200 words, plain tone."}
      </CodePanel>
    </Backdrop>
  );
}
