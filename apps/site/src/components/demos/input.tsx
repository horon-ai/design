import { Input } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function InputDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <Input className="w-44" size="sm" placeholder="Small" />
        <Input className="w-44" placeholder="Medium" />
        <Input className="w-44" size="lg" placeholder="Large" />
      </div>
      <Input className="w-72" icon={<MagnifyingGlass />} placeholder="Search bots" />
      <Input className="w-72" surface="glass" icon={<MagnifyingGlass />} placeholder="Search bots" />
      <Input className="w-72" surface="solid-on-page" icon={<MagnifyingGlass />} placeholder="Search bots" />
      <Input className="w-72" invalid defaultValue="Inbox Manager" />
      <Input className="w-72" disabled placeholder="Search bots" />
    </Backdrop>
  );
}
