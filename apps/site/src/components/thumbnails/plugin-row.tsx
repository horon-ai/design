import { MenuItem, PluginRow } from "@horon-ai/react";
import { Code, GitBranch } from "@phosphor-icons/react";

export default function PluginRowThumbnail() {
  return (
    <div className="w-[330px] rounded-xl border border-border-default bg-bg-surface px-4">
      <PluginRow
        initials="GH"
        name="GitHub tools"
        version="v1.4.0"
        author="by Horon Labs"
        verified
        chips={[
          { id: "repos", label: "Repos", icon: <GitBranch aria-hidden /> },
          { id: "code", label: "Code", icon: <Code aria-hidden /> },
        ]}
        enabled
        onUpdate={() => undefined}
        menu={<MenuItem>Details</MenuItem>}
      />
    </div>
  );
}
