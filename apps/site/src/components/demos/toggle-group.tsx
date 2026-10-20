import { ToggleGroup, ToggleGroupItem } from "@horon-ai/react";

export default function ToggleGroupDemo() {
  return (
    <>
      <ToggleGroup defaultValue={["왼쪽"]} aria-label="정렬">
        <ToggleGroupItem value="왼쪽">왼쪽</ToggleGroupItem>
        <ToggleGroupItem value="가운데">가운데</ToggleGroupItem>
        <ToggleGroupItem value="오른쪽">오른쪽</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup multiple defaultValue={["굵게"]} aria-label="서식">
        <ToggleGroupItem value="굵게">굵게</ToggleGroupItem>
        <ToggleGroupItem value="기울임">기울임</ToggleGroupItem>
        <ToggleGroupItem value="밑줄">밑줄</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" defaultValue={["하루"]} aria-label="기간">
        <ToggleGroupItem value="하루">하루</ToggleGroupItem>
        <ToggleGroupItem value="일주일">일주일</ToggleGroupItem>
        <ToggleGroupItem value="한 달">한 달</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
