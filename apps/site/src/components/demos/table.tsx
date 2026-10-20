import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@horon/web";

const rows = [
  { project: "디자인 시스템", status: "진행 중", updated: "오늘" },
  { project: "문서 사이트", status: "검토 중", updated: "어제" },
  { project: "모바일 앱", status: "완료", updated: "3일 전" },
];

export default function TableDemo() {
  return (
    <div className="w-full max-w-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>프로젝트</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">갱신</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.project}>
              <TableCell className="font-medium">{row.project}</TableCell>
              <TableCell className="text-muted-foreground">{row.status}</TableCell>
              <TableCell className="text-right tabular-nums">{row.updated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
