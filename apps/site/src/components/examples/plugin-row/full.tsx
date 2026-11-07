import { MenuItem, PluginRow } from "@horon-ai/react";
import { Code, GitBranch, Globe } from "@phosphor-icons/react";

export default function PluginRowFull() {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <PluginRow
        initials="GH"
        name="GitHub tools"
        version="v1.4.0"
        updateBadge="Update available"
        author="by Horon Labs"
        verified
        chips={[
          { id: "repos", label: "Repos", icon: <GitBranch aria-hidden /> },
          { id: "code", label: "Code", icon: <Code aria-hidden /> },
          { id: "web", label: "Web", icon: <Globe aria-hidden /> },
        ]}
        enabled
        onEnabledChange={() => undefined}
        onUpdate={() => undefined}
        toggleLabel="GitHub tools"
        menu={
          <>
            <MenuItem>Details</MenuItem>
            <MenuItem danger>Uninstall</MenuItem>
          </>
        }
      />
    </div>
  );
}
