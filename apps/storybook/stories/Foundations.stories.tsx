import type { Meta, StoryObj } from "@storybook/react-vite";
import { lightColors, platforms, radius, textStyles } from "@horon-ai/tokens";

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const groups = ["bg", "surface", "text", "border", "interactive", "status", "glass", "overlay", "accent", "syntax"];

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group} className="flex flex-col gap-2">
          <h2 className="text-title-sm text-text-primary">{group}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {Object.keys(lightColors)
              .filter((name) => name.split("-")[0] === group)
              .map((name) => (
                <div key={name} className="overflow-hidden rounded-md border border-border-default">
                  <div className="h-12" style={{ backgroundColor: `var(--color-${name})` }} />
                  <div className="px-2 py-1 font-mono text-caption text-text-secondary">{name}</div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="text-caption text-text-secondary">
          <th className="py-2">Style</th>
          {platforms.map((platform) => (
            <th key={platform} className="py-2">
              {platform}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(textStyles).map(([name, style]) => (
          <tr key={name} className="border-t border-border-default">
            <td
              className="py-3 pr-6 text-text-primary"
              style={{
                fontSize: `var(--text-${name})`,
                lineHeight: `var(--text-${name}--line-height)`,
                letterSpacing: `var(--text-${name}--letter-spacing)`,
                fontWeight: `var(--text-${name}--font-weight)`,
                fontFamily: style.family === "mono" ? "var(--font-mono)" : undefined,
              }}
            >
              {name}
            </td>
            {platforms.map((platform) => (
              <td key={platform} className="py-3 font-mono text-caption text-text-secondary">
                {style.size[platform]} / {style.lineHeight[platform]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.entries(radius).map(([name, value]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <div
            className="size-20 border border-border-strong bg-bg-subtle"
            style={{ borderRadius: Math.min(value, 40) }}
          />
          <span className="font-mono text-caption text-text-secondary">
            {name} {value}
          </span>
        </div>
      ))}
    </div>
  ),
};
