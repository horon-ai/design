import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToolCall } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

const args = { query: "CRM pricing 2026 small sales team", max_results: 5 };
const result = {
  results: [
    { title: "HubSpot pricing", url: "hubspot.com/pricing", price: 20 },
    { title: "Pipedrive plans", url: "pipedrive.com/pricing", price: 14 },
  ],
  took_ms: 1600,
};

const meta = {
  title: "Web/ToolCall",
  component: ToolCall,
  args: {
    status: "done",
    tool: { icon: <MagnifyingGlass />, name: "Web search" },
    summary: "Searched the web for 'CRM pricing 2026'",
    elapsed: "1.6s",
    args,
    result,
    defaultOpen: true,
  },
} satisfies Meta<typeof ToolCall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Done: Story = {};
export const Running: Story = {
  args: { status: "running", summary: "Searching the web for 'CRM pricing 2026'", elapsed: "0.5s", result: undefined },
};
export const Failed: Story = {
  args: {
    status: "failed",
    elapsed: "8.0s",
    error: "Request timed out after 8s – the search provider didn't respond.",
    onRetry: () => undefined,
  },
};
export const Collapsed: Story = { args: { defaultOpen: false } };
