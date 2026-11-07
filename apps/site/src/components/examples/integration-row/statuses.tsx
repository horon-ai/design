import { IntegrationRow } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";

export default function IntegrationRowStatuses() {
  return (
    <div className="flex w-full flex-col gap-3">
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
      <IntegrationRow
        icon={<ChatCircle />}
        name="Slack"
        detail="Post updates to a channel"
        status="not-connected"
      />
    </div>
  );
}
