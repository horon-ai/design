import type { Meta, StoryObj } from "@storybook/react-vite"
import { Stack } from "@horon/app"
import { Textarea } from "@horon/app/components/Textarea"

const meta = {
	title: "App/Textarea",
	component: Textarea,
	parameters: { layout: "centered" },
	args: { placeholder: "Write a message…", style: { width: 360 } },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
	render: () => (
		<Stack gap={3} align="flex-start">
			<Textarea placeholder="Enabled" style={{ width: 360 }} />
			<Textarea placeholder="Disabled" editable={false} style={{ width: 360 }} />
			<Textarea placeholder="Invalid" invalid style={{ width: 360 }} />
			<Textarea
				defaultValue="A multiline value that wraps across more than one line inside the control."
				style={{ width: 360 }}
			/>
		</Stack>
	),
}
