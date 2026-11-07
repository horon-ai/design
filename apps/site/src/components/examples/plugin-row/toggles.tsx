import { PluginRow } from "@horon-ai/react";
import { useState } from "react";

export default function PluginRowToggles() {
  const [github, setGithub] = useState(true);
  const [console, setConsole] = useState(false);
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <PluginRow
        initials="GH"
        name="GitHub tools"
        version="v1.4.0"
        author="by Horon Labs"
        verified
        enabled={github}
        onEnabledChange={setGithub}
        toggleLabel="GitHub tools"
      />
      <PluginRow
        initials="DB"
        name="Database console"
        version="v0.9.2"
        author="by Community"
        enabled={console}
        onEnabledChange={setConsole}
        toggleLabel="Database console"
      />
    </div>
  );
}
