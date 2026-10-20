import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
} from "@horon-ai/react/components/message-scroller";
import { Message, MessageContent, MessageHeader } from "@horon-ai/react/components/message";
import { Bubble, BubbleContent } from "@horon-ai/react/components/bubble";

const meta = {
  title: "Web/MessageScroller",
  component: MessageScroller,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MessageScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

const thread = [
  { from: "Horon Assistant", align: "start" as const, body: "Where should the palette live?" },
  { from: "민열", align: "end" as const, body: "In @horon-ai/tokens, as the single source." },
  { from: "Horon Assistant", align: "start" as const, body: "Done. theme.css is regenerated." },
  { from: "민열", align: "end" as const, body: "Great. Now port the components." },
  { from: "Horon Assistant", align: "start" as const, body: "Starting with the chat surfaces." },
  { from: "민열", align: "end" as const, body: "Keep floating chrome on glass." },
  { from: "Horon Assistant", align: "start" as const, body: "Understood — glass for chrome only." },
  { from: "민열", align: "end" as const, body: "Show me a scroller when ready." },
];

export const Playground: Story = {
  render: () => (
    <MessageScroller className="h-96 w-80 rounded-md border border-border">
      <MessageScrollerViewport className="p-4">
        <MessageScrollerContent>
          {thread.map((entry) => (
            <MessageScrollerItem key={`${entry.from}: ${entry.body}`}>
              <Message align={entry.align}>
                <MessageContent>
                  <MessageHeader>{entry.from}</MessageHeader>
                  <Bubble align={entry.align} variant={entry.align === "end" ? "default" : "muted"}>
                    <BubbleContent>{entry.body}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  ),
};
