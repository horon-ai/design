import { TopBar } from "@horon-ai/react";

export default function TopBarStatus() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <TopBar className="w-full max-w-97.5" title="Chief of staff" subtitle="Online" live onBack={() => undefined} />
      <TopBar
        className="w-full max-w-97.5"
        title="Chief of staff"
        subtitle="Last active 2h ago"
        onBack={() => undefined}
      />
    </div>
  );
}
