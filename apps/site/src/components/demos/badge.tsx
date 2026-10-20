import { Badge } from "@horon/web";

export default function BadgeDemo() {
  return (
    <>
      <Badge>기본</Badge>
      <Badge variant="secondary">보조</Badge>
      <Badge variant="outline">외곽선</Badge>
      <Badge variant="destructive">오류</Badge>
    </>
  );
}
