import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, HStack } from "@horon/app"
import { Tooltip } from "@horon/app/components/Tooltip"

const meta = {
	title: "App/Tooltip",
	component: Tooltip,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {
	args: { content: "Copy to clipboard", children: null, defaultOpen: true },
	render: () => (
		<HStack gap={6} align="center">
			<Tooltip content="Copy to clipboard" defaultOpen>
				<Button variant="outline">Copy</Button>
			</Tooltip>
			<Tooltip content="Delete forever" defaultOpen side="bottom">
				<Button variant="destructive">Delete</Button>
			</Tooltip>
		</HStack>
	),
}

export const Hover: Story = {
	args: { content: "Hover or long-press", children: null },
	render: () => (
		<Tooltip content="Hover or long-press to reveal">
			<Button variant="outline">Hover me</Button>
		</Tooltip>
	),
}
