import type { Meta, StoryObj } from "@storybook/react-vite";
import { colorTokens, space, fontSize, radius } from "@horon-ai/tokens";
import { Stack, Text } from "@horon/app";

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const isColorTokenName = (name: string): name is keyof typeof colorTokens.light => name in colorTokens.light;

const names = Object.keys(colorTokens.light).filter(isColorTokenName);

export const Colors: Story = {
  render: () => (
    <Stack gap={4}>
      <Text variant="title">Semantic colors</Text>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {names.map((name) => (
          <div key={name} className="overflow-hidden rounded-lg border border-border">
            <div className="h-14" style={{ backgroundColor: `var(--${name})` }} />
            <div className="px-2 py-1 font-mono text-xs">{name}</div>
          </div>
        ))}
      </div>
    </Stack>
  ),
};

export const Scales: Story = {
  render: () => (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text variant="subtitle">Spacing</Text>
        {Object.entries(space).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-10 font-mono text-xs text-muted-foreground">{key}</span>
            <span className="h-3 bg-primary" style={{ width: value }} />
            <span className="font-mono text-xs text-muted-foreground">{value}px</span>
          </div>
        ))}
      </Stack>
      <Stack gap={2}>
        <Text variant="subtitle">Radius</Text>
        <div className="flex flex-wrap items-end gap-3">
          {Object.entries(radius).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="size-12 border border-border bg-muted" style={{ borderRadius: Math.min(value, 24) }} />
              <span className="font-mono text-xs text-muted-foreground">{key}</span>
            </div>
          ))}
        </div>
      </Stack>
      <Stack gap={2}>
        <Text variant="subtitle">Font size</Text>
        {Object.entries(fontSize).map(([key, value]) => (
          <div key={key} className="flex items-baseline gap-3">
            <span className="w-10 font-mono text-xs text-muted-foreground">{key}</span>
            <span style={{ fontSize: value }}>The quick brown fox</span>
            <span className="font-mono text-xs text-muted-foreground">{value}px</span>
          </div>
        ))}
      </Stack>
    </Stack>
  ),
};
