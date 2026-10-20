import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@horon/web/components/empty";
import { Button } from "@horon/web/components/button";
import { InboxIcon, SearchXIcon } from "lucide-react";

const meta = {
  title: "Web/Empty",
  component: Empty,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Empty className="w-96">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>You are all caught up. New messages will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Refresh</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const NoResults: Story = {
  render: () => (
    <Empty className="w-96">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try a different search term or clear the filters.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
