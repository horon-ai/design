import { Label, RadioGroup, RadioGroupItem } from "@horon/web";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="a" className="w-64">
      <Label>
        <RadioGroupItem value="a" />
        옵션 A
      </Label>
      <Label>
        <RadioGroupItem value="b" />
        옵션 B
      </Label>
      <Label>
        <RadioGroupItem value="c" />
        옵션 C
      </Label>
      <Label>
        <RadioGroupItem value="d" disabled />
        옵션 D
      </Label>
    </RadioGroup>
  );
}
