import { Input, Label } from "@horon/web";

export default function LabelDemo() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-name">이름</Label>
        <Input id="demo-name" placeholder="김민열" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-email">
          이메일
          <span className="text-destructive">*</span>
        </Label>
        <Input id="demo-email" type="email" placeholder="you@example.com" required />
      </div>
    </div>
  );
}
