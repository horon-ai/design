import { Button, Toaster, useToast } from "@horon-ai/react";

const copy = { title: "Saved", description: "The routine runs every morning at 8." };

function Triggers() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="glass"
        onClick={() => toast.add({ title: "Saved", description: "The routine runs every morning at 8." })}
      >
        Neutral
      </Button>
      <Button
        variant="glass"
        onClick={() =>
          toast.add({ type: "success", title: "Sent to the team", description: "Q3 board deck v5 is in #board." })
        }
      >
        Success
      </Button>
      <Button
        variant="glass"
        onClick={() =>
          toast.add({
            type: "danger",
            title: "Couldn't reach Gmail",
            description: "Reconnect to keep Inbox Manager running.",
          })
        }
      >
        Danger
      </Button>
    </div>
  );
}

function SizeTrigger({ label }: { label: string }) {
  const toast = useToast();
  return (
    <Button variant="glass" onClick={() => toast.add(copy)}>
      {label}
    </Button>
  );
}

export default function ToastDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Toaster size="sm" surface="glass">
          <SizeTrigger label="Small glass toast" />
        </Toaster>
        <Toaster size="md" surface="glass">
          <SizeTrigger label="Default glass toast" />
        </Toaster>
        <Toaster size="lg" surface="glass">
          <SizeTrigger label="Large glass toast" />
        </Toaster>
      </div>
      <Toaster>
        <Triggers />
      </Toaster>
    </div>
  );
}
