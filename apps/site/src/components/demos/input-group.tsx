import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@horon-ai/react";
import { SearchIcon, XIcon } from "lucide-react";

export default function InputGroupDemo() {
  return (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="컴포넌트 검색" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="검색어 지우기">
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
