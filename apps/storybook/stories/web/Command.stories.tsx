import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import {
	CalendarIcon,
	CreditCardIcon,
	LogOutIcon,
	SettingsIcon,
	SmileIcon,
	UserIcon,
} from "lucide-react"

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@horon/web/components/command"
import { Button } from "@horon/web/components/button"

const meta = {
	title: "Web/Command",
	component: Command,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<Command className="w-80 rounded-md border border-border">
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>
						<CalendarIcon />
						<span>Calendar</span>
					</CommandItem>
					<CommandItem>
						<SmileIcon />
						<span>Search emoji</span>
					</CommandItem>
					<CommandItem>
						<SettingsIcon />
						<span>Settings</span>
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Account">
					<CommandItem>
						<UserIcon />
						<span>Profile</span>
						<CommandShortcut>⌘P</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<CreditCardIcon />
						<span>Billing</span>
						<CommandShortcut>⌘B</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<LogOutIcon />
						<span>Log out</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
}

export const Empty: Story = {
	render: () => (
		<Command className="w-80 rounded-md border border-border">
			<CommandInput placeholder="Search..." defaultValue="zzz" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>
						<CalendarIcon />
						<span>Calendar</span>
					</CommandItem>
					<CommandItem>
						<SmileIcon />
						<span>Search emoji</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
}

export const Dialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false)
		return (
			<>
				<Button variant="outline" onClick={() => setOpen(true)}>
					Open command menu
				</Button>
				<CommandDialog open={open} onOpenChange={setOpen}>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>
								<CalendarIcon />
								<span>Calendar</span>
							</CommandItem>
							<CommandItem>
								<SmileIcon />
								<span>Search emoji</span>
							</CommandItem>
							<CommandItem>
								<SettingsIcon />
								<span>Settings</span>
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Account">
							<CommandItem>
								<UserIcon />
								<span>Profile</span>
							</CommandItem>
							<CommandItem>
								<LogOutIcon />
								<span>Log out</span>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</>
		)
	},
}
