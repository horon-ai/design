import { ListDetail, ListDetailHeader, ListDetailMeta } from "@horon-ai/react";
import { FileText } from "@phosphor-icons/react";

import { Backdrop } from "../../demo-backdrop";

const groups = [
  {
    id: "sources",
    label: "SOURCES",
    items: [
      { id: "readme", title: "README.md", meta: "2.1 KB" },
      { id: "spec", title: "spec.md", meta: "8.4 KB" },
    ],
  },
];

export default function ListDetailGlass() {
  return (
    <Backdrop>
      <ListDetail surface="glass" defaultValue="readme" groups={groups}>
        {(item) => (
          <>
            <ListDetailHeader
              icon={<FileText weight="fill" />}
              title={item.title}
              description="Indexed 4 minutes ago"
            />
            <ListDetailMeta
              items={[
                { id: "size", label: "Size", value: item.meta ?? "unknown" },
                { id: "chunks", label: "Chunks", value: "42" },
              ]}
            />
          </>
        )}
      </ListDetail>
    </Backdrop>
  );
}
