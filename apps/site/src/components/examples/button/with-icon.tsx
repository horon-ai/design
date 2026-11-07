import { Button } from "@horon-ai/react";
import { Plus, UploadSimple } from "@phosphor-icons/react";

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="sm" icon={<Plus />}>
        New bot
      </Button>
      <Button icon={<Plus />}>New bot</Button>
      <Button size="lg" icon={<UploadSimple />}>
        Upload files
      </Button>
      <Button variant="solid" icon={<Plus />}>
        Add source
      </Button>
    </div>
  );
}
