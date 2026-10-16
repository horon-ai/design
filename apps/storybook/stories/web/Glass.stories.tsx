import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Web/Glass",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative min-h-[420px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #fdf7ea 0%, #ece6d8 28%, #a7abb1 58%, #2b2f36 100%)",
        }}
      />
      <div className="relative flex flex-wrap items-start gap-6 p-10">
        <div className="glass w-72 rounded-xl p-4">
          <p className="text-sm font-semibold">Glass surface</p>
          <p className="mt-1 text-xs">Translucent chrome floating over light and dark content.</p>
        </div>
        <div className="glass-strong w-72 rounded-xl p-4">
          <p className="text-sm font-semibold">Glass strong</p>
          <p className="mt-1 text-xs">The stronger rung of the ladder.</p>
        </div>
      </div>
    </div>
  ),
};
