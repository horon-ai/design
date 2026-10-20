import { NativeSelect } from "@horon/web";

export default function NativeSelectDemo() {
  return (
    <NativeSelect defaultValue="apple" aria-label="과일">
      <option value="apple">사과</option>
      <option value="banana">바나나</option>
      <option value="cherry">체리</option>
    </NativeSelect>
  );
}
