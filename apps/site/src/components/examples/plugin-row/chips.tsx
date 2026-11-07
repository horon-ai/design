import { PluginRow } from "@horon-ai/react";
import { ChartLineUp, Code, Globe } from "@phosphor-icons/react";

export default function PluginRowChips() {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <PluginRow
        initials="AN"
        name="Analytics reports"
        version="v2.1.0"
        author="by Horon"
        verified
        chips={[
          { id: "charts", label: "Charts", icon: <ChartLineUp aria-hidden /> },
          { id: "web", label: "Web", icon: <Globe aria-hidden /> },
          { id: "code", label: "Code", icon: <Code aria-hidden /> },
        ]}
        enabled
        onEnabledChange={() => undefined}
        toggleLabel="Analytics reports"
      />
    </div>
  );
}
