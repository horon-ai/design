import { PluginRow } from "@horon-ai/react";

export default function PluginRowMinimal() {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <PluginRow initials="DB" name="Database console" version="v0.9.2" author="by Community" enabled />
      <PluginRow initials="NT" name="Notes" version="v1.0.0" enabled={false} toggleLabel="Notes" />
    </div>
  );
}
