import {
  Button,
  IconButton,
  ListDetail,
  ListDetailFiles,
  ListDetailFooter,
  ListDetailHeader,
  ListDetailInstructions,
  ListDetailMeta,
  Switch,
} from "@horon-ai/react";
import { DotsThree, FileText, Sparkle, Trash } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

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

function Detail({ surface }: { surface: "solid" | "glass" }) {
  const buttonVariant = surface === "glass" ? "glass" : "solid";
  return (
    <ListDetail surface={surface} defaultValue="weekly" groups={groups}>
      {(item) => (
        <>
          <ListDetailHeader
            icon={<Sparkle weight="fill" />}
            title={item.title}
            description="Runs on a schedule and reports back in chat."
            actions={
              <>
                <span className="text-[13px]/[18px] font-medium text-text-secondary">Enabled</span>
                <Switch aria-label="Enabled" defaultChecked />
                <IconButton size="sm" variant="ghost" label="More" icon={<DotsThree weight="bold" />} />
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
            <Button variant={buttonVariant} size="sm" icon={<FileText />}>
              template.md
            </Button>
            <Button variant={buttonVariant} size="sm" icon={<FileText />}>
              projects.json
            </Button>
          </ListDetailFiles>
          <ListDetailFooter>
            <Button variant={buttonVariant} size="sm">
              Duplicate
            </Button>
            <Button variant={buttonVariant} size="sm">
              Export
            </Button>
            <span className="flex-1" />
            <Button variant={buttonVariant} size="sm" icon={<Trash className="text-interactive-danger" />}>
              Delete
            </Button>
          </ListDetailFooter>
        </>
      )}
    </ListDetail>
  );
}

export default function ListDetailDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex w-full justify-center">
          <Detail surface="solid" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop>
          <Detail surface="glass" />
        </Backdrop>
      </div>
    </div>
  );
}
