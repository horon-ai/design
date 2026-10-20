import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@horon-ai/react/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@horon-ai/react/components/card";

const meta = {
  title: "Web/Card",
  component: Card,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Everything your team needs.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Unlimited projects, shared tokens, and audit history.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Upgrade</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-64">
      <CardHeader>
        <CardTitle>Compact</CardTitle>
        <CardDescription>Small card variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Tighter padding.</p>
      </CardContent>
    </Card>
  ),
};
