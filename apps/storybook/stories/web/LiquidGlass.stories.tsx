import type { Meta, StoryObj } from "@storybook/react-vite"
import { LiquidGlass } from "@horon/web/components/liquid-glass"
import { Button } from "@horon/web/components/button"

const meta = {
	title: "Web/LiquidGlass",
	component: LiquidGlass,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LiquidGlass>

export default meta
type Story = StoryObj<typeof meta>

const Stage = ({ children }: { children: React.ReactNode }) => (
	<div className="min-h-[420px] bg-[linear-gradient(180deg,#dfe4f7_0%,#eef0f8_45%,#f6f3ec_100%)] p-10">
		{children}
	</div>
)

export const Default: Story = {
	render: () => (
		<Stage>
			<LiquidGlass className="w-fit px-6 py-4">
				<p className="text-sm">Liquid glass surface</p>
			</LiquidGlass>
		</Stage>
	),
}

export const Header: Story = {
	render: () => (
		<Stage>
			<LiquidGlass className="mx-auto flex h-[52px] w-full max-w-[880px] items-center gap-6 rounded-full px-3 pl-5">
				<span className="text-base font-bold tracking-tight">HORON</span>
				<nav className="flex items-center gap-5 text-sm">
					<span>Product</span>
					<span>Compare</span>
					<span>Pricing</span>
					<span>Blog</span>
					<span>Docs</span>
					<span>Open source</span>
				</nav>
				<div className="ml-auto flex items-center gap-2">
					<LiquidGlass className="flex h-[34px] items-center gap-1.5 rounded-full px-3 text-sm">
						<span aria-hidden>★</span>
						<span>180</span>
					</LiquidGlass>
					<Button className="h-[34px] rounded-full px-4">Download</Button>
				</div>
			</LiquidGlass>
		</Stage>
	),
}
