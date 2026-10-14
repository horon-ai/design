import type { Meta, StoryObj } from "@storybook/react-vite"
import { DirectionProvider } from "@horon/web/components/direction"
import { Badge } from "@horon/web/components/badge"
import { Button } from "@horon/web/components/button"

const meta = {
	title: "Web/Direction",
	component: DirectionProvider,
	parameters: { layout: "centered" },
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<DirectionProvider direction="rtl">
			<div
				dir="rtl"
				className="flex w-80 flex-col gap-3 rounded-md border border-border bg-card p-4 text-sm text-card-foreground"
			>
				<div className="flex items-center justify-between gap-2">
					<span className="font-medium">الفاتورة</span>
					<Badge variant="secondary">مدفوع</Badge>
				</div>
				<p className="text-muted-foreground">
					يبدأ التخطيط من اليمين إلى اليسار داخل مزود الاتجاه.
				</p>
				<div className="flex items-center gap-2">
					<Button size="sm">حفظ</Button>
					<Button size="sm" variant="outline">
						إلغاء
					</Button>
				</div>
			</div>
		</DirectionProvider>
	),
}

export const LeftToRight: Story = {
	render: () => (
		<DirectionProvider direction="ltr">
			<div
				dir="ltr"
				className="flex w-80 flex-col gap-3 rounded-md border border-border bg-card p-4 text-sm text-card-foreground"
			>
				<div className="flex items-center justify-between gap-2">
					<span className="font-medium">Invoice</span>
					<Badge variant="secondary">Paid</Badge>
				</div>
				<p className="text-muted-foreground">
					The same markup lays out left to right inside the provider.
				</p>
				<div className="flex items-center gap-2">
					<Button size="sm">Save</Button>
					<Button size="sm" variant="outline">
						Cancel
					</Button>
				</div>
			</div>
		</DirectionProvider>
	),
}
