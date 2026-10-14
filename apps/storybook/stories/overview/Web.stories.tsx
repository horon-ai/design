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
import {
	AspectRatio,
	Attachment,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
	Bubble,
	BubbleContent,
	BubbleGroup,
	ButtonGroup,
	ButtonGroupText,
	DirectionProvider,
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
	MessageHeader,
	MessageScroller,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerViewport,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	ScrollArea,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
} from "@horon/web"
import {
	Alert,
	AlertDescription,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertTitle,
	Collapsible,
	CollapsiblePanel,
	CollapsibleTrigger,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SonnerToaster,
} from "@horon/web"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	ChartContainer,
	CodeBlock,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockHeader,
	DataTable,
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
	Kbd,
	KbdGroup,
	Marker,
	MarkerContent,
	MarkerIcon,
	RechartsPrimitive,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography,
	TypographyHeading,
	TypographyInlineCode,
	TypographyLead,
	TypographyList,
	TypographyMuted,
	type DataTableColumn,
} from "@horon/web"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@horon/web"
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionTrigger,
	Autocomplete,
	AutocompleteEmpty,
	AutocompleteInput,
	AutocompleteItem,
	AutocompleteList,
	Calendar,
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	DatePicker,
	Field,
	FieldDescription,
	FieldLabel,
	FileUpload,
	FileUploadDropzone,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
	NativeSelect,
	Questionnaire,
	QuestionnaireItem,
	QuestionnaireOption,
	QuestionnaireOptions,
	QuestionnaireProgress,
	Slider,
	SliderIndicator,
	SliderThumb,
	SliderTrack,
	SliderValue,
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	useForm,
} from "@horon/web"

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

type OverviewPayment = {
	invoice: string
	customer: string
	amount: string
}

const overviewColumns: DataTableColumn<OverviewPayment>[] = [
	{ accessorKey: "invoice", header: "Invoice" },
	{ accessorKey: "customer", header: "Customer" },
	{ accessorKey: "amount", header: "Amount" },
]

const overviewRows: OverviewPayment[] = [
	{ invoice: "INV-2041", customer: "Northwind", amount: "$1,250.00" },
	{ invoice: "INV-2040", customer: "Acme Corp", amount: "$840.00" },
]

