import { IntegrationRow, type IntegrationStatus } from "@horon-ai/react";
import { ChatCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function IntegrationRowConnect() {
  const [status, setStatus] = useState<IntegrationStatus>("not-connected");
  return (
    <div className="flex w-full flex-col gap-3">
      <IntegrationRow
        icon={<ChatCircle />}
        name="Slack"
        detail={status === "connected" ? "Workspace chat · Read, post" : "Post updates to a channel"}
        status={status}
        onAction={() => setStatus("connected")}
      />
      <IntegrationRow
        icon={<ChatCircle />}
        name="Slack"
        detail="Workspace chat · Read, post"
        status="connected"
      />
    </div>
  );
}
