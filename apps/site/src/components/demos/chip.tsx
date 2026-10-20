import { useState } from "react";
import { Chip } from "@horon/web";

export default function ChipDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip variant="outline">기본</Chip>
      <Chip>선택됨</Chip>
      {visible ? (
        <Chip variant="secondary" removeLabel="태그 삭제" onRemove={() => setVisible(false)}>
          디자인
        </Chip>
      ) : null}
    </div>
  );
}
