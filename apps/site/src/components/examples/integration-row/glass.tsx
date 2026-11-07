import { IntegrationRow } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function IntegrationRowGlass() {
  return (
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
      <IntegrationRow
        className="w-full max-w-110"
        surface="glass"
        icon={<ChatCircle />}
        name="Slack"
        detail="Post updates to a channel"
        status="not-connected"
      />
    </Backdrop>
  );
}
