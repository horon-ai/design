import { Progress, ProgressLabel, ProgressValue } from "@horon-ai/react";

export default function ProgressDemo() {
  return (
    <>
      <Progress value={35} className="w-72 flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <ProgressLabel>업로드</ProgressLabel>
          <ProgressValue>{(formatted) => `${formatted ?? 0}%`}</ProgressValue>
        </div>
      </Progress>
      <Progress value={80} className="w-72 flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <ProgressLabel>동기화</ProgressLabel>
          <ProgressValue>{(formatted) => `${formatted ?? 0}%`}</ProgressValue>
        </div>
      </Progress>
    </>
  );
}
