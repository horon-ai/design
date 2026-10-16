import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@horon/web/components/input-otp"

const meta = {
	title: "Web/InputOtp",
	component: InputOTP,
	parameters: { layout: "centered" },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<Partial<React.ComponentProps<typeof InputOTP>>>

function SixDigitCode() {
	const [value, setValue] = React.useState("")

	return (
		<InputOTP maxLength={6} value={value} onChange={setValue}>
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
	)
}

function FourDigitPin() {
	const [value, setValue] = React.useState("2026")

	return (
		<InputOTP
			maxLength={4}
			value={value}
			onChange={setValue}
			inputMode="numeric"
		>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
			</InputOTPGroup>
		</InputOTP>
	)
}

export const Playground: Story = {
	render: () => <SixDigitCode />,
}

export const FourDigits: Story = {
	render: () => <FourDigitPin />,
}

export const Disabled: Story = {
	render: () => (
		<InputOTP maxLength={6} value="1234" disabled>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	),
}
