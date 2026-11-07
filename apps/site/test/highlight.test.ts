import { describe, expect, test } from "bun:test";

import { type CodeToken, highlight } from "../src/lib/highlight";

const flat = async (code: string, lang: string): Promise<CodeToken[]> => (await highlight(code, lang)).flat();
const contents = (tokens: CodeToken[], role: CodeToken["role"]) =>
  tokens.filter((token) => token.role === role).map((token) => token.content);

const SAMPLES: [string, string][] = [
  [
    "tsx",
    `<div className={cn("hover:bg-sky-500 -mt-2 w-[10px] md:px-4 bg-black/50", open && "flex")} data-x="flex" />
export function A() { return <Button size="sm">Hi</Button>; }
import { Button } from "@horon-ai/react";
const s = "flex px-4"; // note`,
  ],
  ["bash", "bun add @horon-ai/react --exact"],
  ["yaml", "dependencies:\n  horon_ui: ^0.1.0"],
  ["dart", "class Foo extends StatelessWidget { final String name; }"],
  ["html", `<div class="flex px-4" data-x="a"></div>`],
];

describe("code roles", () => {
  test("a class attribute splits into variant, utility, value and modifier", async () => {
    const tokens = await flat(SAMPLES[0][1], "tsx");
    expect(contents(tokens, "tw-variant")).toEqual(expect.arrayContaining(["hover", "md"]));
    expect(contents(tokens, "tw-utility")).toEqual(expect.arrayContaining(["bg", "mt", "w", "px", "flex"]));
    expect(contents(tokens, "tw-value")).toEqual(expect.arrayContaining(["sky-500", "10px", "4", "black"]));
    expect(contents(tokens, "tw-modifier")).toEqual(expect.arrayContaining(["-", "50"]));
  });

  test("a data attribute stays a plain string", async () => {
    const tokens = await flat(SAMPLES[0][1], "tsx");
    const dataValue = tokens.filter((token) => token.content === "flex");
    expect(dataValue.map((token) => token.role)).toContain("string");
  });

  test("a standalone string is not split into classes", async () => {
    const tokens = await flat(`const s = "flex px-4";`, "tsx");
    expect(tokens.filter((token) => token.content === "flex px-4").map((token) => token.role)).toEqual(["string"]);
    expect(tokens.some((token) => token.role.startsWith("tw-"))).toBe(false);
  });

  test("declarations, tags, attributes, comments and names get distinct roles", async () => {
    const tokens = await flat(SAMPLES[0][1], "tsx");
    expect(contents(tokens, "keyword")).toEqual(expect.arrayContaining(["import", "export", "function", "return"]));
    expect(contents(tokens, "type")).toContain("Button");
    expect(contents(tokens, "attribute")).toContain("size");
    expect(contents(tokens, "string")).toEqual(expect.arrayContaining(['"', "@horon-ai/react"]));
    expect(contents(tokens, "comment")).toContain("//");
    expect(contents(tokens, "function")).toContain("A");
  });

  test("bash commands are functions and flags are attributes", async () => {
    const tokens = await flat(SAMPLES[1][1], "bash");
    expect(contents(tokens, "function")).toContain("bun");
    expect(contents(tokens, "attribute").join("")).toContain("exact");
  });

  test("yaml keys are properties", async () => {
    const tokens = await flat(SAMPLES[2][1], "yaml");
    expect(contents(tokens, "property").join("")).toContain("dependencies");
    expect(contents(tokens, "property").join("")).toContain("horon_ui");
  });

  test("dart class names are types", async () => {
    const tokens = await flat(SAMPLES[3][1], "dart");
    expect(contents(tokens, "type")).toContain("Foo");
  });

  test("an unknown language falls back to one plain token per line", async () => {
    const lines = await highlight("alpha\nbeta", "not-a-language");
    expect(lines).toEqual([
      [{ content: "alpha", role: "plain" }],
      [{ content: "beta", role: "plain" }],
    ]);
  });

  test("every line round-trips to the source", async () => {
    const results = await Promise.all(SAMPLES.map(async ([lang, source]) => [source, await highlight(source, lang)] as const));
    for (const [source, lines] of results) {
      expect(lines.map((line) => line.map((token) => token.content).join("")).join("\n")).toBe(source);
    }
  });
});
