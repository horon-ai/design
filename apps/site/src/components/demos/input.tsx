import { Input } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { Backdrop } from "../demo-backdrop";

export default function InputDemo() {
  return (
    <Backdrop className="flex-col">
      <Input className="w-72" icon={<MagnifyingGlass />} placeholder="Search bots" />
      <Input className="w-72" surface="solid" icon={<MagnifyingGlass />} placeholder="Search bots" />
      <Input className="w-72" invalid defaultValue="Inbox Manager" />
      <Input className="w-72" disabled placeholder="Search bots" />
    </Backdrop>
  );
}
