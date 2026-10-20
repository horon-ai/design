import { Marker, MarkerContent, MarkerIcon } from "@horon-ai/react";
import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon } from "lucide-react";

const steps = [
  { icon: CircleCheckIcon, variant: "success" as const, label: "설계 확정", time: "10:20" },
  { icon: CircleDotIcon, variant: "info" as const, label: "구현 진행 중", time: "11:05" },
  { icon: CircleDashedIcon, variant: "muted" as const, label: "검토 대기", time: "예정" },
];

export default function MarkerDemo() {
  return (
    <ol className="flex w-64 flex-col gap-4 border-l border-border pl-4">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <li key={step.label} className="flex items-center justify-between gap-3">
            <Marker variant={step.variant}>
              <MarkerIcon>
                <Icon />
              </MarkerIcon>
              <MarkerContent>{step.label}</MarkerContent>
            </Marker>
            <span className="text-[13px] text-muted-foreground">{step.time}</span>
          </li>
        );
      })}
    </ol>
  );
}
