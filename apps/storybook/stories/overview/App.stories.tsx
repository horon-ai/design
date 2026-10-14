import { useState, type CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Avatar,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	Chip,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Empty,
	HStack,
	Input,
	List,
	ListItem,
	Progress,
	Radio,
	RadioGroup,
	Select,
	Sheet,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	Skeleton,
	Spinner,
	Stack,
	Switch,
	Tabs,
	Text,
	Textarea,
	Toast,
	Tooltip,
} from "@horon/app"

const meta = {
	title: "Overview/App",
	parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const pageStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: 8,
	padding: 24,
	maxWidth: 1100,
}

const sectionStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: 20,
	paddingTop: 24,
	marginTop: 16,
	borderTop: "1px solid #e5e5e5",
}

const specimenStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: 12,
}

const headingStyle: CSSProperties = { margin: 0 }

const captionStyle: CSSProperties = {
	margin: 0,
	color: "#737373",
	fontSize: 13,
	lineHeight: 1.5,
}

const selectOptions = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry" },
	{ value: "durian", label: "Durian (out of stock)", disabled: true },
]

const tabItems = [
	{ value: "overview", label: "Overview" },
	{ value: "activity", label: "Activity" },
	{ value: "settings", label: "Settings" },
	{ value: "billing", label: "Billing", disabled: true },
]

const textVariants = [
	"display",
	"title",
	"subtitle",
	"body",
	"bodySm",
	"caption",
	"label",
	"code",
] as const

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

function SheetDemo() {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button onPress={() => setOpen(true)}>Open sheet</Button>
			<Sheet open={open} onOpenChange={setOpen} side="right">
				<SheetHeader>
					<SheetTitle>Notifications</SheetTitle>
					<SheetDescription>Manage your alerts.</SheetDescription>
				</SheetHeader>
				<Button variant="outline" onPress={() => setOpen(false)}>
					Close
				</Button>
			</Sheet>
		</>
	)
}

