import { Button, SonnerToaster, sonnerToast } from "@horon/web";
import { useEffect } from "react";

export default function SonnerDemo() {
  useEffect(() => {
    sonnerToast.success("저장했습니다", { description: "변경 사항이 바로 반영됩니다.", duration: 3_600_000 });
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => sonnerToast("알림이 도착했습니다")}>
        알림 보기
      </Button>
      <SonnerToaster />
    </div>
  );
}
