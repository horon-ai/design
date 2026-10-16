import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheck, CircleDashed, Sparkles, TrendingUp } from "lucide-react";
import { Marker, MarkerContent, MarkerIcon } from "@horon/web/components/marker";

const meta = {
  title: "Web/Marker",
  component: Marker,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "success", "warning", "destructive", "info"],
    },
  },
  args: {
    variant: "default",
    children: (
      <>
        <MarkerIcon>
          <Sparkles />
        </MarkerIcon>
        <MarkerContent>New</MarkerContent>
      </>
    ),
  },
} satisfies Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Marker variant="default">
        <MarkerIcon>
          <Sparkles />
        </MarkerIcon>
        <MarkerContent>New</MarkerContent>
      </Marker>
      <Marker variant="muted">
        <MarkerIcon>
          <CircleDashed />
        </MarkerIcon>
        <MarkerContent>Draft</MarkerContent>
      </Marker>
      <Marker variant="success">
        <MarkerIcon>
          <CircleCheck />
        </MarkerIcon>
        <MarkerContent>Completed</MarkerContent>
      </Marker>
      <Marker variant="info">
        <MarkerIcon>
          <TrendingUp />
        </MarkerIcon>
        <MarkerContent>Trending up</MarkerContent>
      </Marker>
      <Marker variant="warning">
        <MarkerIcon>
          <CircleAlert />
        </MarkerIcon>
        <MarkerContent>Needs review</MarkerContent>
      </Marker>
      <Marker variant="destructive">
        <MarkerIcon>
          <CircleAlert />
        </MarkerIcon>
        <MarkerContent>Failed</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <p className="text-[13px] text-muted-foreground">
      Release 2.4 shipped with a faster editor{" "}
      <Marker variant="success">
        <MarkerIcon>
          <CircleCheck />
        </MarkerIcon>
        <MarkerContent>verified</MarkerContent>
      </Marker>{" "}
      and no breaking changes.
    </p>
  ),
};
