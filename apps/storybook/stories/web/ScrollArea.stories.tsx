import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@horon-ai/react/components/scroll-area";

const meta = {
  title: "Web/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const notes = [
  "Vernacular building is raised outside any academic tradition and without professional guidance.",
  "It is not a single movement or style, but a wide category of building types and methods of construction.",
  "The study looks at the design skill and tradition of local builders rather than formally trained architects.",
  "Materials come from the region, and the form follows local climate, craft, and habit.",
  "Designers returned to this work while looking for more energy-conscious ways to build.",
  "That interest sits inside a wider turn toward sustainable design and repair over replacement.",
  "Field surveys record how a structure was raised, used, and changed across its lifetime.",
  "The drawings are often the first record of a building that no one had documented before.",
];

export const Playground: Story = {
  render: () => (
    <ScrollArea className="h-64 w-80 rounded-md border border-border">
      <ScrollAreaViewport>
        <div className="flex flex-col gap-3 p-4 text-[13px] leading-relaxed text-muted-foreground">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  ),
};

export const BothAxes: Story = {
  render: () => (
    <ScrollArea className="h-56 w-72 rounded-md border border-border">
      <ScrollAreaViewport>
        <div className="w-[40rem] p-4 text-[13px] leading-relaxed text-muted-foreground">
          <p>
            A wide table of survey records scrolls on both axes so the corner keeps the two scrollbars from crossing.
          </p>
          <p className="mt-3">
            Drag either scrollbar, or scroll with a trackpad and a modifier key for the horizontal axis.
          </p>
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  ),
};
