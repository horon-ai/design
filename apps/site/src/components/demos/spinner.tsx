import { Spinner } from "@horon-ai/react";

export default function SpinnerDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <span className="text-[13px] text-muted-foreground">불러오는 중</span>
    </div>
  );
}
