import { Button } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function ButtonVariants() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>Primary</Button>
        <Button variant="solid">Solid</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </div>
      <Backdrop>
        <Button variant="glass">Glass</Button>
      </Backdrop>
    </div>
  );
}
