import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Typography,
	TypographyHeading,
	TypographyInlineCode,
	TypographyLead,
	TypographyList,
	TypographyMuted,
} from "@horon/web/components/typography"

const meta = {
	title: "Web/Typography",
	component: Typography,
	parameters: { layout: "padded" },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<Typography className="max-w-prose">
			<TypographyHeading level={1}>Horon design system</TypographyHeading>
			<TypographyLead>
				A single source of truth for color, type, and motion across web and
				native.
			</TypographyLead>
			<TypographyHeading level={2}>Getting started</TypographyHeading>
			<p>
				Install the tokens package, then import the theme in your global
				stylesheet. Every component reads from the same semantic variables.
			</p>
			<TypographyList>
				<li>
					Add <TypographyInlineCode>@horon/tokens</TypographyInlineCode> to your
					workspace.
				</li>
				<li>Import the theme CSS once at the app root.</li>
				<li>Compose components with token utilities only.</li>
			</TypographyList>
			<TypographyMuted>Last updated October 2026.</TypographyMuted>
		</Typography>
	),
}

export const Scale: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<TypographyHeading level={1}>Display heading</TypographyHeading>
			<TypographyHeading level={2}>Heading</TypographyHeading>
			<TypographyHeading level={3}>Subtitle</TypographyHeading>
			<TypographyHeading level={4}>Lead heading</TypographyHeading>
		</div>
	),
}

export const Lists: Story = {
	render: () => (
		<Typography className="max-w-prose">
			<TypographyList>
				<li>Unordered item one</li>
				<li>Unordered item two</li>
			</TypographyList>
			<TypographyList ordered>
				<li>Ordered item one</li>
				<li>Ordered item two</li>
			</TypographyList>
		</Typography>
	),
}
