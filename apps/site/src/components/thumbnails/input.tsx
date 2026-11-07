import { Input } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function InputThumbnail() {
  return <Input className="w-72" icon={<MagnifyingGlass />} defaultValue="Inbox triage" />;
}
