import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stack } from "@horon/app";
import { Toast, ToastProvider, useToast } from "@horon/app/components/Toast";

const meta = {
  title: "App/Toast",
  component: Toast,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Stack gap={3} align="center">
      <Toast title="Saved" description="Your changes have been saved." />
      <Toast variant="success" title="Deployed" description="The build is live." />
      <Toast variant="warning" title="Quota almost full" description="You have used 90% of your storage." />
      <Toast variant="destructive" title="Upload failed" description="Check your connection and try again." />
    </Stack>
  ),
};

function DismissDemo() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Toast
      title="Dismiss me"
      description="This toast can be dismissed manually or after 5 seconds."
      onDismiss={() => setVisible(false)}
      duration={5000}
    />
  ) : (
    <Button onPress={() => setVisible(true)}>Show toast again</Button>
  );
}

export const Dismissible: Story = {
  render: () => <DismissDemo />,
};

function ProviderDemo() {
  const { toast } = useToast();
  return (
    <Stack gap={2} align="center">
      <Button onPress={() => toast({ title: "Saved", description: "Auto-dismisses in 4s." })}>Show toast</Button>
      <Button
        variant="destructive"
        onPress={() =>
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong.",
          })
        }
      >
        Show error
      </Button>
    </Stack>
  );
}

export const Provider: Story = {
  render: () => (
    <div style={{ position: "relative", minHeight: 320 }}>
      <ToastProvider>
        <ProviderDemo />
      </ToastProvider>
    </div>
  ),
};
