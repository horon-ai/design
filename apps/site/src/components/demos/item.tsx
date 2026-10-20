import { Fragment } from "react";
import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@horon/web";
import { FolderIcon, KeyRoundIcon, ShieldCheckIcon } from "lucide-react";

const items = [
  { icon: FolderIcon, title: "디자인 토큰", description: "색과 간격을 한곳에서 관리합니다.", action: "열기" },
  { icon: KeyRoundIcon, title: "API 키", description: "3일 전에 교체했습니다.", action: "관리" },
  { icon: ShieldCheckIcon, title: "보안 검토", description: "지난 감사를 통과했습니다.", action: "보기" },
];

export default function ItemDemo() {
  return (
    <ItemGroup className="w-96">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Fragment key={item.title}>
            {index > 0 ? <ItemSeparator /> : null}
            <Item variant="outline">
              <ItemMedia variant="icon">
                <Icon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="outline" size="sm">
                  {item.action}
                </Button>
              </ItemActions>
            </Item>
          </Fragment>
        );
      })}
    </ItemGroup>
  );
}
