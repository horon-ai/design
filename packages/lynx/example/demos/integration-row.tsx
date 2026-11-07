import { useState } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { IntegrationRow, type IntegrationStatus } from "../../src/components/integration-row";
import { Backdrop } from "./backdrop";

/** Connect flips the row to connected in place: the tile, the pill and the button swap. */
function ConnectableSlack({ surface = "solid" }: { surface?: "solid" | "glass" }) {
  const [status, setStatus] = useState<IntegrationStatus>("not-connected");
  return (
    <IntegrationRow
      className="w-full max-w-[440px]"
      surface={surface}
      icon={<Icon name="ChatCircle" />}
      name="Slack"
      detail={status === "connected" ? "Workspace chat · Read, post" : "Post updates to a channel"}
      status={status}
      onAction={() => setStatus("connected")}
    />
  );
}

/** The three states on one surface: connected, reconnect and the interactive connect row. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
      <IntegrationRow
        className="w-full max-w-[440px]"
        surface={surface}
        icon={<Icon name="EnvelopeSimple" />}
        name="Gmail"
        detail="alpoxdev@gmail.com · Read, draft"
        status="connected"
      />
      <IntegrationRow
        className="w-full max-w-[440px]"
        surface={surface}
        icon={<Icon name="CalendarBlank" />}
        name="Google Calendar"
        detail="Access expired 2 days ago"
        status="reconnect"
      />
      <ConnectableSlack surface={surface} />
    </view>
  );
}

/** Solid and glass surfaces side by side, mirroring the site demo. */
export default function IntegrationRowDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <Examples surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
