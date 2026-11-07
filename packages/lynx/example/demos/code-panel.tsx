import { CodeKey, CodePanel } from "../../src/components/code-panel";
import { Backdrop } from "./backdrop";

/** The frontmatter example from the site, with the plain text also handed to the copy action. */
const CODE = `---
name: weekly-investor-update
description: Draft the Friday investor email
---

1. Pull MRR, burn and runway from Stripe.
2. Summarize shipped work from Linear.
3. Keep it under 200 words, plain tone.`;

export default function CodePanelDemo() {
  return (
    <Backdrop>
      <CodePanel className="w-full max-w-[506px]" copyText={CODE}>
        {"---\n"}
        <CodeKey>name:</CodeKey>
        {" weekly-investor-update\n"}
        <CodeKey>description:</CodeKey>
        {" Draft the Friday investor email\n"}
        {"---\n\n"}
        {"1. Pull MRR, burn and runway from Stripe.\n"}
        {"2. Summarize shipped work from Linear.\n"}
        {"3. Keep it under 200 words, plain tone."}
      </CodePanel>
    </Backdrop>
  );
}
