import { Button, Field, FieldLabel, Input } from "@horon-ai/react";
import { X } from "@phosphor-icons/react";

/** Static facsimile of the open modal: header, form body and the action footer of `ModalContent`. */
export default function ModalThumbnail() {
  return (
    <div className="flex w-80 flex-col overflow-clip rounded-xl bg-bg-surface shadow-palette">
      <header className="flex shrink-0 items-start gap-2 px-6 pt-4 pb-2">
        <p className="min-w-0 flex-1 text-title-md text-text-primary">Edit Inbox Manager</p>
        <span
          aria-hidden
          className="-mt-1 -mr-2 flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary"
        >
          <X className="size-4" />
        </span>
      </header>
      <div className="px-6 pb-3">
        <Field size="sm">
          <FieldLabel>Name</FieldLabel>
          <Input size="sm" surface="solid" className="w-full" defaultValue="Inbox Manager" />
        </Field>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2 px-6 pt-2 pb-4">
        <Button variant="solid" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}
