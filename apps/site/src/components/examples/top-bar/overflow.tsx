import { TopBar } from "@horon-ai/react";

export default function TopBarOverflow() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <TopBar
        className="w-full max-w-97.5"
        title="Quarterly planning with the whole hiring team"
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <TopBar className="w-full max-w-97.5" title="Chief of staff" subtitle="Read-only transcript" />
    </div>
  );
}
