import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
} from "@horon-ai/react/components/code-block";

const meta = {
  title: "Web/CodeBlock",
  component: CodeBlock,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <CodeBlock className="w-96">
      <CodeBlockHeader>
        <span className="font-mono">terminal</span>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockContent>
        {`bun add @horon-ai/react
bun run --filter @horon-ai/react typecheck`}
      </CodeBlockContent>
    </CodeBlock>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <CodeBlock className="w-96">
      <CodeBlockContent>{`const greeting = "hello, horon"
console.log(greeting)`}</CodeBlockContent>
    </CodeBlock>
  ),
};

export const WithCopyValue: Story = {
  render: () => (
    <CodeBlock className="w-96">
      <CodeBlockHeader>
        <span className="font-mono">install.sh</span>
        <CodeBlockCopyButton value="curl -fsSL https://horon.dev/install | sh" />
      </CodeBlockHeader>
      <CodeBlockContent>curl -fsSL https://horon.dev/install | sh</CodeBlockContent>
    </CodeBlock>
  ),
};
