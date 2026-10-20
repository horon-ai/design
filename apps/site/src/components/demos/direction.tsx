import { Button, DirectionProvider } from "@horon/web";

export default function DirectionDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-muted-foreground">LTR</p>
        <DirectionProvider direction="ltr">
          <div dir="ltr" className="flex w-56 flex-col gap-2 rounded-sm border border-border p-3">
            <p className="text-[13px]">기본 방향</p>
            <Button size="sm" variant="outline">
              계속
            </Button>
          </div>
        </DirectionProvider>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-muted-foreground">RTL</p>
        <DirectionProvider direction="rtl">
          <div dir="rtl" className="flex w-56 flex-col gap-2 rounded-sm border border-border p-3">
            <p className="text-[13px]">반대 방향</p>
            <Button size="sm" variant="outline">
              계속
            </Button>
          </div>
        </DirectionProvider>
      </div>
    </div>
  );
}
