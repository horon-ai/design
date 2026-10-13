import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input, Stack, Text } from "@horon/app"

const meta = {
	title: "App/Input",
	component: Input,
	parameters: { layout: "centered" },
	args: { placeholder: "you@example.com" },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
	render: () => (
		<Stack gap={3} style={{ width: 280 }}>
			<Input placeholder="Default" />
			<Input placeholder="Invalid" invalid />
			<Input placeholder="Disabled" editable={false} />
			<Text variant="caption" tone="muted">
				Same component ships to iOS and Android.
			</Text>
		</Stack>
	),
}
