import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@horon/web/components/select"

const meta = {
	title: "Web/Select",
	component: Select,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

function Options() {
	return (
		<SelectContent>
			<SelectItem value="apple">Apple</SelectItem>
			<SelectItem value="banana">Banana</SelectItem>
			<SelectItem value="cherry">Cherry</SelectItem>
			<SelectItem value="durian" disabled>
				Durian (out of stock)
			</SelectItem>
		</SelectContent>
	)
}

export const Interactive: Story = {
	render: () => (
		<Select defaultValue="apple">
			<SelectTrigger className="w-56">
				<SelectValue placeholder="Pick a fruit" />
			</SelectTrigger>
			<Options />
		</Select>
	),
}

export const Open: Story = {
	render: () => (
		<Select defaultOpen defaultValue="banana">
			<SelectTrigger className="w-56">
				<SelectValue placeholder="Pick a fruit" />
			</SelectTrigger>
			<Options />
		</Select>
	),
}
