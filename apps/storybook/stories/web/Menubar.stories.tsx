import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@horon/web/components/menubar"

const meta = {
	title: "Web/Menubar",
	component: Menubar,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>File</MenubarTrigger>
				<MenubarContent>
					<MenubarLabel>File</MenubarLabel>
					<MenubarItem>New agent</MenubarItem>
					<MenubarItem>Open console</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Save session</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Edit</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Undo</MenubarItem>
					<MenubarItem>Redo</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Cut</MenubarItem>
					<MenubarItem>Copy</MenubarItem>
					<MenubarItem>Paste</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Zoom in</MenubarItem>
					<MenubarItem>Zoom out</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Reset layout</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
}
