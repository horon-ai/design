import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { HStack, Stack, Text } from "@horon/app"
import { Switch } from "@horon/app/components/Switch"

function SwitchDemo() {
	const [on, setOn] = useState(true)
	return (
		<Stack gap={3} align="flex-start">
			<HStack gap={3} align="center">
				<Switch value={on} onValueChange={setOn} />
				<Text>{on ? "On" : "Off"}</Text>
			</HStack>
			<HStack gap={3} align="center">
				<Switch value={false} />
				<Text tone="muted">Off</Text>
			</HStack>
			<HStack gap={3} align="center">
				<Switch value disabled />
				<Text tone="muted">Disabled</Text>
			</HStack>
		</Stack>
	)
}

const meta = {
	title: "App/Switch",
	component: Switch,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => <SwitchDemo />,
}

export const States: Story = {
	render: () => (
		<HStack gap={4} align="center">
			<Switch value={false} />
			<Switch value />
			<Switch value disabled />
		</HStack>
	),
}
