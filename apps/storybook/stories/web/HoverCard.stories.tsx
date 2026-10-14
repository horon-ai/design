import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@horon/web/components/hover-card"

const meta = {
	title: "Web/HoverCard",
	component: HoverCard,
	parameters: { layout: "centered" },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<HoverCard>
			<HoverCardTrigger
				href="https://horon.ai"
				className="text-sm font-medium text-primary underline underline-offset-4"
			>
				@horon
			</HoverCardTrigger>
			<HoverCardContent>
				<div className="flex flex-col gap-1">
					<p className="text-sm font-semibold text-foreground">Horon</p>
					<p className="text-[13px] text-muted-foreground">
						The design system and component library that powers the Horon
						web surfaces.
					</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
}

export const Sides: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			<HoverCard>
				<HoverCardTrigger
					href="#top"
					className="text-sm font-medium text-primary underline underline-offset-4"
				>
					Top
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-48">
					<p className="text-[13px] text-muted-foreground">
						This card opens above its trigger.
					</p>
				</HoverCardContent>
			</HoverCard>
			<HoverCard>
				<HoverCardTrigger
					href="#right"
					className="text-sm font-medium text-primary underline underline-offset-4"
				>
					Right
				</HoverCardTrigger>
				<HoverCardContent side="right" className="w-48">
					<p className="text-[13px] text-muted-foreground">
						This card opens to the right of its trigger.
					</p>
				</HoverCardContent>
			</HoverCard>
		</div>
	),
}
