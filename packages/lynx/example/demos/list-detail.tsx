import { Icon } from "../../src/icons";
import { Button } from "../../src/components/button";
import { IconButton } from "../../src/components/icon-button";
import {
  ListDetail,
  ListDetailFiles,
  ListDetailFooter,
  ListDetailHeader,
  ListDetailInstructions,
  ListDetailMeta,
} from "../../src/components/list-detail";
import { Switch } from "../../src/components/switch";
import { Backdrop } from "./backdrop";

const instructions = `---
name: weekly-investor-update
description: Draft the Friday investor email
---

1. Pull MRR, burn and runway from Stripe.
2. Summarize shipped work from Linear.
3. Keep it under 200 words, plain tone.
4. Ask for my yes before sending.`;

const groups = [
  {
    id: "active",
    label: "ACTIVE",
    items: [
      { id: "weekly", title: "Weekly report", meta: "Every Friday" },
      { id: "triage", title: "Issue triage", meta: "On new issue" },
    ],
  },
  { id: "paused", label: "PAUSED", items: [{ id: "digest", title: "Inbox digest", meta: "Paused" }] },
];

/** One shell per surface: the list on the left, the selected routine's detail on the right. */
function Detail({ surface }: { surface: "solid" | "glass" }) {
  return (
    <ListDetail surface={surface} defaultValue="weekly" groups={groups} className="w-full max-w-[720px]">
      {(item) => (
        <>
          <ListDetailHeader
            icon={<Icon name="Sparkle" weight="fill" />}
            title={item.title}
            description="Runs on a schedule and reports back in chat."
            actions={
              <>
                <text className="text-label-md text-text-secondary">Enabled</text>
                <Switch aria-label="Enabled" defaultChecked />
                <IconButton size="sm" variant="ghost" label="More" icon={<Icon name="DotsThree" weight="bold" />} />
              </>
            }
          />
          <ListDetailMeta
            items={[
              { id: "trigger", label: "Trigger", value: "Schedule" },
              { id: "last", label: "Last run", value: "2 days ago" },
              { id: "runs", label: "Runs", value: "48" },
              { id: "owner", label: "Owner", value: "You" },
            ]}
          />
          <ListDetailInstructions tag="SKILL.md" defaultValue={instructions} />
          <ListDetailFiles>
            <Button variant="solid" size="sm" icon={<Icon name="FileText" />}>
              template.md
            </Button>
            <Button variant="solid" size="sm" icon={<Icon name="FileText" />}>
              projects.json
            </Button>
          </ListDetailFiles>
          <ListDetailFooter>
            <Button variant="solid" size="sm">
              Duplicate
            </Button>
            <Button variant="solid" size="sm">
              Export
            </Button>
            <view className="flex-1" />
            <Button variant="solid" size="sm" icon={<Icon name="Trash" color="text-danger" />}>
              Delete
            </Button>
          </ListDetailFooter>
        </>
      )}
    </ListDetail>
  );
}

/** Solid and glass shells; pick a row to swap the detail pane. */
export default function ListDetailDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Detail surface="solid" />
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop>
          <Detail surface="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
