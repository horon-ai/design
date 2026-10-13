import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	HStack,
	Input,
} from "@horon/app"

const meta = {
	title: "App/Card",
	component: Card,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<div style={{ width: 420 }}>
			<Card>
				<CardHeader>
					<CardTitle>Create project</CardTitle>
					<CardDescription>
						A cross-platform card built from React Native primitives.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input placeholder="Project name" />
					<HStack gap={2} wrap>
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outline">Outline</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="destructive">Destructive</Badge>
					</HStack>
				</CardContent>
				<CardFooter>
					<Button>Create</Button>
					<Button variant="outline">Cancel</Button>
				</CardFooter>
			</Card>
		</div>
	),
}
