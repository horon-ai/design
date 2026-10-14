import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@horon/web/components/dropdown-menu"
import { ChevronDownIcon, PencilIcon, Trash2Icon } from "lucide-react"

const meta = {
	title: "Web/DropdownMenu",
	component: DropdownMenu,
	parameters: { layout: "centered" },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>
				Actions
				<ChevronDownIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Session</DropdownMenuLabel>
				<DropdownMenuItem>New agent</DropdownMenuItem>
				<DropdownMenuItem>Open console</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem defaultChecked>
					Show sidebar
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Show minimap</DropdownMenuCheckboxItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Density</DropdownMenuLabel>
				<DropdownMenuRadioGroup defaultValue="comfortable">
					<DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="comfortable">
						Comfortable
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<PencilIcon />
					Rename
				</DropdownMenuItem>
				<DropdownMenuItem disabled>
					<Trash2Icon />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
}
