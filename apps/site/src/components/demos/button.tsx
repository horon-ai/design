import { Button } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function ButtonDemo() {
  return (
    <Backdrop>
      <Button>Approve</Button>
      <Button icon={<Plus />}>New bot</Button>
      <Button variant="danger">Delete bot</Button>
      <Button variant="glass">Cancel</Button>
      <Button variant="link">Show all</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </Backdrop>
  );
}
