import { IntegrationRow } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function IntegrationRowDemo() {
  return (
    <Backdrop className="flex-col">
      <IntegrationRow
        className="max-w-110"
        icon={<EnvelopeSimple />}
        name="Gmail"
        detail="alpoxdev@gmail.com · Read, draft"
        status="connected"
      />
      <IntegrationRow
        className="max-w-110"
        icon={<CalendarBlank />}
        name="Google Calendar"
        detail="Access expired 2 days ago"
        status="reconnect"
      />
      <IntegrationRow
        className="max-w-110"
        icon={<ChatCircle />}
        name="Slack"
        detail="Post updates to a channel"
        status="not-connected"
      />
    </Backdrop>
  );
}
