import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@horon-ai/react/components/sheet";
import { Button } from "@horon-ai/react/components/button";
import { Input } from "@horon-ai/react/components/input";
import { Label } from "@horon-ai/react/components/label";

const meta = {
  title: "Web/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function Body() {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes to your profile here. Click save when you are done.</SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-1.5 px-4">
        <Label htmlFor="sheet-name">Name</Label>
        <Input id="sheet-name" defaultValue="MinYeol" />
      </div>
      <SheetFooter>
        <Button>Save changes</Button>
      </SheetFooter>
    </>
  );
}

export const Interactive: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent>
        <Body />
      </SheetContent>
    </Sheet>
  ),
};

export const Open: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent>
        <Body />
      </SheetContent>
    </Sheet>
  ),
};
