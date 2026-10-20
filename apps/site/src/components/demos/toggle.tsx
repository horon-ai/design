import { Toggle } from "@horon/web";
import { BoldIcon, UnderlineIcon } from "lucide-react";

export default function ToggleDemo() {
  return (
    <>
      <Toggle variant="outline">
        <BoldIcon />
        굵게
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        기울임
      </Toggle>
      <Toggle variant="outline" aria-label="밑줄">
        <UnderlineIcon />
      </Toggle>
    </>
  );
}
