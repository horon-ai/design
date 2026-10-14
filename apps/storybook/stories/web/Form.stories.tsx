import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
} from "@horon/web/components/form"
import { Input } from "@horon/web/components/input"
import { Button } from "@horon/web/components/button"

// FormProvider's props are all required, so Storybook asks every story for args
// even though each story supplies its own form instance through render.
const meta = {
	title: "Web/Form",
	component: Form,
	parameters: { layout: "centered" },
	args: {} as React.ComponentProps<typeof Form>,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

type ProfileValues = {
	username: string
	email: string
}

function ProfileForm() {
	const form = useForm<ProfileValues>({
		defaultValues: { username: "", email: "" },
	})

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(() => undefined)}
				className="flex w-80 flex-col gap-6"
			>
				<FormField
					control={form.control}
					name="username"
					rules={{ required: "Username is required." }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="minyeol" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					rules={{ required: "Email is required." }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="you@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Save changes</Button>
			</form>
		</Form>
	)
}

export const Playground: Story = {
	render: () => <ProfileForm />,
}

function InvalidForm() {
	const form = useForm<ProfileValues>({
		defaultValues: { username: "minyeol", email: "not-an-email" },
	})

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(() => undefined)}
				className="flex w-80 flex-col gap-6"
			>
				<FormField
					control={form.control}
					name="email"
					rules={{ required: "Enter the address we should reply to." }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" aria-invalid {...field} />
							</FormControl>
							<FormDescription>
								We only use this to reach you.
							</FormDescription>
							<FormMessage>Enter a valid email address.</FormMessage>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export const WithError: Story = {
	render: () => <InvalidForm />,
}
