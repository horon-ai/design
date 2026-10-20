import type { Meta, StoryObj } from "@storybook/react-vite";

import { SonnerToaster, sonnerToast as toast } from "@horon/web/components/sonner";
import { Button } from "@horon/web/components/button";

const meta = {
  title: "Web/Sonner",
  component: SonnerToaster,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SonnerToaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <>
      <SonnerToaster position="bottom-right" />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => toast("Event has been created.")}>Default</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Saved", {
              description: "Your changes are live.",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Something went wrong", {
              description: "The request could not be completed.",
            })
          }
        >
          Error
        </Button>
      </div>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <SonnerToaster position="bottom-right" />
      <Button
        variant="outline"
        onClick={() =>
          toast("Item deleted", {
            description: "The item moved to trash.",
            action: { label: "Undo", onClick: () => undefined },
          })
        }
      >
        Show toast with action
      </Button>
    </>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <>
      <SonnerToaster position="bottom-right" />
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "Report" }), 2000)),
            {
              loading: "Generating report...",
              success: (data) => `${data.name} ready`,
              error: "Could not generate report",
            },
          )
        }
      >
        Show promise toast
      </Button>
    </>
  ),
};
