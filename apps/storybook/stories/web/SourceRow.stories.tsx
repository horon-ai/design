import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceRow } from "@horon-ai/react";
import { EnvelopeSimple, FileText, Globe } from "@phosphor-icons/react";

const meta = {
  title: "Web/SourceRow",
  component: SourceRow,
  args: {
    status: "ready",
    icon: <FileText />,
    name: "Refund and cancellation policy.pdf",
    detail: "12 pages · 45 chunks · Uploaded Oct 14",
  },
} satisfies Meta<typeof SourceRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: (args) => (
    <div className="flex w-190 flex-col gap-2">
      <SourceRow {...args} />
      <SourceRow
        status="failed"
        icon={<EnvelopeSimple />}
        name="Investor threads"
        detail="Embedding timed out after 41 of 68 chunks"
        onRetry={() => undefined}
      />
      <SourceRow
        status="indexing"
        icon={<Globe />}
        name="help.horon.ai"
        detail="Embedding · 140 of 296 chunks"
        progress={62}
      />
    </div>
  ),
};
