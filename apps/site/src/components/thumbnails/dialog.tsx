import { Button } from "@horon-ai/react";
import { X } from "@phosphor-icons/react";

/** Static facsimile of the open dialog: the popup portals, so the panel is drawn inline. */
export default function DialogThumbnail() {
  return (
    <div className="flex w-80 flex-col items-start gap-4 rounded-xl bg-bg-surface p-6 shadow-palette">
      <div className="flex w-full items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-title-md text-text-primary">Delete bot?</p>
          <p className="text-body-md text-text-secondary">Routines and memory are removed.</p>
        </div>
        <span
          aria-hidden
          className="-mt-1 -mr-2 flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary"
        >
          <X className="size-4" />
        </span>
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <Button variant="solid" size="sm">
          Cancel
        </Button>
        <Button variant="danger" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
}
