import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@horon/web";

export default function DialogDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>프로필 수정</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>이름을 바꾸고 저장을 누르면 바로 반영됩니다.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-dialog-name">이름</Label>
            <Input id="demo-dialog-name" defaultValue="민열" />
          </div>
          <DialogFooter>
            <Button>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-[12px] text-muted-foreground">버튼을 누르면 대화상자가 열립니다.</p>
    </div>
  );
}
