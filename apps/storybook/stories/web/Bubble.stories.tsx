import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Bubble,
	BubbleContent,
	BubbleGroup,
} from "@horon/web/components/bubble"

const meta = {
	title: "Web/Bubble",
	component: Bubble,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<BubbleGroup className="w-96">
			<Bubble align="start" variant="muted">
				<BubbleContent>How do I export the token set?</BubbleContent>
			</Bubble>
			<Bubble align="end" variant="default">
				<BubbleContent>
					Run the tokens build, then copy theme.css into your app.
				</BubbleContent>
			</Bubble>
			<Bubble align="start" variant="outline">
				<BubbleContent>Does it keep the radius scale?</BubbleContent>
			</Bubble>
			<Bubble align="end" variant="secondary">
				<BubbleContent>Yes, radii and colors both come from the tokens.</BubbleContent>
			</Bubble>
		</BubbleGroup>
	),
}

export const Variants: Story = {
	render: () => (
		<BubbleGroup className="w-96">
			<Bubble variant="default">
				<BubbleContent>Primary</BubbleContent>
			</Bubble>
			<Bubble variant="secondary">
				<BubbleContent>Secondary</BubbleContent>
			</Bubble>
			<Bubble variant="muted">
				<BubbleContent>Muted</BubbleContent>
			</Bubble>
			<Bubble variant="tinted">
				<BubbleContent>Tinted</BubbleContent>
			</Bubble>
			<Bubble variant="outline">
				<BubbleContent>Outline</BubbleContent>
			</Bubble>
			<Bubble variant="ghost">
				<BubbleContent>Ghost</BubbleContent>
			</Bubble>
			<Bubble variant="destructive">
				<BubbleContent>Destructive</BubbleContent>
			</Bubble>
		</BubbleGroup>
	),
}
