import { Button, Toaster, useToast } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

function GlassTrigger() {
  const toast = useToast();
  return (
    <Button
      variant="glass"
      onClick={() =>
        toast.add({ type: "success", title: "Saved", description: "The board deck is back in sync." })
      }
    >
      Save over imagery
    </Button>
  );
}

export default function ToastGlass() {
  return (
    <Backdrop>
      <Toaster surface="glass">
        <GlassTrigger />
      </Toaster>
    </Backdrop>
  );
}
