import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Collapsible,
	CollapsiblePanel,
	CollapsibleTrigger,
} from "@horon/web/components/collapsible"
import { Button } from "@horon/web/components/button"
import { ChevronDownIcon } from "lucide-react"

const meta = {
	title: "Web/Collapsible",
	component: Collapsible,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<Collapsible className="w-80">
			<CollapsibleTrigger
				render={
					<Button variant="outline" className="w-full justify-between" />
				}
			>
				Recent activity
				<ChevronDownIcon className="group-data-[panel-open]/collapsible-trigger:rotate-180" />
			</CollapsibleTrigger>
			<CollapsiblePanel>
				<ul className="flex flex-col gap-1.5">
					<li>Deployed the design system to staging.</li>
					<li>Merged the token pipeline refactor.</li>
					<li>Opened a review for the new button variants.</li>
				</ul>
			</CollapsiblePanel>
		</Collapsible>
	),
}

export const Open: Story = {
	render: () => (
		<Collapsible className="w-80" defaultOpen>
			<CollapsibleTrigger
				render={
					<Button variant="outline" className="w-full justify-between" />
				}
			>
				Recent activity
				<ChevronDownIcon className="group-data-[panel-open]/collapsible-trigger:rotate-180" />
			</CollapsibleTrigger>
			<CollapsiblePanel>
				<ul className="flex flex-col gap-1.5">
					<li>Deployed the design system to staging.</li>
					<li>Merged the token pipeline refactor.</li>
					<li>Opened a review for the new button variants.</li>
				</ul>
			</CollapsiblePanel>
		</Collapsible>
	),
}
