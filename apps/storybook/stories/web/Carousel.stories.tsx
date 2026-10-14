import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@horon/web/components/carousel"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@horon/web/components/card"

const meta = {
	title: "Web/Carousel",
	component: Carousel,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

const slides = [
	{
		title: "Field survey",
		description: "Measured drawings taken on site.",
		body: "Every repair starts with a survey that records how the structure was raised, used, and changed.",
	},
	{
		title: "Local material",
		description: "Stone, timber, and earth from the region.",
		body: "Materials are gathered close to the site, so the form follows the climate, craft, and habit of the place.",
	},
	{
		title: "Repair over replacement",
		description: "Keeping what still carries load.",
		body: "The work favors mending the existing frame instead of tearing it down for a new one.",
	},
	{
		title: "Shared record",
		description: "Drawings anyone can read.",
		body: "Each survey is the first record of a building that no one had documented before.",
	},
]

export const Playground: Story = {
	render: () => (
		<Carousel className="w-80">
			<CarouselContent>
				{slides.map((slide) => (
					<CarouselItem key={slide.title}>
						<Card>
							<CardHeader>
								<CardTitle>{slide.title}</CardTitle>
								<CardDescription>{slide.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-[13px] leading-relaxed text-muted-foreground">
									{slide.body}
								</p>
							</CardContent>
						</Card>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
}

export const Vertical: Story = {
	render: () => (
		<Carousel orientation="vertical" className="h-72 w-80">
			<CarouselContent className="h-full">
				{slides.map((slide) => (
					<CarouselItem key={slide.title}>
						<Card className="h-full">
							<CardHeader>
								<CardTitle>{slide.title}</CardTitle>
								<CardDescription>{slide.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-[13px] leading-relaxed text-muted-foreground">
									{slide.body}
								</p>
							</CardContent>
						</Card>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	),
}
