import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"
import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardAction,
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
	DialogTrigger,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	GlassSurface,
	Input,
	Label,
	LiquidGlass,
	List,
	ListItem,
	ListItemContent,
	ListItemDescription,
	ListItemMedia,
	ListItemTitle,
	ListItemTrailing,
	Menu,
	MenuItem,
	MenuLabel,
	MenuSeparator,
	Progress,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
	Spinner,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Toaster,
	toast,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@horon/web"
import { FileTextIcon, FolderIcon, ImageIcon, InboxIcon } from "lucide-react"

const meta = {
	title: "Overview/Web",
	parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SPECIMEN = "flex flex-col gap-3 rounded-lg border border-border p-4"
const SPECIMEN_HEADING = "text-sm font-semibold text-muted-foreground"

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-xl font-semibold tracking-tight">{title}</h2>
			{children}
		</section>
	)
}

export const All: Story = {
	render: () => (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-12 p-6">
			<header className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight">Web components</h1>
				<p className="text-sm text-muted-foreground">
					Every component from the @horon/web package on a single page.
				</p>
			</header>

			<Section title="Buttons">
				<div data-component="Button" className={SPECIMEN}>
					<h3 className={SPECIMEN_HEADING}>Button</h3>
					<div className="flex flex-wrap items-center gap-2">
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="link">Link</Button>
					</div>
				</div>
			</Section>

			<Section title="Forms">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Input" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Input</h3>
						<div className="flex w-72 flex-col gap-3">
							<Input placeholder="Default" />
							<Input placeholder="Disabled" disabled />
							<Input
								placeholder="Invalid"
								aria-invalid
								defaultValue="not-an-email"
							/>
						</div>
					</div>

					<div data-component="Textarea" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Textarea</h3>
						<div className="flex w-72 flex-col gap-3">
							<Textarea placeholder="Type a message…" />
							<Textarea defaultValue="The quick brown fox jumps over the lazy dog." />
						</div>
					</div>

					<div data-component="Label" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Label</h3>
						<div className="flex w-72 flex-col gap-2">
							<Label htmlFor="overview-name">Full name</Label>
							<Input id="overview-name" placeholder="Ada Lovelace" />
						</div>
					</div>

					<div data-component="Select" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Select</h3>
						<Select defaultValue="apple">
							<SelectTrigger className="w-56">
								<SelectValue placeholder="Pick a fruit" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="apple">Apple</SelectItem>
								<SelectItem value="banana">Banana</SelectItem>
								<SelectItem value="cherry">Cherry</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div data-component="Checkbox" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Checkbox</h3>
						<div className="flex flex-col gap-3">
							<Label>
								<Checkbox /> Unchecked
							</Label>
							<Label>
								<Checkbox defaultChecked /> Checked
							</Label>
							<Label>
								<Checkbox indeterminate /> Indeterminate
							</Label>
							<Label className="opacity-50">
								<Checkbox disabled /> Disabled
							</Label>
						</div>
					</div>

					<div data-component="RadioGroup" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>RadioGroup</h3>
						<RadioGroup defaultValue="standard" className="w-64">
							<Label>
								<RadioGroupItem value="standard" /> Standard
							</Label>
							<Label>
								<RadioGroupItem value="express" /> Express
							</Label>
							<Label>
								<RadioGroupItem value="overnight" /> Overnight
							</Label>
						</RadioGroup>
					</div>

					<div data-component="Switch" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Switch</h3>
						<div className="flex flex-col gap-3">
							<Label>
								<Switch defaultChecked /> On
							</Label>
							<Label>
								<Switch /> Off
							</Label>
							<Label>
								<Switch size="sm" defaultChecked /> Small
							</Label>
							<Label className="opacity-50">
								<Switch disabled /> Disabled
							</Label>
						</div>
					</div>
				</div>
			</Section>

			<Section title="Data display">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Avatar" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Avatar</h3>
						<div className="flex items-center gap-3">
							<Avatar size="sm">
								<AvatarFallback>SM</AvatarFallback>
							</Avatar>
							<Avatar size="default">
								<AvatarFallback>MD</AvatarFallback>
							</Avatar>
							<Avatar size="lg">
								<AvatarFallback>LG</AvatarFallback>
							</Avatar>
						</div>
					</div>

					<div data-component="Badge" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Badge</h3>
						<div className="flex flex-wrap items-center gap-2">
							<Badge>Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="destructive">Destructive</Badge>
							<Badge variant="outline">Outline</Badge>
							<Badge variant="ghost">Ghost</Badge>
							<Badge variant="link">Link</Badge>
						</div>
					</div>

					<div data-component="Chip" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Chip</h3>
						<div className="flex flex-wrap items-center gap-2">
							<Chip>Default</Chip>
							<Chip variant="secondary">Secondary</Chip>
							<Chip variant="outline">Outline</Chip>
							<Chip variant="accent">Accent</Chip>
							<Chip variant="success">Success</Chip>
							<Chip variant="warning">Warning</Chip>
							<Chip variant="destructive">Destructive</Chip>
						</div>
					</div>

					<div data-component="Card" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Card</h3>
						<Card className="w-80">
							<CardHeader>
								<CardTitle>Team plan</CardTitle>
								<CardDescription>Everything your team needs.</CardDescription>
								<CardAction>
									<Button variant="outline" size="sm">
										Change
									</Button>
								</CardAction>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Unlimited projects, shared tokens, and audit history.
								</p>
							</CardContent>
							<CardFooter>
								<Button size="sm">Upgrade</Button>
							</CardFooter>
						</Card>
					</div>

					<div data-component="List" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>List</h3>
						<List className="w-96">
							<ListItem interactive>
								<ListItemMedia>
									<FolderIcon />
								</ListItemMedia>
								<ListItemContent>
									<ListItemTitle>Design tokens</ListItemTitle>
									<ListItemDescription>
										12 files updated yesterday
									</ListItemDescription>
								</ListItemContent>
								<ListItemTrailing>
									<Chip variant="secondary">synced</Chip>
								</ListItemTrailing>
							</ListItem>
							<ListItem interactive>
								<ListItemMedia>
									<FileTextIcon />
								</ListItemMedia>
								<ListItemContent>
									<ListItemTitle>Component inventory</ListItemTitle>
									<ListItemDescription>Draft</ListItemDescription>
								</ListItemContent>
								<ListItemTrailing>
									<Chip variant="outline">draft</Chip>
								</ListItemTrailing>
							</ListItem>
							<ListItem interactive>
								<ListItemMedia>
									<ImageIcon />
								</ListItemMedia>
								<ListItemContent>
									<ListItemTitle>Mascot assets</ListItemTitle>
									<ListItemDescription>8 images</ListItemDescription>
								</ListItemContent>
								<ListItemTrailing>
									<Chip variant="success">ready</Chip>
								</ListItemTrailing>
							</ListItem>
						</List>
					</div>

					<div data-component="Empty" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Empty</h3>
						<Empty className="w-96">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<InboxIcon />
								</EmptyMedia>
								<EmptyTitle>No messages</EmptyTitle>
								<EmptyDescription>
									You are all caught up. New messages will show up here.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button variant="outline">Refresh</Button>
							</EmptyContent>
						</Empty>
					</div>

					<div data-component="Progress" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Progress</h3>
						<div className="flex w-72 flex-col gap-3">
							<Progress value={60} />
							<Progress value={null} />
						</div>
					</div>

					<div data-component="Skeleton" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Skeleton</h3>
						<div className="flex w-64 flex-col gap-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-52" />
						</div>
					</div>

					<div data-component="Spinner" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Spinner</h3>
						<div className="flex items-center gap-4">
							<Spinner className="size-3" />
							<Spinner />
							<Spinner className="size-6" />
						</div>
					</div>

					<div data-component="Separator" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Separator</h3>
						<div className="w-64 text-sm">
							<p>Above</p>
							<Separator className="my-3" />
							<p>Below</p>
						</div>
					</div>

					<div data-component="Tabs" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Tabs</h3>
						<Tabs defaultValue="overview" className="w-96">
							<TabsList>
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="activity">Activity</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
							</TabsList>
							<TabsContent value="overview">
								A summary of everything happening in this workspace.
							</TabsContent>
							<TabsContent value="activity">
								Recent changes, comments and reviews.
							</TabsContent>
							<TabsContent value="settings">
								Manage members, billing and integrations.
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</Section>

			<Section title="Overlays">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Dialog" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Dialog</h3>
						<Dialog>
							<DialogTrigger render={<Button variant="outline" />}>
								Open dialog
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Edit profile</DialogTitle>
									<DialogDescription>
										Make changes to your profile here.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button>Save changes</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<p className="text-xs text-muted-foreground">
							Closed on load; the trigger opens the modal.
						</p>
					</div>

					<div data-component="Sheet" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Sheet</h3>
						<Sheet>
							<SheetTrigger render={<Button variant="outline" />}>
								Open sheet
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Edit profile</SheetTitle>
									<SheetDescription>
										Make changes to your profile here.
									</SheetDescription>
								</SheetHeader>
								<SheetFooter>
									<Button>Save changes</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>
						<p className="text-xs text-muted-foreground">
							Closed on load; the trigger opens the side panel.
						</p>
					</div>

					<div data-component="Menu" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Menu</h3>
						<Menu>
							<MenuItem>New agent</MenuItem>
							<MenuItem>Open console</MenuItem>
							<MenuSeparator />
							<MenuLabel>Recent</MenuLabel>
							<MenuItem>Run #128</MenuItem>
							<MenuItem>Run #127</MenuItem>
						</Menu>
					</div>

					<div data-component="Tooltip" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Tooltip</h3>
						<TooltipProvider>
							<Tooltip defaultOpen>
								<TooltipTrigger render={<Button variant="outline" />}>
									Hover me
								</TooltipTrigger>
								<TooltipContent>Add to library</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div data-component="Toast" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Toast</h3>
						<Toaster>
							<Button
								onClick={() =>
									toast.add({
										title: "Saved",
										description: "Your changes are live.",
										type: "success",
										timeout: 3000,
									})
								}
							>
								Show toast
							</Button>
						</Toaster>
					</div>
				</div>
			</Section>

			<Section title="Glass">
				<div
					className="overflow-hidden rounded-xl p-10"
					style={{
						background:
							"linear-gradient(135deg, #d8e3f2 0%, #f2eee6 45%, #ebd3a8 100%)",
					}}
				>
					<div className="flex flex-wrap items-start gap-6">
						<div data-component="GlassSurface" className={SPECIMEN}>
							<h3 className={SPECIMEN_HEADING}>GlassSurface</h3>
							<GlassSurface>Glass surface</GlassSurface>
						</div>
						<div data-component="LiquidGlass" className={SPECIMEN}>
							<h3 className={SPECIMEN_HEADING}>LiquidGlass</h3>
							<LiquidGlass className="w-fit px-6 py-4">
								<p className="text-sm">Liquid glass surface</p>
							</LiquidGlass>
						</div>
					</div>
				</div>
			</Section>
		</div>
	),
}
