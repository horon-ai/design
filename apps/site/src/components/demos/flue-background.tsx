import { FlueBackground } from "@horon-ai/react";

export default function FlueBackgroundDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative isolate h-80 w-70 overflow-clip rounded-xl border border-border-default">
        <FlueBackground />
        <span className="relative block p-4 text-label-md text-text-primary">Sidebar · regular glass</span>
      </div>
      <div className="relative isolate h-80 min-w-80 flex-1 overflow-clip rounded-xl border border-border-default">
        <FlueBackground tintClassName="bg-transparent" />
        <span className="relative block p-4 text-label-md text-text-primary">No tint</span>
      </div>
    </div>
  );
}
