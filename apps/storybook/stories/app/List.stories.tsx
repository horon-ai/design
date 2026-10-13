import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge, Stack, Text } from "@horon/app"
import { Avatar } from "@horon/app/components/Avatar"
import { List, ListItem } from "@horon/app/components/List"

const meta = {
	title: "App/List",
	component: List,
	parameters: { layout: "padded" },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { children: null },
	render: () => (
		<div style={{ width: 420 }}>
			<List>
				<ListItem
					title="Ada Lovelace"
					subtitle="ada@example.com"
					leading={<Avatar name="Ada Lovelace" />}
					trailing={<Badge variant="success">Active</Badge>}
				/>
				<ListItem
					title="Grace Hopper"
					subtitle="grace@example.com"
					leading={<Avatar name="Grace Hopper" />}
					trailing={<Badge variant="warning">Invited</Badge>}
				/>
				<ListItem
					title="Alan Turing"
					subtitle="alan@example.com"
					leading={<Avatar name="Alan Turing" />}
				/>
			</List>
		</div>
	),
}

export const WithPress: Story = {
	args: { children: null },
	render: () => (
		<div style={{ width: 420 }}>
			<List>
				<ListItem
					title="Account settings"
					subtitle="Profile, security, sessions"
					onPress={() => undefined}
					trailing={<Text tone="muted">›</Text>}
				/>
				<ListItem
					title="Notifications"
					subtitle="Email and push preferences"
					onPress={() => undefined}
					trailing={<Text tone="muted">›</Text>}
				/>
				<ListItem title="Danger zone" disabled subtitle="Unavailable" />
			</List>
		</div>
	),
}

export const Plain: Story = {
	args: { children: null },
	render: () => (
		<Stack style={{ width: 420 }}>
			<List>
				<ListItem title="Simple row" />
				<ListItem title="With subtitle" subtitle="Secondary line" />
			</List>
		</Stack>
	),
}
