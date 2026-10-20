import {
  List,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from "@horon-ai/react";
import { FileTextIcon, FolderIcon, ImageIcon } from "lucide-react";

const items = [
  { icon: FolderIcon, title: "디자인 토큰", description: "어제 12개 파일이 수정됨", trailing: "동기화" },
  { icon: FileTextIcon, title: "컴포넌트 목록", description: "작성 중인 초안", trailing: "초안" },
  { icon: ImageIcon, title: "마스코트 이미지", description: "이미지 8개", trailing: "준비됨" },
];

export default function ListDemo() {
  return (
    <List className="w-full max-w-md">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <ListItem key={item.title}>
            <ListItemMedia>
              <Icon />
            </ListItemMedia>
            <ListItemContent>
              <ListItemTitle>{item.title}</ListItemTitle>
              <ListItemDescription>{item.description}</ListItemDescription>
            </ListItemContent>
            <ListItemTrailing>{item.trailing}</ListItemTrailing>
          </ListItem>
        );
      })}
    </List>
  );
}
