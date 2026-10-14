import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@horon/web/components/item"
import { Button } from "@horon/web/components/button"
import { FolderIcon, KeyRoundIcon, ShieldCheckIcon } from "lucide-react"

const meta = {
	title: "Web/Item",
	component: Item,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<ItemGroup className="w-96">
			<Item variant="outline">
				<ItemMedia variant="icon">
					<FolderIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Design tokens</ItemTitle>
					<ItemDescription>
						The single source for color, radius, spacing, and motion.
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="outline" size="sm">
						Open
					</Button>
				</ItemActions>
			</Item>
			<ItemSeparator />
			<Item variant="outline">
				<ItemMedia variant="icon">
					<KeyRoundIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>API keys</ItemTitle>
					<ItemDescription>Rotated 3 days ago.</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="ghost" size="sm">
						Manage
					</Button>
				</ItemActions>
			</Item>
			<ItemSeparator />
			<Item variant="outline">
				<ItemMedia variant="icon">
					<ShieldCheckIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Security review</ItemTitle>
					<ItemDescription>Last audit passed on June 2.</ItemDescription>
				</ItemContent>
			</Item>
		</ItemGroup>
	),
}

export const Sizes: Story = {
	render: () => (
		<ItemGroup className="w-96">
			<Item variant="muted">
				<ItemContent>
					<ItemTitle>Default size</ItemTitle>
					<ItemDescription>Comfortable padding.</ItemDescription>
				</ItemContent>
			</Item>
			<Item variant="muted" size="sm">
				<ItemContent>
					<ItemTitle>Small size</ItemTitle>
					<ItemDescription>Tighter padding for dense lists.</ItemDescription>
				</ItemContent>
			</Item>
		</ItemGroup>
	),
}
