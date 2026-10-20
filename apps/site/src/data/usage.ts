export const usageSnippets: Record<string, string> = {
  button: `import { Button } from "@horon-ai/react";

<Button>저장</Button>
<Button variant="outline">취소</Button>
<Button variant="ghost" size="sm">더 보기</Button>`,
  card: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@horon-ai/react";

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>본문</CardContent>
</Card>`,
  input: `import { Input } from "@horon-ai/react";

<Input placeholder="이메일" type="email" />`,
  dialog: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@horon-ai/react";

<Dialog>
  <DialogTrigger render={<Button />}>열기</DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>확인</DialogTitle></DialogHeader>
  </DialogContent>
</Dialog>`,
  select: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@horon-ai/react";

<Select>
  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">옵션 A</SelectItem>
    <SelectItem value="b">옵션 B</SelectItem>
  </SelectContent>
</Select>`,
  toast: `import { ToastProvider, toast } from "@horon-ai/react";

<ToastProvider />
toast({ title: "저장했습니다" });`,
  sonner: `import { SonnerToaster, sonnerToast } from "@horon-ai/react";

<SonnerToaster />
sonnerToast.success("저장했습니다");`,
  resizable: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@horon-ai/react";

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize="32%">목록</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel>본문</ResizablePanel>
</ResizablePanelGroup>`,
  direction: `import { DirectionProvider } from "@horon-ai/react";

<DirectionProvider direction="rtl">
  <App />
</DirectionProvider>`,
  chart: `// chart is not in the barrel: recharts assigns onto the module at import
// time, so it ships through its own subpath.
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@horon-ai/react/components/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const config = { visits: { label: "방문", color: "var(--chart-1)" } } satisfies ChartConfig;

<ChartContainer config={config} className="h-56 w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
  </BarChart>
</ChartContainer>`,
};
