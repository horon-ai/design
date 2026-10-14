import type { Meta, StoryObj } from "@storybook/react-vite"
import { GlassSurface } from "@horon/web/components/glass-surface"

const meta = {
	title: "Web/GlassSurface",
	component: GlassSurface,
	parameters: { layout: "centered" },
	args: { children: "Glass surface" },
} satisfies Meta<typeof GlassSurface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => (
		<div className="rounded-lg bg-gradient-to-br from-[#d8e3f2] via-[#f2eee6] to-[#ebd3a8] p-7">
			<GlassSurface {...args} />
		</div>
	),
}
