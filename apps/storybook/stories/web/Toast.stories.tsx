import type { Meta, StoryObj } from "@storybook/react-vite"
import { Toaster, toast } from "@horon/web/components/toast"
import { Button } from "@horon/web/components/button"

const meta = {
	title: "Web/Toast",
	parameters: { layout: "centered" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<Toaster>
			<div className="flex flex-col items-start gap-2">
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
					Auto-dismiss toast
				</Button>
				<Button
					variant="outline"
					onClick={() =>
						toast.add({
							title: "Heads up",
							description: "This one stays until you close it.",
							type: "info",
							timeout: 0,
						})
					}
				>
					Manual dismiss toast
				</Button>
			</div>
		</Toaster>
	),
}

export const Types: Story = {
	render: () => (
		<Toaster>
			<div className="flex flex-wrap items-center gap-2">
				{(["success", "info", "warning", "error", "loading"] as const).map(
					(type) => (
						<Button
							key={type}
							variant="outline"
							onClick={() =>
								toast.add({
									title: type[0].toUpperCase() + type.slice(1),
									description: `${type} toast`,
									type,
									timeout: 0,
								})
							}
						>
							{type}
						</Button>
					)
				)}
			</div>
		</Toaster>
	),
}

export const WithAction: Story = {
	render: () => (
		<Toaster>
			<Button
				variant="outline"
				onClick={() =>
					toast.add({
						title: "Item deleted",
						description: "The item moved to trash.",
						type: "warning",
						timeout: 0,
						actionProps: { children: "Undo" },
					})
				}
			>
				Show toast with action
			</Button>
		</Toaster>
	),
}
