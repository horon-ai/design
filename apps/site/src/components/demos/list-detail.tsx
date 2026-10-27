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
import { DotsThree, FileText, Sparkle } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

const instructions = `---
name: weekly-investor-update
description: Draft the Friday investor email
---

1. Pull MRR, burn and runway from Stripe.
2. Summarize shipped work from Linear.
3. Keep it under 200 words, plain tone.
4. Ask for my yes before sending.`;

export default function ListDetailDemo() {
  return (
    <Backdrop>
      <ListDetail
        defaultValue="weekly"
        groups={[
          {
            id: "active",
            label: "ACTIVE",
            items: [
              { id: "weekly", title: "Weekly report", meta: "Every Friday" },
              { id: "triage", title: "Issue triage", meta: "On new issue" },
            ],
          },
          { id: "paused", label: "PAUSED", items: [{ id: "digest", title: "Inbox digest", meta: "Paused" }] },
        ]}
      >
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
              <Button variant="glass" size="sm" icon={<FileText />}>
                template.md
              </Button>
              <Button variant="glass" size="sm" icon={<FileText />}>
                projects.json
              </Button>
            </ListDetailFiles>
            <ListDetailFooter>
              <Button variant="glass" size="sm">
                Duplicate
              </Button>
              <Button variant="glass" size="sm">
                Export
              </Button>
              <span className="flex-1" />
              <Button variant="glass" size="sm">
                Delete
              </Button>
            </ListDetailFooter>
          </>
        )}
      </ListDetail>
    </Backdrop>
  );
}
