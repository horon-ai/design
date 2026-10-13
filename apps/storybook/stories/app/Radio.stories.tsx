import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Stack, Text } from "@horon/app"
import { Radio, RadioGroup } from "@horon/app/components/Radio"

function RadioDemo() {
	const [value, setValue] = useState("standard")
	return (
		<Stack gap={3} align="flex-start">
			<RadioGroup
				value={value}
				onValueChange={setValue}
				options={[
					{ value: "standard", label: "Standard" },
					{ value: "express", label: "Express" },
					{ value: "overnight", label: "Overnight" },
					{ value: "pickup", label: "Pickup (unavailable)", disabled: true },
				]}
			/>
			<Text variant="caption" tone="muted">
				Selected: {value}
			</Text>
		</Stack>
	)
}

const meta = {
	title: "App/Radio",
	component: Radio,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => <RadioDemo />,
}

export const States: Story = {
	render: () => (
		<Stack gap={3} align="flex-start">
			<Radio label="Unselected" />
			<Radio selected label="Selected" />
			<Radio disabled label="Disabled" />
		</Stack>
	),
}
