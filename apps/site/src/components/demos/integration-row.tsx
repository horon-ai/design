import { IntegrationRow } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function IntegrationRowDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
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
      <div className="flex w-full max-w-110 flex-col gap-4 rounded-2xl bg-bg-default p-4">
        <IntegrationRow
          icon={<EnvelopeSimple />}
          name="Gmail"
          detail="alpoxdev@gmail.com · Read, draft"
          status="connected"
        />
        <IntegrationRow
          icon={<CalendarBlank />}
          name="Google Calendar"
          detail="Access expired 2 days ago"
          status="reconnect"
        />
      </div>
    </div>
  );
}
