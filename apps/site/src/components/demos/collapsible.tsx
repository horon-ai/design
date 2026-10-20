import { Button, Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@horon/web";
import { ChevronDownIcon } from "lucide-react";

const activity = [
  "스테이징에 디자인 시스템을 배포했습니다.",
  "토큰 파이프라인 리팩터를 병합했습니다.",
  "새 버튼 변형 리뷰를 열었습니다.",
];

export default function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-sm" defaultOpen>
      <CollapsibleTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        최근 활동
        <ChevronDownIcon className="group-data-[panel-open]/collapsible-trigger:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <ul className="flex flex-col gap-1.5">
          {activity.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CollapsiblePanel>
    </Collapsible>
  );
}
