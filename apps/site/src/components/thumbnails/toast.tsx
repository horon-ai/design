import { CheckCircle, X } from "@phosphor-icons/react";

/** Static facsimile of a shown toast: `md` size, solid surface, success tone. */
export default function ToastThumbnail() {
  return (
    <div className="flex w-80 items-start gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3.5 shadow-popover">
      <CheckCircle aria-hidden className="size-5 shrink-0 text-text-brand" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-label-lg text-text-primary">Routine saved</p>
        <p className="text-body-sm text-text-secondary">It runs every morning at 8.</p>
      </div>
      <X aria-hidden className="size-4 shrink-0 text-text-secondary" />
    </div>
  );
}