function OverviewPage() {
	return (
		<div style={pageStyle}>
			<h1 style={headingStyle}>App component overview</h1>
			<p style={captionStyle}>
				This page renders through react-native-web and may differ in pixels from
				the native screens.
			</p>

			<section style={sectionStyle}>
				<h2 style={headingStyle}>Buttons</h2>
				<h3 style={headingStyle}>Button</h3>
				<div data-component="Button" style={specimenStyle}>
					<HStack gap={2} wrap>
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="link">Link</Button>
					</HStack>
				</div>
			</section>

			<section style={sectionStyle}>
				<h2 style={headingStyle}>Forms</h2>

				<h3 style={headingStyle}>Input</h3>
				<div data-component="Input" style={specimenStyle}>
					<Stack gap={3} style={{ width: 320 }}>
						<Input placeholder="Default" />
						<Input placeholder="Invalid" invalid />
						<Input placeholder="Disabled" editable={false} />
					</Stack>
				</div>

				<h3 style={headingStyle}>Textarea</h3>
				<div data-component="Textarea" style={specimenStyle}>
					<Stack gap={3} style={{ width: 360 }}>
						<Textarea placeholder="Write a message…" style={{ width: 360 }} />
						<Textarea
							defaultValue="A multiline value that wraps across more than one line inside the control."
							style={{ width: 360 }}
						/>
					</Stack>
				</div>

				<h3 style={headingStyle}>Checkbox</h3>
				<div data-component="Checkbox" style={specimenStyle}>
					<Stack gap={3} align="flex-start">
						<Checkbox label="Unchecked" />
						<Checkbox checked label="Checked" />
						<Checkbox indeterminate label="Indeterminate" />
						<Checkbox checked disabled label="Disabled" />
					</Stack>
				</div>

				<h3 style={headingStyle}>Switch</h3>
				<div data-component="Switch" style={specimenStyle}>
					<HStack gap={4} align="center">
						<Switch value />
						<Switch value={false} />
						<Switch value disabled />
					</HStack>
				</div>

				<h3 style={headingStyle}>Radio</h3>
				<div data-component="Radio" style={specimenStyle}>
					<RadioGroup
						value="express"
						options={[
							{ value: "standard", label: "Standard" },
							{ value: "express", label: "Express" },
							{ value: "overnight", label: "Overnight" },
							{
								value: "pickup",
								label: "Pickup (unavailable)",
								disabled: true,
							},
						]}
					/>
				</div>

				<h3 style={headingStyle}>Select</h3>
				<div data-component="Select" style={specimenStyle}>
					<Select
						value="banana"
						options={selectOptions}
						style={{ width: 260 }}
					/>
				</div>
			</section>

			<section style={sectionStyle}>
				<h2 style={headingStyle}>Data display</h2>

				<h3 style={headingStyle}>Avatar</h3>
				<div data-component="Avatar" style={specimenStyle}>
					<HStack gap={3} align="center">
						<Avatar name="Ada Lovelace" />
						<Avatar name="Grace Hopper" />
						<Avatar name="Alan Turing" />
						<Avatar name="Katherine Johnson" />
					</HStack>
				</div>

				<h3 style={headingStyle}>Badge</h3>
				<div data-component="Badge" style={specimenStyle}>
					<HStack gap={2} wrap>
						<Badge variant="default" label="Default" />
						<Badge variant="secondary" label="Secondary" />
						<Badge variant="outline" label="Outline" />
						<Badge variant="destructive" label="Destructive" />
						<Badge variant="success" label="Success" />
						<Badge variant="warning" label="Warning" />
					</HStack>
				</div>

				<h3 style={headingStyle}>Chip</h3>
				<div data-component="Chip" style={specimenStyle}>
					<HStack gap={2} wrap>
						<Chip label="Default" />
						<Chip label="Selected" selected />
						<Chip label="Disabled" disabled />
					</HStack>
				</div>

				<h3 style={headingStyle}>Card</h3>
				<div data-component="Card" style={specimenStyle}>
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
				</div>

				<h3 style={headingStyle}>List</h3>
				<div data-component="List" style={specimenStyle}>
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
				</div>

				<h3 style={headingStyle}>Empty</h3>
				<div data-component="Empty" style={specimenStyle}>
					<Empty
						title="No projects yet"
						description="Create your first project to get started. You can always invite teammates later."
						action={<Button>New project</Button>}
						style={{ width: 420 }}
					/>
				</div>

				<h3 style={headingStyle}>Progress</h3>
				<div data-component="Progress" style={specimenStyle}>
					<Stack gap={4} style={{ width: 360 }}>
						<Progress value={60} label="Uploading" showValue />
					</Stack>
				</div>

				<h3 style={headingStyle}>Skeleton</h3>
				<div data-component="Skeleton" style={specimenStyle}>
					<Stack gap={2} style={{ width: 320 }}>
						<Skeleton width="100%" height={14} />
						<Skeleton width="90%" height={14} />
						<Skeleton width="75%" height={14} />
					</Stack>
				</div>

				<h3 style={headingStyle}>Spinner</h3>
				<div data-component="Spinner" style={specimenStyle}>
					<Stack gap={2} align="center">
						<Spinner />
						<Text variant="caption" tone="muted">
							Loading…
						</Text>
					</Stack>
				</div>

				<h3 style={headingStyle}>Tabs</h3>
				<div data-component="Tabs" style={specimenStyle}>
					<Tabs items={tabItems} value="overview" variant="segmented" />
				</div>
			</section>

			<section style={sectionStyle}>
				<h2 style={headingStyle}>Overlays</h2>

				<h3 style={headingStyle}>Dialog</h3>
				<div data-component="Dialog" style={specimenStyle}>
					<DialogDemo />
					<p style={captionStyle}>
						Closed on load — the trigger button toggles the modal open and shut.
					</p>
				</div>

				<h3 style={headingStyle}>Sheet</h3>
				<div data-component="Sheet" style={specimenStyle}>
					<SheetDemo />
					<p style={captionStyle}>
						Slides in from the right — closed until the trigger is pressed.
					</p>
				</div>

				<h3 style={headingStyle}>Tooltip</h3>
				<div data-component="Tooltip" style={specimenStyle}>
					<HStack gap={6} align="center" style={{ paddingTop: 40 }}>
						<Tooltip content="Copy to clipboard" defaultOpen>
							<Button variant="outline">Copy</Button>
						</Tooltip>
						<Tooltip content="Delete forever" defaultOpen side="bottom">
							<Button variant="destructive">Delete</Button>
						</Tooltip>
					</HStack>
				</div>

				<h3 style={headingStyle}>Toast</h3>
				<div data-component="Toast" style={specimenStyle}>
					<Stack gap={3} align="center">
						<Toast title="Saved" description="Your changes have been saved." />
						<Toast
							variant="success"
							title="Deployed"
							description="The build is live."
						/>
						<Toast
							variant="warning"
							title="Quota almost full"
							description="You have used 90% of your storage."
						/>
						<Toast
							variant="destructive"
							title="Upload failed"
							description="Check your connection and try again."
						/>
					</Stack>
				</div>
			</section>

			<section style={sectionStyle}>
				<h2 style={headingStyle}>Typography</h2>
				<h3 style={headingStyle}>Text</h3>
				<Stack gap={4} align="flex-start">
					{textVariants.map((variant) => (
						<Text key={variant} variant={variant}>
							{variant} — The quick brown fox jumps over the lazy dog
						</Text>
					))}
				</Stack>
			</section>
		</div>
	)
}

export const All: Story = {
	render: () => <OverviewPage />,
}
