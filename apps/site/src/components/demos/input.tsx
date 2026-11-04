import { Input } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Input className="w-44" surface={surface} size="sm" placeholder="Small" />
        <Input className="w-44" surface={surface} placeholder="Medium" />
        <Input className="w-44" surface={surface} size="lg" placeholder="Large" />
      </div>
      <Input className="w-72" surface={surface} icon={<MagnifyingGlass />} placeholder="Search bots" />
      <Input className="w-72" surface={surface} invalid defaultValue="Inbox Manager" />
      <Input className="w-72" surface={surface} disabled placeholder="Search bots" />
    </div>
  );
}

export default function InputDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
      <div className="flex flex-col items-center gap-4">
        <p className="text-caption text-text-secondary">Solid on page</p>
        <Input className="w-72" surface="solid-on-page" icon={<MagnifyingGlass />} placeholder="Search bots" />
      </div>
    </div>
  );
}
