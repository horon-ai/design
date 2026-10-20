import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@horon-ai/react/components/message";
import { Bubble, BubbleContent } from "@horon-ai/react/components/bubble";
import { Avatar, AvatarFallback } from "@horon-ai/react/components/avatar";

const meta = {
  title: "Web/Message",
  component: Message,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Horon Assistant</MessageHeader>
          <Bubble variant="muted" align="start">
            <BubbleContent>
              I moved the palette into the token package. Want me to update the components next?
            </BubbleContent>
          </Bubble>
          <MessageFooter>2:14 PM</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>MY</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>민열</MessageHeader>
          <Bubble variant="default" align="end">
            <BubbleContent>Yes, and keep the glass rules.</BubbleContent>
          </Bubble>
          <MessageFooter>2:15 PM</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  ),
};

export const WithoutAvatar: Story = {
  render: () => (
    <Message className="w-96">
      <MessageContent>
        <MessageHeader>System</MessageHeader>
        <Bubble variant="outline" align="start">
          <BubbleContent>Token build finished in 1.8s.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  ),
};
