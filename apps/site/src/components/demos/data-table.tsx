import { DataTable, type DataTableColumn } from "@horon-ai/react";

interface Member {
  name: string;
  role: string;
  commits: number;
}

const columns: DataTableColumn<Member>[] = [
  { accessorKey: "name", header: "이름" },
  { accessorKey: "role", header: "역할" },
  { accessorKey: "commits", header: "커밋" },
];

const data: Member[] = [
  { name: "민열", role: "설계", commits: 128 },
  { name: "지우", role: "프론트엔드", commits: 94 },
  { name: "도현", role: "백엔드", commits: 76 },
  { name: "서연", role: "디자인", commits: 61 },
  { name: "하람", role: "QA", commits: 43 },
  { name: "유진", role: "문서", commits: 28 },
];

export default function DataTableDemo() {
  return (
    <div className="w-full">
      <DataTable columns={columns} data={data} pageSize={4} emptyMessage="결과가 없습니다." />
    </div>
  );
}
