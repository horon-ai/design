import {
  Button,
  ListDetail,
  ListDetailFiles,
  ListDetailFooter,
  ListDetailHeader,
  ListDetailInstructions,
  ListDetailMeta,
  Switch,
} from "@horon-ai/react";
import { FileText, Sparkle, Trash } from "@phosphor-icons/react";

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

export default function ListDetailOverview() {
  return (
    <ListDetail defaultValue="weekly" groups={groups}>
      {(item) => (
        <>
          <ListDetailHeader
            icon={<Sparkle weight="fill" />}
            title={item.title}
            description="Runs on a schedule and reports back in chat."
            actions={
              <>
                <span className="text-label-md text-text-secondary">Enabled</span>
                <Switch aria-label="Enabled" defaultChecked />
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
            <Button variant="solid" size="sm" icon={<FileText />}>
              template.md
            </Button>
            <Button variant="solid" size="sm" icon={<FileText />}>
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
            <span className="flex-1" />
            <Button variant="solid" size="sm" icon={<Trash className="text-interactive-danger" />}>
              Delete
            </Button>
          </ListDetailFooter>
        </>
      )}
    </ListDetail>
  );
}
