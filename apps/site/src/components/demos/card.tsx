import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@horon-ai/react";

export default function CardDemo() {
  return (
    <>
      <Card className="w-80">
        <CardHeader>
          <CardTitle>팀 플랜</CardTitle>
          <CardDescription>팀에 필요한 기능을 모두 담았습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] leading-6 text-muted-foreground">
            프로젝트 무제한, 공유 토큰, 감사 기록이 포함됩니다.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">업그레이드</Button>
        </CardFooter>
      </Card>
      <Card size="sm" className="w-64">
        <CardHeader>
          <CardTitle>간단 요약</CardTitle>
          <CardDescription>좁은 영역에 맞춘 카드입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] leading-6 text-muted-foreground">여백이 더 촘촘합니다.</p>
        </CardContent>
        <CardFooter>
          <Button size="xs" variant="outline">
            자세히
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
