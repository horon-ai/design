import { IntegrationRow, type IntegrationStatus } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

/** Connect flips the row to connected in place: the tile, the pill and the button crossfade. */
function ConnectableSlack({ surface = "solid" }: { surface?: "solid" | "glass" }) {
  const [status, setStatus] = useState<IntegrationStatus>("not-connected");
  return (
    <IntegrationRow
      className="w-full max-w-110"
      surface={surface}
      icon={<ChatCircle />}
      name="Slack"
      detail={status === "connected" ? "Workspace chat · Read, post" : "Post updates to a channel"}
      status={status}
      onAction={() => setStatus("connected")}
    />
  );
}

export default function IntegrationRowDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <IntegrationRow
            className="w-full max-w-110"
            surface="solid"
            icon={<EnvelopeSimple />}
            name="Gmail"
            detail="alpoxdev@gmail.com · Read, draft"
            status="connected"
          />
          <IntegrationRow
            className="w-full max-w-110"
            surface="solid"
            icon={<CalendarBlank />}
            name="Google Calendar"
            detail="Access expired 2 days ago"
            status="reconnect"
          />
          <ConnectableSlack />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <IntegrationRow
            className="w-full max-w-110"
            surface="glass"
            icon={<EnvelopeSimple />}
            name="Gmail"
            detail="alpoxdev@gmail.com · Read, draft"
            status="connected"
          />
          <IntegrationRow
            className="w-full max-w-110"
            surface="glass"
            icon={<CalendarBlank />}
            name="Google Calendar"
            detail="Access expired 2 days ago"
            status="reconnect"
          />
          <ConnectableSlack surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
