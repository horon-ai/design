import { Button } from "@horon-ai/react";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function ButtonLinks() {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="Example section">
      <Button variant="link" href="#installation" aria-current="page">
        Installation
      </Button>
      <Button variant="link" href="#properties">
        Properties
      </Button>
      <Button variant="link" href="#examples" icon={<ArrowUpRight />}>
        Examples
      </Button>
    </nav>
  );
}
