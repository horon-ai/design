import type { Meta, StoryObj } from "@storybook/react-vite"
import { Command, Search } from "lucide-react"
import { Kbd, KbdGroup } from "@horon/web/components/kbd"

const meta = {
	title: "Web/Kbd",
	component: Kbd,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => <Kbd>K</Kbd>,
}

export const Keys: Story = {
	render: () => (
		<div className="flex flex-col items-start gap-4 text-[13px] text-foreground">
			<span className="flex items-center gap-2">
				Open the command menu
				<KbdGroup>
					<Kbd>
						<Command />
					</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</span>
			<span className="flex items-center gap-2">
				Search
				<Kbd>
					<Search />
				</Kbd>
			</span>
			<span className="flex items-center gap-2">
				Save changes
				<KbdGroup>
					<Kbd>Ctrl</Kbd>
					<Kbd>S</Kbd>
				</KbdGroup>
			</span>
			<span className="flex items-center gap-2">
				Move up
				<Kbd>Up</Kbd>
			</span>
		</div>
	),
}
