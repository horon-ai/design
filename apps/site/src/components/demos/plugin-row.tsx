import { MenuItem, PluginRow } from "@horon-ai/react";
import { Code, GitBranch, Globe } from "@phosphor-icons/react";
import { useState } from "react";

export default function PluginRowDemo() {
  const [enabled, setEnabled] = useState(true);
  const [update, setUpdate] = useState(true);
  return (
    <div className="w-full max-w-190 rounded-2xl border border-border-default bg-bg-surface px-5">
      <PluginRow
        initials="GH"
        name="GitHub tools"
        version="v1.4.0"
        updateBadge={update ? "Update available" : undefined}
        author="by Horon Labs"
        verified
        chips={[
          { id: "repos", label: "Repos", icon: <GitBranch aria-hidden /> },
          { id: "code", label: "Code", icon: <Code aria-hidden /> },
          { id: "web", label: "Web", icon: <Globe aria-hidden /> },
        ]}
        enabled={enabled}
        onEnabledChange={setEnabled}
        onUpdate={update ? () => setUpdate(false) : undefined}
        menu={
          <>
            <MenuItem>Details</MenuItem>
            <MenuItem danger>Uninstall</MenuItem>
          </>
        }
      />
      <PluginRow
        initials="DB"
        name="Database console"
        version="v0.9.2"
        author="by Community"
        chips={[{ id: "sql", label: "SQL", icon: <Code aria-hidden /> }]}
        enabled={false}
      />
    </div>
  );
}
