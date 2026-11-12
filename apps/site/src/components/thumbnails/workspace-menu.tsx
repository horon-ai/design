import { Check, PlusCircle } from "@phosphor-icons/react";

const workspaces = [
  { name: "Horon HQ", meta: "12 members", initial: "H", current: true },
  { name: "Horon Labs", meta: "4 members", initial: "L", current: false },
];

/** Static facsimile of the open workspace switcher: tiles, the current check and the create row. */
export default function WorkspaceMenuThumbnail() {
  return (
    <div className="flex w-64 flex-col gap-0.5 overflow-clip rounded-xl bg-glass-fill-solid p-1.5 shadow-popover">
      <span className="px-2.5 pt-2 pb-1 text-caption text-text-secondary">Workspaces</span>
      {workspaces.map((workspace) => (
        <div
          key={workspace.name}
          className={`flex h-12 w-full items-center gap-2.5 rounded-md px-2.5 ${workspace.current ? "bg-bg-brand" : ""}`}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-interactive-primary text-label-sm text-text-inverse">
            {workspace.initial}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-label-md text-text-primary">{workspace.name}</span>
            <span className="truncate text-caption text-text-secondary">{workspace.meta}</span>
          </span>
          <span className={`flex shrink-0 [&>svg]:size-4 ${workspace.current ? "" : "opacity-0"}`}>
            <Check weight="bold" className="text-text-primary" />
          </span>
        </div>
      ))}
      <div className="flex px-2.5 py-1">
        <span className="h-px flex-1 bg-overlay-ink-8" />
      </div>
      <div className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5">
        <span className="flex shrink-0 text-text-primary [&>svg]:size-4.5">
          <PlusCircle />
        </span>
        <span className="min-w-0 flex-1 truncate text-label-md text-text-primary">New workspace</span>
      </div>
    </div>
  );
}
