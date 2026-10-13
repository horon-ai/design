import type { Meta, StoryObj } from "@storybook/react-vite"
import { Stack } from "@horon/app"
import { Progress } from "@horon/app/components/Progress"

const meta = {
	title: "App/Progress",
	component: Progress,
	parameters: { layout: "padded" },
	args: { value: 60, max: 100 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Stack gap={4} style={{ width: 360 }}>
			<Progress value={25} />
			<Progress value={60} />
			<Progress value={100} />
		</Stack>
	),
}

export const WithLabel: Story = {
	render: () => (
		<Stack gap={4} style={{ width: 360 }}>
			<Progress value={40} label="Uploading" showValue />
			<Progress value={90} variant="success" label="Processing" showValue />
		</Stack>
	),
}

export const Variants: Story = {
	render: () => (
		<Stack gap={4} style={{ width: 360 }}>
			<Progress value={55} variant="default" />
			<Progress value={55} variant="success" />
			<Progress value={55} variant="warning" />
			<Progress value={55} variant="destructive" />
		</Stack>
	),
}

export const Indeterminate: Story = {
	render: () => (
		<Stack gap={4} style={{ width: 360 }}>
			<Progress indeterminate />
		</Stack>
	),
}
