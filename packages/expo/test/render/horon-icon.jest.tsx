import { Platform } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { afterEach, expect, jest, test } from "@jest/globals";

import { HoronIcon } from "../../src/components/horon-icon";
import { HoronProvider } from "../../src/provider";

type JsonNode = { type: string; props: Record<string, unknown>; children?: unknown[] | null };

const originalPlatformOS = Object.getOwnPropertyDescriptor(Platform, "OS");

function setPlatformOS(os: typeof Platform.OS) {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true, writable: true });
}

function isJsonNode(value: unknown): value is JsonNode {
  return typeof value === "object" && value !== null && "type" in value && "props" in value;
}

function findSvgs(node: unknown, out: JsonNode[] = []): JsonNode[] {
  if (!node || typeof node === "string") return out;
  if (Array.isArray(node)) {
    for (const child of node) findSvgs(child, out);
    return out;
  }
  if (!isJsonNode(node)) return out;
  if (node.type === "RNSVGSvgView" || node.type === "RNSVGSvgViewAndroid" || node.type === "svg") out.push(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) findSvgs(child, out);
  }
  return out;
}

afterEach(() => {
  if (originalPlatformOS) Object.defineProperty(Platform, "OS", originalPlatformOS);
  jest.restoreAllMocks();
});

test("on native, HoronIcon stays decorative by default and exposes an accessible image when labelled", async () => {
  setPlatformOS("ios");
  await render(
    <HoronProvider scheme="light">
      <HoronIcon />
      <HoronIcon accessibilityLabel="Horon" />
    </HoronProvider>,
  );

  const svgs = findSvgs(screen.toJSON());
  expect(svgs).toHaveLength(2);

  const [decorativeSvg, labelledSvg] = svgs;
  expect(decorativeSvg?.props.accessible).toBe(false);
  expect(decorativeSvg?.props.accessibilityRole).toBeUndefined();
  expect(decorativeSvg?.props.accessibilityLabel).toBeUndefined();

  expect(labelledSvg?.props.accessible).toBe(true);
  expect(labelledSvg?.props.accessibilityRole).toBe("image");
  expect(labelledSvg?.props.accessibilityLabel).toBe("Horon");
});

test("on web, HoronIcon omits `accessible` and uses ARIA attributes without warnings", async () => {
  setPlatformOS("web");
  const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);

  await render(
    <HoronProvider scheme="light">
      <HoronIcon />
      <HoronIcon accessibilityLabel="Horon" />
    </HoronProvider>,
  );

  const svgs = findSvgs(screen.toJSON());
  expect(svgs).toHaveLength(2);

  const [decorativeSvg, labelledSvg] = svgs;
  expect(decorativeSvg?.props.accessible).toBeUndefined();
  expect(decorativeSvg?.props["aria-hidden"]).toBe(true);
  expect(decorativeSvg?.props.role).toBeUndefined();
  expect(decorativeSvg?.props["aria-label"]).toBeUndefined();

  expect(labelledSvg?.props.accessible).toBeUndefined();
  expect(labelledSvg?.props["aria-hidden"]).toBeUndefined();
  expect(labelledSvg?.props.role).toBe("img");
  expect(labelledSvg?.props["aria-label"]).toBe("Horon");

  expect(error).not.toHaveBeenCalled();
  expect(warn).not.toHaveBeenCalled();
});
