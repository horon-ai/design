import { TopBar } from "@horon-ai/react";

export default function TopBarThumbnail() {
  return (
    <TopBar
      className="w-80"
      title="Chief of staff"
      subtitle="Online"
      live
      onBack={() => undefined}
      onMore={() => undefined}
    />
  );
}
