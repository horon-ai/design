import {
  Typography,
  TypographyHeading,
  TypographyInlineCode,
  TypographyLead,
  TypographyList,
  TypographyMuted,
} from "@horon-ai/react";

export default function TypographyDemo() {
  return (
    <Typography className="w-full max-w-prose">
      <TypographyHeading level={2}>디자인 토큰</TypographyHeading>
      <TypographyLead>색, 글자, 움직임을 한곳에서 정의합니다.</TypographyLead>
      <p>
        토큰을 설치한 뒤 전역 스타일시트에서 테마를 불러오면 모든 컴포넌트가 같은 값을 씁니다. 패키지 이름은{" "}
        <TypographyInlineCode>@horon-ai/tokens</TypographyInlineCode>입니다.
      </p>
      <TypographyList>
        <li>토큰 패키지를 작업 공간에 추가합니다.</li>
        <li>앱 최상단에서 테마를 한 번 불러옵니다.</li>
      </TypographyList>
      <TypographyMuted>2026년 10월 기준.</TypographyMuted>
    </Typography>
  );
}
