import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@horon/web/components/stepper"

const meta = {
	title: "Web/Stepper",
	component: Stepper,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<Stepper defaultValue="profile" className="w-96">
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
				<StepperSeparator />
			</StepperItem>
			<StepperItem step="review">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Review</StepperTitle>
				</StepperTrigger>
			</StepperItem>
		</Stepper>
	),
}

export const Vertical: Story = {
	render: () => (
		<Stepper defaultValue="shipping" orientation="vertical" className="w-64">
			<StepperItem step="cart">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Cart</StepperTitle>
				</StepperTrigger>
				<StepperSeparator />
			</StepperItem>
			<StepperItem step="shipping">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Shipping</StepperTitle>
				</StepperTrigger>
				<StepperSeparator />
			</StepperItem>
			<StepperItem step="payment">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Payment</StepperTitle>
				</StepperTrigger>
			</StepperItem>
		</Stepper>
	),
}

export const Completed: Story = {
	render: () => (
		<Stepper defaultValue="done" className="w-96">
			<StepperItem step="start">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Started</StepperTitle>
				</StepperTrigger>
				<StepperSeparator />
			</StepperItem>
			<StepperItem step="build">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Built</StepperTitle>
				</StepperTrigger>
				<StepperSeparator />
			</StepperItem>
			<StepperItem step="done">
				<StepperTrigger>
					<StepperIndicator />
					<StepperTitle>Shipped</StepperTitle>
				</StepperTrigger>
			</StepperItem>
		</Stepper>
	),
}
