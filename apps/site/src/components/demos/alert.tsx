import { Alert, AlertDescription, AlertTitle } from "@horon-ai/react";

export default function AlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert>
        <AlertTitle>안내</AlertTitle>
        <AlertDescription>변경 사항은 자동으로 저장됩니다.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>삭제할 수 없습니다</AlertTitle>
        <AlertDescription>이 항목은 다른 문서에서 참조하고 있습니다.</AlertDescription>
      </Alert>
    </div>
  );
}
