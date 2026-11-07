import { ToolPermissions } from "@horon-ai/react";

export default function ToolPermissionsAllowAll() {
  return (
    <div className="flex w-full justify-center">
      <ToolPermissions
        title="Chat tools"
        allowAllLabel="Always allow these"
        tools={[
          { name: "send_message", description: "Post a message to a channel" },
          { name: "list_channels", description: "List the channels the bot can see" },
          { name: "read_thread", description: "Read a thread and its replies" },
        ]}
      />
    </div>
  );
}
