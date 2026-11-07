import { Badge, Button, Card } from "@horon-ai/react";

export default function CardComposition() {
  return (
    <Card className="w-full max-w-80" title="Inbox Manager" description="6 emails need you this morning.">
      <div className="flex flex-col gap-3">
        <ul className="flex flex-col gap-2">
          <li className="flex items-center gap-2 text-body-sm text-text-secondary">
            <span className="min-w-0 flex-1">Draft reply to Dana</span>
            <Badge tone="brand">Ready</Badge>
          </li>
          <li className="flex items-center gap-2 text-body-sm text-text-secondary">
            <span className="min-w-0 flex-1">Invoice from Northwind</span>
            <Badge tone="neutral">Waiting</Badge>
          </li>
        </ul>
        <Button size="sm" variant="solid">
          Review drafts
        </Button>
      </div>
    </Card>
  );
}
