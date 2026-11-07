import { Button } from "@horon-ai/react";

export default function ButtonAsLink() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button href="/components">Browse components</Button>
      <Button variant="solid" href="/components/button">
        This page
      </Button>
      <Button variant="danger" href="/components">
        Leave this page
      </Button>
    </div>
  );
}
