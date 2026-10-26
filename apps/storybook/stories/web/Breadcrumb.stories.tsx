import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

const meta = {
  title: "Web/Breadcrumb",
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#" tile="H">
        Horon HQ
      </BreadcrumbItem>
      <BreadcrumbItem current>Q4 hiring</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const ThreeLevels: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#" tile="H">
        Horon HQ
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
      <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
    </Breadcrumb>
  ),
};
