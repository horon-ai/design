import { Button, Toaster, useToast } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const copy = { title: "Saved", description: "The routine runs every morning at 8." };

type Surface = "solid" | "glass";

function SizeButton({ surface, label }: { surface: Surface; label: string }) {
  const toast = useToast();
  return (
    <Button variant={surface === "glass" ? "glass" : "solid"} onClick={() => toast.add(copy)}>
      {label}
    </Button>
  );
}

function SizeTrigger({ surface, size, label }: { surface: Surface; size: "sm" | "md" | "lg"; label: string }) {
  return (
    <Toaster size={size} surface={surface}>
      <SizeButton surface={surface} label={label} />
    </Toaster>
  );
}

function TypeButtons({ surface }: { surface: Surface }) {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={surface === "glass" ? "glass" : "solid"}
        onClick={() => toast.add({ title: "Saved", description: "The routine runs every morning at 8." })}
      >
        Neutral
      </Button>
      <Button
        variant={surface === "glass" ? "glass" : "solid"}
        onClick={() =>
          toast.add({ type: "success", title: "Sent to the team", description: "Q3 board deck v5 is in #board." })
        }
      >
        Success
      </Button>
      <Button
        variant={surface === "glass" ? "glass" : "solid"}
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

function Types({ surface }: { surface: Surface }) {
  return (
    <Toaster surface={surface}>
      <TypeButtons surface={surface} />
    </Toaster>
  );
}

function Examples({ surface }: { surface: Surface }) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <SizeTrigger surface={surface} size="sm" label="Small toast" />
        <SizeTrigger surface={surface} size="md" label="Default toast" />
        <SizeTrigger surface={surface} size="lg" label="Large toast" />
      </div>
      <Types surface={surface} />
    </div>
  );
}

export default function ToastDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <Examples surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
