import { useState } from "@lynx-js/react";

import { BotListRow } from "../../src/components/bot-list-row";

/** Three bots with one selected; tapping a row moves the selection, as the panel does. */
export default function BotListRowDemo() {
  const [selected, setSelected] = useState("sales");
  return (
    <view className="flex w-full max-w-[360px] flex-col gap-1 p-4">
      <BotListRow
        name="Sales Outbound"
        time="8:41 AM"
        preview="Outreach drafts queued for approval."
        live
        selected={selected === "sales"}
        onClick={() => setSelected("sales")}
      />
      <BotListRow
        name="Inbox Manager"
        time="7:02 AM"
        preview="6 emails need you."
        live
        selected={selected === "inbox"}
        onClick={() => setSelected("inbox")}
      />
      <BotListRow
        name="Recruiter"
        time="Yesterday"
        preview="Paused. Turn on to resume outreach."
        selected={selected === "recruiter"}
        onClick={() => setSelected("recruiter")}
      />
    </view>
  );
}
