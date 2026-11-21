import { Alert, Linking } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { beforeEach, expect, jest, test } from "@jest/globals";
import { setStringAsync } from "expo-clipboard";

import { RichText, type RichTextFormat } from "../../src/components/rich-text";
import { HoronProvider } from "../../src/provider";

jest.mock("expo-clipboard", () => ({ setStringAsync: jest.fn(() => Promise.resolve(true)) }));

beforeEach(() => {
  jest.clearAllMocks();
});

const show = (source: string, format: RichTextFormat, props: Partial<Parameters<typeof RichText>[0]> = {}) =>
  render(
    <HoronProvider scheme="light">
      <RichText format={format} {...props}>
        {source}
      </RichText>
    </HoronProvider>,
  );

/** Every string on screen, in reading order. */
function visibleText(): string {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === "string") out.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object" && "children" in node) walk(node.children);
  };
  walk(screen.toJSON());
  return out.join("");
}

const MARKDOWN = [
  "## 이번 주 요약",
  "",
  "**굵게**, *기울임*, ~~취소~~, ++밑줄++, `코드`와 [호론](https://horon.ai).",
  "",
  "> 인용",
  "",
  "- [x] 완료",
  "- [ ] 할 일",
  "",
  "1. 하나",
  "2. 둘",
  "",
  "| 이름 | 값 |",
  "|:--|--:|",
  "| a | 1 |",
  "",
  "```ts",
  "const a = 1;",
  "```",
  "",
  "---",
].join("\n");

const HTML = [
  "<h2>이번 주 요약</h2>",
  '<p><b>굵게</b>, <i>기울임</i>, <s>취소</s>, <u>밑줄</u>, <code>코드</code>와 <a href="https://horon.ai">호론</a>.</p>',
  "<blockquote><p>인용</p></blockquote>",
  '<ul><li><input type="checkbox" checked> 완료</li><li><input type="checkbox"> 할 일</li></ul>',
  "<ol><li>하나</li><li>둘</li></ol>",
  '<table><tr><th align="left">이름</th><th align="right">값</th></tr><tr><td align="left">a</td><td align="right">1</td></tr></table>',
  "<pre><code>const a = 1;</code></pre>",
  "<hr>",
].join("\n");

test("the same content in markdown and in HTML renders the same screen", async () => {
  await show(MARKDOWN, "markdown");
  // Serialised, so only what is drawn counts and not the identity of each press handler.
  const markdown = JSON.stringify(screen.toJSON());
  await screen.unmount();
  await show(HTML, "html");
  expect(JSON.stringify(screen.toJSON())).toBe(markdown);
});

test("headings, links and checklist marks carry their roles", async () => {
  await show(MARKDOWN, "markdown");
  expect(screen.getByRole("header", { name: "이번 주 요약" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "호론" })).toBeTruthy();
  expect(screen.getByRole("checkbox", { name: "Done" }).props.accessibilityState).toMatchObject({ checked: true });
  expect(screen.getByRole("checkbox", { name: "Not done" }).props.accessibilityState).toMatchObject({ checked: false });
});

test("dangerous HTML is shown as inert text: no script, no handlers, no unsafe links", async () => {
  await show(
    '<p onclick="steal()">안녕<script>alert(1)</script><style>p{display:none}</style>' +
      '<a href="javascript:alert(1)">하나</a><a href="JaVaScRiPt&#58;x">둘</a><a href="data:text/html,x">셋</a>' +
      '<img src="x" onerror="steal()" alt="사진"><iframe src="https://evil.example">틀</iframe></p>',
    "html",
  );
  const text = visibleText();
  expect(text).toContain("안녕");
  expect(text).toContain("하나");
  expect(text).not.toMatch(/alert|steal|display|틀/);
  expect(screen.queryAllByRole("link")).toHaveLength(0);
});

test("a safe link goes to onLinkPress; an unsafe one is plain text", async () => {
  const opened: string[] = [];
  await show("[열기](https://horon.ai/a) [막힘](javascript:alert(1))", "markdown", { onLinkPress: (href) => opened.push(href) });
  await fireEvent.press(screen.getByRole("link", { name: "열기" }));
  expect(opened).toEqual(["https://horon.ai/a"]);
  expect(screen.queryByRole("link", { name: "막힘" })).toBeNull();
});

test("confirmLinks asks first and opens only after the confirmation", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
  const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
  await show("[문서](https://horon.ai/docs)", "basic", { confirmLinks: true });
  await fireEvent.press(screen.getByRole("link", { name: "문서" }));
  expect(openURL).not.toHaveBeenCalled();
  const buttons = alert.mock.calls[0]?.[2] ?? [];
  expect(alert.mock.calls[0]?.[1]).toBe("https://horon.ai/docs");
  buttons.find((button) => button.text === "Open")?.onPress?.();
  expect(openURL).toHaveBeenCalledWith("https://horon.ai/docs");
});

test("a streamed reply never shows half-received markdown syntax", async () => {
  await show("요약은 **중요", "markdown", { streaming: true });
  expect(visibleText()).not.toContain("**");
  expect(screen.getByText("중요")).toBeTruthy();
  await screen.unmount();

  await show("코드:\n\n```python\nprint(1)", "markdown", { streaming: true });
  expect(visibleText()).not.toContain("```");
  expect(screen.getByText("print(1)")).toBeTruthy();
  await screen.unmount();

  await show("표:\n\n| 이름 | 값 |\n|--", "markdown", { streaming: true });
  expect(visibleText()).not.toContain("|");
  await screen.unmount();

  await show("[링크](https://hor", "markdown", { streaming: true });
  expect(visibleText()).not.toContain("](");
});

test("basic formats emphasis, lists, links, tables and code, and leaves the rest as typed", async () => {
  await show("# 제목\n\n**굵게** [링크](https://horon.ai) ![사진](https://x.test/a.png)\n\n> 인용\n\n- 항목\n\n| a |\n|-|\n| 1 |\n\n```\nx\n```", "basic");
  const text = visibleText();
  expect(text).toContain("# 제목");
  expect(text).toContain("![사진](https://x.test/a.png)");
  expect(text).toContain("> 인용");
  expect(text).not.toContain("**");
  expect(screen.queryByRole("header")).toBeNull();
  expect(screen.getByRole("link", { name: "링크" })).toBeTruthy();
  expect(screen.getByText("1")).toBeTruthy();
  expect(screen.getByText("x")).toBeTruthy();
});

test("the copy button copies a code block", async () => {
  await show("```\nnpm i\n```", "markdown");
  await fireEvent.press(screen.getByRole("button", { name: "Copy" }));
  expect(setStringAsync).toHaveBeenCalledWith("npm i");
  expect(await screen.findByRole("button", { name: "Copied" })).toBeTruthy();
});

test("remote images load only when allowed, and only over https", async () => {
  await show("![지도](https://horon.ai/map.png)\n\n![비밀](data:image/png;base64,AAAA)", "markdown");
  expect(screen.getByRole("image", { name: "지도" }).props.source).toBeUndefined();
  await screen.unmount();

  await show("![지도](https://horon.ai/map.png)\n\n![비밀](data:image/png;base64,AAAA)", "markdown", { images: "load" });
  expect(screen.getByRole("image", { name: "지도" }).props.source).toEqual({ uri: "https://horon.ai/map.png" });
  expect(screen.getByRole("image", { name: "비밀" }).props.source).toBeUndefined();
});

test("plain text keeps its characters and line breaks", async () => {
  await show("**그대로**\n<b>둘째 줄</b>", "text");
  expect(screen.getByText("**그대로**\n<b>둘째 줄</b>")).toBeTruthy();
});
