import { IconButton } from "@horon-ai/react";
import { Copy } from "@phosphor-icons/react";

/** Static facsimile of the tooltip shown above its trigger, arrow included. */
export default function TooltipThumbnail() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="rounded-sm bg-interactive-primary px-2.5 py-1.5 text-label-sm whitespace-nowrap text-interactive-on-primary">
        Copy link
      </span>
      <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className="fill-interactive-primary">
        <path d="M0.67 1.5h8.66L5 6z" />
      </svg>
      <IconButton variant="solid" icon={<Copy />} label="Copy link" />
    </div>
  );
}
