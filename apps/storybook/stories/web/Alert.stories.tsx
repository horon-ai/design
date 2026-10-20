import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@horon-ai/react/components/alert";

const meta = {
  title: "Web/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "success", "warning", "info"],
    },
  },
  args: {
    variant: "default",
    children: (
      <>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can add components to your app with the CLI.</AlertDescription>
      </>
    ),
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-3">
      <Alert>
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Neutral message surface.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Your session expired. Sign in again to continue.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>The deployment finished without errors.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>You are nearing your monthly usage limit.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>A new version is available for install.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert className="w-[420px]">
      <Info />
      <AlertTitle>Invite teammates</AlertTitle>
      <AlertDescription>
        <p>Share this workspace with the people you work with.</p>
        <a href="#" className="font-medium text-foreground underline underline-offset-4">
          Copy invite link
        </a>
      </AlertDescription>
    </Alert>
  ),
};