function OverviewFormDemo() {
	const form = useForm<{ username: string }>({
		defaultValues: { username: "" },
	})

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(() => undefined)}
				className="flex w-full flex-col gap-4"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="minyeol" {...field} />
							</FormControl>
							<FormDescription>Your public display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
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

			<Section title="Additional forms and fields">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Accordion" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Accordion</h3>
						<Accordion className="w-full" defaultValue={["shipping"]}>
							<AccordionItem value="shipping">
								<AccordionTrigger>Shipping</AccordionTrigger>
								<AccordionPanel>
									Orders leave the warehouse within one business day.
								</AccordionPanel>
							</AccordionItem>
							<AccordionItem value="returns">
								<AccordionTrigger>Returns</AccordionTrigger>
								<AccordionPanel>Return unused items within 30 days.</AccordionPanel>
							</AccordionItem>
						</Accordion>
					</div>

					<div data-component="Autocomplete" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Autocomplete</h3>
						<Autocomplete items={["React", "Vue", "Svelte"]}>
							<AutocompleteInput className="w-full" placeholder="Search frameworks" />
							<AutocompleteList>
								{(item: string) => (
									<AutocompleteItem key={item} value={item}>
										{item}
									</AutocompleteItem>
								)}
								<AutocompleteEmpty>No frameworks found.</AutocompleteEmpty>
							</AutocompleteList>
						</Autocomplete>
					</div>

					<div data-component="Calendar" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Calendar</h3>
						<Calendar
							mode="single"
							defaultMonth={new Date(2026, 9, 14)}
							className="rounded-md border border-border"
						/>
					</div>

					<div data-component="Combobox" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Combobox</h3>
						<Combobox items={["Next.js", "Remix", "Astro"]}>
							<ComboboxInput className="w-full" placeholder="Select a framework" />
							<ComboboxList>
								{(item: string) => (
									<ComboboxItem key={item} value={item}>
										{item}
									</ComboboxItem>
								)}
								<ComboboxEmpty>No frameworks found.</ComboboxEmpty>
							</ComboboxList>
						</Combobox>
					</div>

					<div data-component="DatePicker" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>DatePicker</h3>
						<DatePicker defaultValue={new Date(2026, 9, 14)} />
					</div>

					<div data-component="Field" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Field</h3>
						<Field className="w-full">
							<FieldLabel htmlFor="overview-field">Display name</FieldLabel>
							<Input id="overview-field" placeholder="Ada Lovelace" />
							<FieldDescription>This is how others see you.</FieldDescription>
						</Field>
					</div>

					<div data-component="FileUpload" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>FileUpload</h3>
						<FileUpload className="w-full">
							<FileUploadDropzone>
								<p className="text-sm text-foreground">Drag and drop files here</p>
							</FileUploadDropzone>
						</FileUpload>
					</div>

					<div data-component="Form" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Form</h3>
						<OverviewFormDemo />
					</div>
				</div>
			</Section>

			<Section title="More inputs">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="InputGroup" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>InputGroup</h3>
						<InputGroup className="w-full">
							<InputGroupAddon>$</InputGroupAddon>
							<InputGroupInput placeholder="0.00" inputMode="decimal" />
							<InputGroupButton aria-label="Clear">Clear</InputGroupButton>
						</InputGroup>
					</div>

					<div data-component="InputOtp" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>InputOtp</h3>
						<InputOTP maxLength={6}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
							</InputOTPGroup>
							<InputOTPSeparator />
							<InputOTPGroup>
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</div>

					<div data-component="NativeSelect" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>NativeSelect</h3>
						<NativeSelect defaultValue="apple" aria-label="Fruit" className="w-full">
							<option value="apple">Apple</option>
							<option value="banana">Banana</option>
							<option value="cherry">Cherry</option>
						</NativeSelect>
					</div>

					<div data-component="Questionnaire" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Questionnaire</h3>
						<Questionnaire className="w-full">
							<QuestionnaireProgress value={1} max={2}>
								Question 1 of 2
							</QuestionnaireProgress>
							<QuestionnaireItem>
								<span className="text-sm font-semibold">
									Where should the palette live?
								</span>
								<QuestionnaireOptions>
									<QuestionnaireOption>@horon/tokens</QuestionnaireOption>
									<QuestionnaireOption>
										Each app keeps its own copy
									</QuestionnaireOption>
								</QuestionnaireOptions>
							</QuestionnaireItem>
						</Questionnaire>
					</div>

					<div data-component="Slider" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Slider</h3>
						<Slider defaultValue={40} className="w-full">
							<SliderTrack>
								<SliderIndicator />
								<SliderThumb aria-label="Volume" />
							</SliderTrack>
							<SliderValue />
						</Slider>
					</div>

					<div data-component="Stepper" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Stepper</h3>
						<Stepper defaultValue="profile" className="w-full">
							<StepperItem step="account">
								<StepperTrigger>
									<StepperIndicator />
									<StepperTitle>Account</StepperTitle>
								</StepperTrigger>
								<StepperSeparator />
							</StepperItem>
							<StepperItem step="profile">
								<StepperTrigger>
									<StepperIndicator />
									<StepperTitle>Profile</StepperTitle>
								</StepperTrigger>
							</StepperItem>
						</Stepper>
					</div>

					<div data-component="Toggle" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Toggle</h3>
						<Toggle className="w-fit">Bold</Toggle>
					</div>

					<div data-component="ToggleGroup" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>ToggleGroup</h3>
						<ToggleGroup defaultValue={["left"]} aria-label="Alignment">
							<ToggleGroupItem value="left">Left</ToggleGroupItem>
							<ToggleGroupItem value="center">Center</ToggleGroupItem>
							<ToggleGroupItem value="right">Right</ToggleGroupItem>
						</ToggleGroup>
					</div>
				</div>
			</Section>

			<Section title="Navigation and menus">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Breadcrumb" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Breadcrumb</h3>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="#">Home</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Components</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					<div data-component="Command" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Command</h3>
						<Command className="w-full rounded-md border border-border">
							<CommandInput placeholder="Type a command..." />
							<CommandList>
								<CommandEmpty>No results found.</CommandEmpty>
								<CommandGroup heading="Suggestions">
									<CommandItem>Calendar</CommandItem>
									<CommandItem>Settings</CommandItem>
								</CommandGroup>
							</CommandList>
						</Command>
					</div>

					<div data-component="ContextMenu" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>ContextMenu</h3>
						<ContextMenu>
							<ContextMenuTrigger className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
								Right click here
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuLabel>Navigation</ContextMenuLabel>
								<ContextMenuItem>Back</ContextMenuItem>
								<ContextMenuItem>Forward</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem disabled>Inspect element</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					</div>

					<div data-component="DropdownMenu" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>DropdownMenu</h3>
						<DropdownMenu>
							<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
							<DropdownMenuContent className="w-48">
								<DropdownMenuLabel>Session</DropdownMenuLabel>
								<DropdownMenuItem>New agent</DropdownMenuItem>
								<DropdownMenuItem>Open console</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div data-component="Menubar" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Menubar</h3>
						<Menubar>
							<MenubarMenu>
								<MenubarTrigger>File</MenubarTrigger>
								<MenubarContent>
									<MenubarLabel>File</MenubarLabel>
									<MenubarItem>New agent</MenubarItem>
									<MenubarSeparator />
									<MenubarItem>Save session</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					</div>

					<div data-component="NavigationMenu" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>NavigationMenu</h3>
						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger>Products</NavigationMenuTrigger>
									<NavigationMenuContent>
										<NavigationMenuLink href="/products/agents">
											Agents
										</NavigationMenuLink>
									</NavigationMenuContent>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div data-component="Pagination" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Pagination</h3>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious href="#" />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#" isActive>
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href="#">2</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext href="#" />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>

					<div data-component="Sidebar" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Sidebar</h3>
						<div className="flex h-56 w-full overflow-hidden rounded-lg border border-border bg-background">
							<Sidebar>
								<SidebarHeader className="justify-between">
									<span className="px-2 text-sm font-semibold">Horon</span>
									<SidebarTrigger />
								</SidebarHeader>
								<SidebarContent>
									<SidebarGroup>
										<SidebarMenuItem>
											<SidebarMenuButton active aria-label="Overview">
												<span>Overview</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton aria-label="Settings">
												<span>Settings</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarGroup>
								</SidebarContent>
							</Sidebar>
							<div className="flex-1 p-4 text-sm text-muted-foreground">
								Inset content
							</div>
						</div>
					</div>
				</div>
			</Section>

			<Section title="Additional data display">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Carousel" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Carousel</h3>
						<Carousel className="w-full">
							<CarouselContent>
								<CarouselItem>
									<div className="rounded-md border border-border p-6 text-sm">
										Slide one
									</div>
								</CarouselItem>
								<CarouselItem>
									<div className="rounded-md border border-border p-6 text-sm">
										Slide two
									</div>
								</CarouselItem>
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>

					<div data-component="Chart" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Chart</h3>
						<ChartContainer
							config={{ desktop: { label: "Desktop", color: "var(--chart-1)" } }}
							className="h-[180px] w-full"
						>
							<RechartsPrimitive.BarChart
								data={[
									{ month: "Jan", desktop: 120 },
									{ month: "Feb", desktop: 200 },
									{ month: "Mar", desktop: 160 },
								]}
							>
								<RechartsPrimitive.CartesianGrid vertical={false} />
								<RechartsPrimitive.XAxis
									dataKey="month"
									tickLine={false}
									axisLine={false}
								/>
								<RechartsPrimitive.Bar
									dataKey="desktop"
									fill="var(--color-desktop)"
									radius={4}
								/>
							</RechartsPrimitive.BarChart>
						</ChartContainer>
					</div>

					<div data-component="CodeBlock" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>CodeBlock</h3>
						<CodeBlock className="w-full">
							<CodeBlockHeader>
								<span className="font-mono">terminal</span>
								<CodeBlockCopyButton />
							</CodeBlockHeader>
							<CodeBlockContent>{`bun add @horon/web`}</CodeBlockContent>
						</CodeBlock>
					</div>

					<div data-component="DataTable" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>DataTable</h3>
						<DataTable
							columns={overviewColumns}
							data={overviewRows}
							className="w-full"
						/>
					</div>

					<div data-component="Item" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Item</h3>
						<ItemGroup className="w-full">
							<Item variant="outline">
								<ItemMedia variant="icon">
									<FileTextIcon />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Design tokens</ItemTitle>
									<ItemDescription>Color, radius, spacing, and motion.</ItemDescription>
								</ItemContent>
							</Item>
						</ItemGroup>
					</div>

					<div data-component="Kbd" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Kbd</h3>
						<KbdGroup>
							<Kbd>Ctrl</Kbd>
							<Kbd>S</Kbd>
						</KbdGroup>
					</div>

					<div data-component="Marker" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Marker</h3>
						<Marker variant="success">
							<MarkerIcon>
								<FileTextIcon />
							</MarkerIcon>
							<MarkerContent>Completed</MarkerContent>
						</Marker>
					</div>

					<div data-component="Table" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Table</h3>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Invoice</TableHead>
									<TableHead>Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>INV-2041</TableCell>
									<TableCell>$1,250.00</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>

					<div data-component="Typography" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Typography</h3>
						<Typography className="w-full">
							<TypographyHeading level={3}>Horon design system</TypographyHeading>
							<TypographyLead>A single source of truth.</TypographyLead>
							<p>
								Install{" "}
								<TypographyInlineCode>@horon/tokens</TypographyInlineCode>.
							</p>
							<TypographyList>
								<li>Add tokens to your workspace.</li>
							</TypographyList>
							<TypographyMuted>Last updated October 2026.</TypographyMuted>
						</Typography>
					</div>
				</div>
			</Section>

			<Section title="Additional overlays">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Alert" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Alert</h3>
						<Alert variant="info" className="w-full">
							<AlertTitle>Heads up</AlertTitle>
							<AlertDescription>
								You can add components with the CLI.
							</AlertDescription>
						</Alert>
					</div>

					<div data-component="AlertDialog" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>AlertDialog</h3>
						<AlertDialog>
							<AlertDialogTrigger render={<Button variant="outline" />}>
								Delete workspace
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction>Delete</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>

					<div data-component="Collapsible" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Collapsible</h3>
						<Collapsible className="w-full">
							<CollapsibleTrigger>Recent activity</CollapsibleTrigger>
							<CollapsiblePanel>
								<ul className="flex flex-col gap-1.5">
									<li>Deployed the design system.</li>
									<li>Merged the token refactor.</li>
								</ul>
							</CollapsiblePanel>
						</Collapsible>
					</div>

					<div data-component="Drawer" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Drawer</h3>
						<Drawer>
							<DrawerTrigger render={<Button variant="outline" />}>
								Open drawer
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>Notifications</DrawerTitle>
									<DrawerDescription>
										Choose how Horon keeps you in the loop.
									</DrawerDescription>
								</DrawerHeader>
								<DrawerFooter>
									<DrawerClose render={<Button variant="outline" />}>
										Close
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</div>

					<div data-component="HoverCard" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>HoverCard</h3>
						<HoverCard>
							<HoverCardTrigger
								href="#"
								className="text-sm font-medium text-primary underline underline-offset-4"
							>
								@horon
							</HoverCardTrigger>
							<HoverCardContent>
								<p className="text-sm font-semibold">Horon</p>
								<p className="text-[13px] text-muted-foreground">
									Design system and component library.
								</p>
							</HoverCardContent>
						</HoverCard>
					</div>

					<div data-component="Popover" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Popover</h3>
						<Popover>
							<PopoverTrigger render={<Button variant="outline" />}>
								Set dimensions
							</PopoverTrigger>
							<PopoverContent className="w-64">
								<div className="flex flex-col gap-2">
									<Label htmlFor="overview-popover">Width</Label>
									<Input id="overview-popover" defaultValue="320" />
								</div>
							</PopoverContent>
						</Popover>
					</div>

					<div data-component="Sonner" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>SonnerToaster</h3>
						<SonnerToaster position="bottom-right" />
					</div>
				</div>
			</Section>

			<Section title="Layout and structure">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="AspectRatio" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>AspectRatio</h3>
						<AspectRatio
							ratio={16 / 9}
							className="w-full rounded-md border border-border bg-muted"
						>
							<div className="flex size-full items-center justify-center text-[13px] text-muted-foreground">
								16 / 9
							</div>
						</AspectRatio>
					</div>

					<div data-component="ButtonGroup" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>ButtonGroup</h3>
						<ButtonGroup>
							<Button variant="outline">Back</Button>
							<Button variant="outline">Next</Button>
							<ButtonGroupText>Total</ButtonGroupText>
						</ButtonGroup>
					</div>

					<div data-component="Direction" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Direction</h3>
						<DirectionProvider direction="rtl">
							<div
								dir="rtl"
								className="w-full rounded-md border border-border bg-card p-4 text-sm text-card-foreground"
							>
								<p>يبدأ التخطيط من اليمين إلى اليسار.</p>
							</div>
						</DirectionProvider>
					</div>

					<div data-component="Resizable" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Resizable</h3>
						<div className="h-40 w-full overflow-hidden rounded-md border border-border">
							<ResizablePanelGroup>
								<ResizablePanel defaultSize="40%">
									<div className="flex h-full items-center justify-center p-4 text-[13px] text-muted-foreground">
										Folders
									</div>
								</ResizablePanel>
								<ResizableHandle withHandle />
								<ResizablePanel defaultSize="60%">
									<div className="flex h-full items-center justify-center p-4 text-[13px] text-muted-foreground">
										Preview
									</div>
								</ResizablePanel>
							</ResizablePanelGroup>
						</div>
					</div>

					<div data-component="ScrollArea" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>ScrollArea</h3>
						<ScrollArea className="h-40 w-full rounded-md border border-border">
							<ScrollAreaViewport>
								<div className="flex flex-col gap-3 p-4 text-[13px] leading-relaxed text-muted-foreground">
									<p>
										Vernacular building is raised outside any academic
										tradition.
									</p>
									<p>
										Materials come from the region, and the form follows local
										craft.
									</p>
								</div>
							</ScrollAreaViewport>
							<ScrollAreaScrollbar>
								<ScrollAreaThumb />
							</ScrollAreaScrollbar>
						</ScrollArea>
					</div>
				</div>
			</Section>

			<Section title="Chat">
				<div className="grid gap-6 md:grid-cols-2">
					<div data-component="Attachment" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Attachment</h3>
						<Attachment className="w-full">
							<AttachmentMedia>
								<FileTextIcon />
							</AttachmentMedia>
							<AttachmentContent>
								<AttachmentTitle>Design brief.pdf</AttachmentTitle>
								<AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
							</AttachmentContent>
						</Attachment>
					</div>

					<div data-component="Bubble" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Bubble</h3>
						<BubbleGroup className="w-full">
							<Bubble align="start" variant="muted">
								<BubbleContent>How do I export the token set?</BubbleContent>
							</Bubble>
							<Bubble align="end" variant="default">
								<BubbleContent>
									Run the tokens build, then copy theme.css.
								</BubbleContent>
							</Bubble>
						</BubbleGroup>
					</div>

					<div data-component="Message" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>Message</h3>
						<Message>
							<MessageAvatar>
								<Avatar size="sm">
									<AvatarFallback>AI</AvatarFallback>
								</Avatar>
							</MessageAvatar>
							<MessageContent>
								<MessageHeader>Horon Assistant</MessageHeader>
								<Bubble variant="muted" align="start">
									<BubbleContent>
										I moved the palette into the token package.
									</BubbleContent>
								</Bubble>
								<MessageFooter>2:14 PM</MessageFooter>
							</MessageContent>
						</Message>
					</div>

					<div data-component="MessageScroller" className={SPECIMEN}>
						<h3 className={SPECIMEN_HEADING}>MessageScroller</h3>
						<MessageScroller className="h-56 w-full rounded-md border border-border">
							<MessageScrollerViewport className="p-4">
								<MessageScrollerContent>
									<MessageScrollerItem>
										<Message>
											<MessageContent>
												<MessageHeader>Horon Assistant</MessageHeader>
												<Bubble variant="muted" align="start">
													<BubbleContent>
														Where should the palette live?
													</BubbleContent>
												</Bubble>
											</MessageContent>
										</Message>
									</MessageScrollerItem>
									<MessageScrollerItem>
										<Message align="end">
											<MessageContent>
												<MessageHeader>민열</MessageHeader>
												<Bubble variant="default" align="end">
													<BubbleContent>In @horon/tokens.</BubbleContent>
												</Bubble>
											</MessageContent>
										</Message>
									</MessageScrollerItem>
								</MessageScrollerContent>
							</MessageScrollerViewport>
						</MessageScroller>
					</div>
				</div>
			</Section>
		</div>
	),
}
