import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@horon/web/components/accordion";

const meta = {
  title: "Web/Accordion",
  component: Accordion,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: "shipping",
    title: "How long does shipping take?",
    body: "Standard orders leave the warehouse within one business day. Delivery takes two to four days depending on the region.",
  },
  {
    value: "returns",
    title: "What is your return policy?",
    body: "You can return any unused item within 30 days of delivery for a full refund. The original packaging is required.",
  },
  {
    value: "support",
    title: "How do I reach support?",
    body: "Send a message from the help panel or reply to your order confirmation email. We answer within one business day.",
  },
];

export const Playground: Story = {
  render: () => (
    <Accordion className="w-96" defaultValue={["shipping"]}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionPanel>{item.body}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion className="w-96" multiple defaultValue={["shipping", "returns"]}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionPanel>{item.body}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
