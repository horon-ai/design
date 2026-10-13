import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, HStack, Stack, Text } from "@horon/app"

const meta = {
	title: "App/Button",
	component: Button,
	parameters: { layout: "centered" },
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
		},
		size: { control: "select", options: ["sm", "md", "lg", "icon"] },
		loading: { control: "boolean" },
		disabled: { control: "boolean" },
		fullWidth: { control: "boolean" },
	},
	args: {
		children: "Button",
		variant: "default",
		size: "md",
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
	render: () => (
		<HStack gap={2} wrap>
			<Button>Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</HStack>
	),
}

export const Sizes: Story = {
	render: () => (
		<HStack gap={2} align="center">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</HStack>
	),
}

export const States: Story = {
	render: () => (
		<Stack gap={3} align="flex-start">
			<Button>Idle</Button>
			<Button loading>Loading</Button>
			<Button disabled>Disabled</Button>
			<Text variant="caption" tone="muted">
				Rendered from the same source that ships to React Native.
			</Text>
		</Stack>
	),
}
