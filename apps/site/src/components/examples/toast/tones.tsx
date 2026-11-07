import { Button, Toaster, useToast } from "@horon-ai/react";

function Tones() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="solid"
        onClick={() => toast.add({ title: "Draft saved", description: "Not sent yet. Review it when you are ready." })}
      >
        Neutral
      </Button>
      <Button
        variant="solid"
        onClick={() =>
          toast.add({ type: "success", title: "Sent to the team", description: "Q3 board deck v5 is in #board." })
        }
      >
        Success
      </Button>
      <Button
        variant="solid"
        onClick={() =>
          toast.add({ type: "danger", title: "Couldn't reach Gmail", description: "Reconnect to keep Inbox Manager running." })
        }
      >
        Danger
      </Button>
    </div>
  );
}

export default function ToastTones() {
  return (
    <Toaster size="md">
      <Tones />
    </Toaster>
  );
}
