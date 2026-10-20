import { Button, ButtonGroup, ButtonGroupSeparator } from "@horon/web";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function ButtonGroupDemo() {
  return (
    <>
      <ButtonGroup>
        <Button variant="outline">일</Button>
        <Button variant="outline">주</Button>
        <Button variant="outline">월</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <MinusIcon />
          축소
        </Button>
        <ButtonGroupSeparator />
        <Button variant="outline">
          <PlusIcon />
          확대
        </Button>
      </ButtonGroup>
    </>
  );
}
