import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@horon/web/components/resizable";

const meta = {
  title: "Web/Resizable",
  component: ResizablePanelGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const folders = ["Inbox", "Drafts", "Sent", "Archive"];

export const Playground: Story = {
  render: () => (
    <div className="h-64 w-[36rem] overflow-hidden rounded-md border border-border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="30%" minSize="18%">
          <div className="flex h-full flex-col gap-1 p-4">
            <span className="mb-1 text-sm font-semibold text-foreground">Folders</span>
            {folders.map((folder) => (
              <span key={folder} className="text-[13px] text-muted-foreground">
                {folder}
              </span>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="70%">
          <div className="flex h-full flex-col gap-2 p-4">
            <span className="text-sm font-semibold text-foreground">Selected message</span>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Drag the handle between the two panels to change how much space each one takes. The split keeps both sides
              usable.
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-72 w-[28rem] overflow-hidden rounded-md border border-border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="60%" minSize="25%">
          <div className="flex h-full items-center justify-center p-4 text-[13px] text-muted-foreground">Preview</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="40%">
          <div className="flex h-full items-center justify-center p-4 text-[13px] text-muted-foreground">Details</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
