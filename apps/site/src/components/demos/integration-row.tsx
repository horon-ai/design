import { IntegrationRow } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function IntegrationRowDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <IntegrationRow
            className="max-w-110"
            surface="solid"
            icon={<EnvelopeSimple />}
            name="Gmail"
            detail="alpoxdev@gmail.com · Read, draft"
            status="connected"
          />
          <IntegrationRow
            className="max-w-110"
            surface="solid"
            icon={<CalendarBlank />}
            name="Google Calendar"
            detail="Access expired 2 days ago"
            status="reconnect"
          />
          <IntegrationRow
            className="max-w-110"
            surface="solid"
            icon={<ChatCircle />}
            name="Slack"
            detail="Post updates to a channel"
            status="not-connected"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <IntegrationRow
            className="max-w-110"
            surface="glass"
            icon={<EnvelopeSimple />}
            name="Gmail"
            detail="alpoxdev@gmail.com · Read, draft"
            status="connected"
          />
          <IntegrationRow
            className="max-w-110"
            surface="glass"
            icon={<CalendarBlank />}
            name="Google Calendar"
            detail="Access expired 2 days ago"
            status="reconnect"
          />
          <IntegrationRow
            className="max-w-110"
            surface="glass"
            icon={<ChatCircle />}
            name="Slack"
            detail="Post updates to a channel"
            status="not-connected"
          />
        </Backdrop>
      </div>
    </div>
  );
}
