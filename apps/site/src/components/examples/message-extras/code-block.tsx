import { CodeBlock } from "@horon-ai/react";

const bash = "horon routine run weekly-report \\\n  --to alpoxdev@gmail.com \\\n  --channel board";

const tsx = `import { ChatBubble } from "@horon-ai/react";

export function Reply() {
  return <ChatBubble from="bot">Sent.</ChatBubble>;
}`;

export default function MessageExtrasCodeBlock() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-3">
      <CodeBlock language="bash" code={bash} />
      <CodeBlock language="tsx" code={tsx} copyLabel="Copy code" copiedLabel="Copied to clipboard" />
    </div>
  );
}
