import { DateSeparator } from "@horon-ai/react";

export default function MessageExtrasDateSeparator() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-4">
      <DateSeparator>Yesterday</DateSeparator>
      <DateSeparator>Today</DateSeparator>
    </div>
  );
}
