import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@horon/web/components/menu";

const meta = {
  title: "Web/Menu",
  component: Menu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuItem>New agent</MenuItem>
      <MenuItem>Open console</MenuItem>
      <MenuSeparator />
      <MenuLabel>Recent</MenuLabel>
      <MenuItem>Run #128</MenuItem>
      <MenuItem>Run #127</MenuItem>
    </Menu>
  ),
};

export const OnGlassStage: Story = {
  render: () => (
    <div className="rounded-lg bg-gradient-to-br from-[#d8e3f2] via-[#f2eee6] to-[#ebd3a8] p-7">
      <Menu>
        <MenuItem>New agent</MenuItem>
        <MenuItem>Open console</MenuItem>
      </Menu>
    </div>
  ),
};
