import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "@horon/web/components/textarea"
import { Label } from "@horon/web/components/label"

const meta = {
	title: "Web/Textarea",
	component: Textarea,
	parameters: { layout: "centered" },
	args: { placeholder: "Tell us what happened…", disabled: false },
	argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { args: { className: "w-80" } }

export const States: Story = {
	render: () => (
		<div className="flex w-80 flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="ta-default">Default</Label>
				<Textarea id="ta-default" placeholder="Type a message…" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="ta-filled">Filled</Label>
				<Textarea id="ta-filled" defaultValue="The quick brown fox jumps over the lazy dog." />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="ta-disabled">Disabled</Label>
				<Textarea id="ta-disabled" disabled defaultValue="You cannot edit this." />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="ta-invalid">Invalid</Label>
				<Textarea id="ta-invalid" aria-invalid defaultValue="Something is missing." />
			</div>
		</div>
	),
}
