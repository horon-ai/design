import { Label, Switch } from "@horon/web";

export default function SwitchDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Switch defaultChecked />
        켜짐
      </Label>
      <Label>
        <Switch />
        꺼짐
      </Label>
      <Label>
        <Switch size="sm" defaultChecked />
        작은 크기
      </Label>
      <Label>
        <Switch disabled />
        비활성
      </Label>
    </div>
  );
}
