import { PageHeader } from "@horon-ai/react";

export default function PageHeaderBack() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <PageHeader className="w-full max-w-97.5" title="Routines" onBack={() => undefined} backLabel="Go back" />
      <PageHeader className="w-full max-w-97.5" title="Routines" />
      <PageHeader
        className="w-full max-w-97.5"
        title="Quarterly planning with the whole hiring team"
        onBack={() => undefined}
      />
    </div>
  );
}
