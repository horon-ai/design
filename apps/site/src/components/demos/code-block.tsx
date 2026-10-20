import { CodeBlock, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader } from "@horon/web";

const snippet = `import { Button } from "@horon/web";

export function Save() {
  return <Button size="sm">저장</Button>;
}`;

export default function CodeBlockDemo() {
  return (
    <>
      <CodeBlock className="w-[28rem] max-w-full">
        <CodeBlockHeader>
          <span className="font-mono">save.tsx</span>
          <CodeBlockCopyButton />
        </CodeBlockHeader>
        <CodeBlockContent>{snippet}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock className="w-[28rem] max-w-full">
        <CodeBlockHeader>
          <span className="font-mono">terminal</span>
          <CodeBlockCopyButton value="bun add @horon/web" />
        </CodeBlockHeader>
        <CodeBlockContent>bun add @horon/web</CodeBlockContent>
      </CodeBlock>
    </>
  );
}
