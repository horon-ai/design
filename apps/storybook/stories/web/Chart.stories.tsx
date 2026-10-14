import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	RechartsPrimitive,
	type ChartConfig,
} from "@horon/web/components/chart"

const visits = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 173, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 264, mobile: 140 },
]

const revenue = [
	{ month: "Jan", revenue: 4200 },
	{ month: "Feb", revenue: 5100 },
	{ month: "Mar", revenue: 4700 },
	{ month: "Apr", revenue: 6300 },
	{ month: "May", revenue: 5900 },
	{ month: "Jun", revenue: 7400 },
]

const browsers = [
	{ name: "chrome", visitors: 275, fill: "var(--color-chrome)" },
	{ name: "safari", visitors: 200, fill: "var(--color-safari)" },
	{ name: "firefox", visitors: 187, fill: "var(--color-firefox)" },
	{ name: "edge", visitors: 173, fill: "var(--color-edge)" },
]

const visitsConfig = {
	desktop: { label: "Desktop", color: "var(--chart-1)" },
	mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

const revenueConfig = {
	revenue: { label: "Revenue", color: "var(--chart-3)" },
} satisfies ChartConfig

const browserConfig = {
	chrome: { label: "Chrome", color: "var(--chart-1)" },
	safari: { label: "Safari", color: "var(--chart-2)" },
	firefox: { label: "Firefox", color: "var(--chart-3)" },
	edge: { label: "Edge", color: "var(--chart-4)" },
} satisfies ChartConfig

const meta = {
	title: "Web/Chart",
	component: ChartContainer,
	parameters: { layout: "centered" },
	args: { config: visitsConfig, children: null },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<ChartContainer config={visitsConfig} className="h-[280px] w-[560px]">
			<RechartsPrimitive.BarChart accessibilityLayer data={visits}>
				<RechartsPrimitive.CartesianGrid vertical={false} />
				<RechartsPrimitive.XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value: string) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<RechartsPrimitive.Bar
					dataKey="desktop"
					fill="var(--color-desktop)"
					radius={4}
				/>
				<RechartsPrimitive.Bar
					dataKey="mobile"
					fill="var(--color-mobile)"
					radius={4}
				/>
			</RechartsPrimitive.BarChart>
		</ChartContainer>
	),
}

export const Area: Story = {
	render: () => (
		<ChartContainer config={revenueConfig} className="h-[280px] w-[560px]">
			<RechartsPrimitive.AreaChart
				accessibilityLayer
				data={revenue}
				margin={{ left: 12, right: 12 }}
			>
				<RechartsPrimitive.CartesianGrid vertical={false} />
				<RechartsPrimitive.XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
				/>
				<ChartTooltip content={<ChartTooltipContent indicator="line" />} />
				<RechartsPrimitive.Area
					dataKey="revenue"
					type="natural"
					stroke="var(--color-revenue)"
					strokeWidth={2}
					fill="var(--color-revenue)"
					fillOpacity={0.25}
				/>
			</RechartsPrimitive.AreaChart>
		</ChartContainer>
	),
}

export const Donut: Story = {
	render: () => (
		<ChartContainer config={browserConfig} className="h-[280px] w-[280px]">
			<RechartsPrimitive.PieChart>
				<ChartTooltip
					content={<ChartTooltipContent nameKey="visitors" hideLabel />}
				/>
				<RechartsPrimitive.Pie
					data={browsers}
					dataKey="visitors"
					nameKey="name"
					innerRadius={64}
					strokeWidth={4}
				>
					{browsers.map((browser) => (
						<RechartsPrimitive.Cell key={browser.name} fill={browser.fill} />
					))}
				</RechartsPrimitive.Pie>
				<ChartLegend content={<ChartLegendContent nameKey="name" />} />
			</RechartsPrimitive.PieChart>
		</ChartContainer>
	),
}
