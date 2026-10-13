import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Chip } from "@horon/web/components/chip"

const meta = {
	title: "Web/Chip",
	component: Chip,
	parameters: { layout: "centered" },
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"secondary",
				"outline",
				"accent",
				"success",
				"warning",
				"destructive",
			],
		},
	},
	args: { children: "Chip" },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-2">
			<Chip>Default</Chip>
			<Chip variant="secondary">Secondary</Chip>
			<Chip variant="outline">Outline</Chip>
			<Chip variant="accent">Accent</Chip>
			<Chip variant="success">Success</Chip>
			<Chip variant="warning">Warning</Chip>
			<Chip variant="destructive">Destructive</Chip>
		</div>
	),
}

export const Removable: Story = {
	render: () => {
		const [chips, setChips] = React.useState(["design", "tokens", "web"])
		return (
			<div className="flex flex-wrap items-center gap-2">
				{chips.map((chip) => (
					<Chip
						key={chip}
						variant="secondary"
						removeLabel={`Remove ${chip}`}
						onRemove={() =>
							setChips((prev) => prev.filter((item) => item !== chip))
						}
					>
						{chip}
					</Chip>
				))}
			</div>
		)
	},
}
