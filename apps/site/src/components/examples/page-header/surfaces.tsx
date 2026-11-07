import { IconButton, PageHeader } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

export default function PageHeaderSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <PageHeader
        className="w-full max-w-97.5"
        surface="solid"
        title="Routines"
        onBack={() => undefined}
        actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}
      />
      <Backdrop className="flex-col">
        <PageHeader
          className="w-full max-w-97.5"
          surface="glass"
          title="Routines"
          onBack={() => undefined}
          actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}
        />
      </Backdrop>
    </div>
  );
}
