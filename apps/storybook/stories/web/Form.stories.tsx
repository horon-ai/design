import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@horon-ai/react/components/form";
import { Input } from "@horon-ai/react/components/input";
import { Button } from "@horon-ai/react/components/button";

// FormProvider's props are all required, so Storybook would ask every story for
// args even though each story supplies its own form instance through render: the
// stories are typed against the Partial props instead.
const meta = {
  title: "Web/Form",
  component: Form,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<Partial<React.ComponentProps<typeof Form>>>;

type ProfileValues = {
  username: string;
  email: string;
};

function ProfileForm() {
  const form = useForm<ProfileValues>({
    defaultValues: { username: "", email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="flex w-80 flex-col gap-6">
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
              <FormDescription>This is your public display name.</FormDescription>
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
  );
}

export const Playground: Story = {
  render: () => <ProfileForm />,
};

function InvalidForm() {
  const form = useForm<ProfileValues>({
    defaultValues: { username: "minyeol", email: "not-an-email" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="flex w-80 flex-col gap-6">
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
              <FormDescription>We only use this to reach you.</FormDescription>
              <FormMessage>Enter a valid email address.</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export const WithError: Story = {
  render: () => <InvalidForm />,
};
