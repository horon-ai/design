import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@horon/web/components/input"
import { Label } from "@horon/web/components/label"

const meta = {
	title: "Web/Input",
	component: Input,
	parameters: { layout: "centered" },
	args: { placeholder: "you@example.com" },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithLabel: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-2">
			<Label htmlFor="email">Email</Label>
			<Input id="email" type="email" placeholder="you@example.com" />
		</div>
	),
}

export const States: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-3">
			<Input placeholder="Default" />
			<Input placeholder="Disabled" disabled />
			<Input placeholder="Invalid" aria-invalid defaultValue="not-an-email" />
		</div>
	),
}
