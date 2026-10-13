import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@horon/app"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@horon/app/components/Dialog"

const meta = {
	title: "App/Dialog",
	component: Dialog,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
	args: { open: true, children: null },
	render: () => (
		<Dialog open>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete project</DialogTitle>
					<DialogDescription>
						This action cannot be undone. The project and its data will be
						permanently removed.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline">Cancel</Button>
					<Button variant="destructive">Delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
}

function DialogDemo() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button onPress={() => setOpen(true)}>Open dialog</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite teammate</DialogTitle>
						<DialogDescription>
							They will receive an email with a link to join this workspace.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onPress={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onPress={() => setOpen(false)}>Send invite</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export const Interactive: Story = {
	args: { open: false, children: null },
	render: () => <DialogDemo />,
}
