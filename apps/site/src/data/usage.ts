export const usageSnippets: Record<string, string> = {
  button: `import { Button } from "@horon/web";

<Button>저장</Button>
<Button variant="outline">취소</Button>
<Button variant="ghost" size="sm">더 보기</Button>`,
  card: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@horon/web";

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>본문</CardContent>
</Card>`,
  input: `import { Input } from "@horon/web";

<Input placeholder="이메일" type="email" />`,
  dialog: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@horon/web";

<Dialog>
  <DialogTrigger render={<Button />}>열기</DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>확인</DialogTitle></DialogHeader>
  </DialogContent>
</Dialog>`,
  select: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@horon/web";

<Select>
  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">옵션 A</SelectItem>
    <SelectItem value="b">옵션 B</SelectItem>
  </SelectContent>
</Select>`,
  toast: `import { ToastProvider, toast } from "@horon/web";

<ToastProvider />
toast({ title: "저장했습니다" });`,
};
