import { Button, Toaster, useToast } from "@horon-ai/react";

function Trigger({ label }: { label: string }) {
  const toast = useToast();
  return (
    <Button variant="solid" onClick={() => toast.add({ title: "Saved", description: "The routine runs every morning at 8." })}>
      {label}
    </Button>
  );
}

export default function Toastsizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Toaster size="sm">
        <Trigger label="Small toast" />
      </Toaster>
      <Toaster size="md">
        <Trigger label="Default toast" />
      </Toaster>
      <Toaster size="lg">
        <Trigger label="Large toast" />
      </Toaster>
    </div>
  );
}
