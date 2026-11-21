import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HoronText, RichText, SegmentedControl, type RichTextFormat } from "@horon-ai/expo";

const MARKDOWN = `## 이번 주 정리

**굵게**, *기울임*, ~~취소선~~, ++밑줄++, \`인라인 코드\`, [호론 홈](https://horon.ai), 위험한 [스크립트 링크](javascript:alert(1)).

긴 주소: https://horon.ai/docs/very/long/path/that/keeps/going/and/going/until/it/has/to/wrap?with=query&and=more

> 인용문은 보조 글자색으로 들어갑니다.

- [x] 디자인 검토
- [ ] 릴리스 노트

1. 첫째
2. 둘째
   - 들여 쓴 항목

| 봇 | 상태 | 최근 실행 | 메모 |
|:--|:-:|--:|:--|
| 받은편지함 정리 | 실행 중 | 3분 전 | 한 셀 안에서 줄을 바꿔야 할 만큼 긴 설명이 들어간 셀입니다 |
| 일정 요약 | 대기 | 1시간 전 | 짧음 |
| Weekly report generator with a long English name | 완료 | 어제 | ok |

\`\`\`ts
const veryLongLine = await horon.agents.run({ name: "inbox-manager", input: messages, options: { retries: 3 } });
\`\`\`

---

![호론 로고](https://horon.ai/og.png)`;

const BASIC = `# 제목은 글자 그대로

**굵게**, *기울임*, ~~취소선~~, ++밑줄++, \`코드\`, [링크](https://horon.ai), [막힌 링크](javascript:x)

- 순서 없는 목록
1. 순서 있는 목록

| 이름 | 값 |
|--|--:|
| 긴 셀 내용이 여기에 들어가면 줄이 바뀝니다 | 42 |

\`\`\`
npm install @horon-ai/expo
\`\`\`

> 인용과 ![이미지](https://horon.ai/og.png)는 기호 그대로`;

const HTML = `<h2>이번 주 정리</h2>
<p><b>굵게</b>, <i>기울임</i>, <s>취소선</s>, <u>밑줄</u>, <code>인라인 코드</code>,
<a href="https://horon.ai">호론 홈</a>, 위험한 <a href="javascript:alert(1)" onclick="steal()">스크립트 링크</a>.</p>
<script>alert("실행되면 안 됨")</script><style>p { color: red }</style>
<ul><li><input type="checkbox" checked> 디자인 검토</li><li><input type="checkbox"> 릴리스 노트</li></ul>
<table><tr><th>봇</th><th>상태</th></tr><tr><td>받은편지함 정리</td><td>실행 중</td></tr></table>
<pre><code>const a = 1;</code></pre>
<img src="https://horon.ai/og.png" alt="호론 로고" onerror="steal()">`;

const TEXT = "**기호도** <b>태그도</b> 그대로 보입니다.\n줄바꿈은 유지됩니다.";

const SOURCES: Record<RichTextFormat, string> = { text: TEXT, basic: BASIC, markdown: MARKDOWN, html: HTML };

const FORMATS: RichTextFormat[] = ["text", "basic", "markdown", "html"];

/** Replays a sample a few characters at a time from mount, the way a chat reply arrives. */
function StreamedReply({ source, format }: { source: string; format: RichTextFormat }) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setLength((current) => Math.min(source.length, current + 6)), 60);
    return () => clearInterval(timer);
  }, [source]);
  const done = length >= source.length;
  return (
    <View style={styles.stack}>
      <HoronText variant="caption" tone="text-secondary">
        {done ? "Stream finished" : "Streaming…"}
      </HoronText>
      <RichText format={format} streaming={!done} selectable confirmLinks>
        {source.slice(0, length)}
      </RichText>
    </View>
  );
}

export default function RichTextDemo() {
  const [format, setFormat] = useState<RichTextFormat>("markdown");
  const [run, setRun] = useState(0);
  return (
    <View style={styles.stack}>
      <SegmentedControl
        items={FORMATS.map((value) => ({ value, label: value }))}
        value={format}
        onValueChange={(next) => setFormat(FORMATS.find((value) => value === next) ?? "markdown")}
      />
      <Button variant="solid" size="sm" onPress={() => setRun((value) => value + 1)}>
        {run === 0 ? "Replay as a stream" : "Replay again"}
      </Button>
      {run === 0 ? (
        <RichText format={format} selectable confirmLinks>
          {SOURCES[format]}
        </RichText>
      ) : (
        <StreamedReply key={`${format}-${run}`} source={SOURCES[format]} format={format} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
