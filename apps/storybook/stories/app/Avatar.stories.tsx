import type { Meta, StoryObj } from "@storybook/react-vite"
import { HStack, Text } from "@horon/app"
import { Avatar } from "@horon/app/components/Avatar"

const meta = {
	title: "App/Avatar",
	component: Avatar,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Initials: Story = {
	render: () => (
		<HStack gap={3} align="center">
			<Avatar name="Ada Lovelace" />
			<Avatar name="Grace Hopper" />
			<Avatar name="Alan Turing" />
			<Avatar />
		</HStack>
	),
}

export const Sizes: Story = {
	render: () => (
		<HStack gap={3} align="center">
			<Avatar size="sm" name="Ada Lovelace" />
			<Avatar size="md" name="Ada Lovelace" />
			<Avatar size="lg" name="Ada Lovelace" />
		</HStack>
	),
}

export const WithImage: Story = {
	render: () => (
		<HStack gap={3} align="center">
			<Avatar
				size="lg"
				name="Ada Lovelace"
				src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23e0921f'/%3E%3C/svg%3E"
			/>
			<Text variant="caption" tone="muted">
				Image source with initials fallback
			</Text>
		</HStack>
	),
}
