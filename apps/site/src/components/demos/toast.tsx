import { Button, Toaster, toast } from "@horon/web";
import { useEffect } from "react";

export default function ToastDemo() {
  useEffect(() => {
    toast.add({
      title: "저장했습니다",
      description: "변경 사항이 바로 반영됩니다.",
      type: "success",
      timeout: 3_600_000,
    });
  }, []);

  return (
    <Toaster>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "저장했습니다",
            description: "변경 사항이 바로 반영됩니다.",
            type: "success",
            timeout: 4000,
          })
        }
      >
        알림 보기
      </Button>
    </Toaster>
  );
}
