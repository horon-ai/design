import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from "@horon/web";

export default function PopoverDemo() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="outline" />}>크기 설정</PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-popover-width">너비</Label>
            <Input id="demo-popover-width" defaultValue="320" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-popover-height">높이</Label>
            <Input id="demo-popover-height" defaultValue="180" />
          </div>
          <Button size="sm">적용</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
