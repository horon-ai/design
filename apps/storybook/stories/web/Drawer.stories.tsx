import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@horon/web/components/drawer"
import { Button } from "@horon/web/components/button"

const meta = {
	title: "Web/Drawer",
	component: Drawer,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

function Body() {
	return (
		<>
			<DrawerHeader>
				<DrawerTitle>Notifications</DrawerTitle>
				<DrawerDescription>
					Choose how Horon keeps you in the loop.
				</DrawerDescription>
			</DrawerHeader>
			<div className="px-[18px] text-[13px] text-muted-foreground">
				Swipe the sheet down to dismiss it, or press Escape.
			</div>
			<DrawerFooter>
				<Button>Save preferences</Button>
				<DrawerClose render={<Button variant="outline" />}>
					Cancel
				</DrawerClose>
			</DrawerFooter>
		</>
	)
}

export const Playground: Story = {
	render: () => (
		<Drawer>
			<DrawerTrigger render={<Button variant="outline" />}>
				Open drawer
			</DrawerTrigger>
			<DrawerContent>
				<Body />
			</DrawerContent>
		</Drawer>
	),
}

export const Bottom: Story = {
	render: () => (
		<Drawer>
			<DrawerTrigger render={<Button variant="outline" />}>
				Open bottom drawer
			</DrawerTrigger>
			<DrawerContent side="bottom">
				<Body />
			</DrawerContent>
		</Drawer>
	),
}

export const Right: Story = {
	render: () => (
		<Drawer>
			<DrawerTrigger render={<Button variant="outline" />}>
				Open right drawer
			</DrawerTrigger>
			<DrawerContent side="right">
				<Body />
			</DrawerContent>
		</Drawer>
	),
}

export const Open: Story = {
	render: () => (
		<Drawer defaultOpen>
			<DrawerTrigger render={<Button variant="outline" />}>
				Open drawer
			</DrawerTrigger>
			<DrawerContent>
				<Body />
			</DrawerContent>
		</Drawer>
	),
}
