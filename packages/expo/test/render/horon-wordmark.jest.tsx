import { Platform } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { afterEach, expect, jest, test } from "@jest/globals";

import { HoronWordmark } from "../../src/components/horon-wordmark";
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

test("on native, the wordmark is announced as one accessible image under its title", async () => {
  setPlatformOS("ios");
  await render(
    <HoronProvider scheme="light">
      <HoronWordmark />
      <HoronWordmark title="Horon design system" />
    </HoronProvider>,
  );

  const defaultMark = screen.getByLabelText("Horon");
  const customMark = screen.getByLabelText("Horon design system");
  expect(defaultMark.props.accessible).toBe(true);
  expect(defaultMark.props.accessibilityRole).toBe("image");
  expect(customMark.props.accessible).toBe(true);
  expect(customMark.props.accessibilityRole).toBe("image");
});

test("on web, the wordmark omits `accessible` and uses ARIA attributes without warnings", async () => {
  setPlatformOS("web");
  const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);

  await render(
    <HoronProvider scheme="light">
      <HoronWordmark />
      <HoronWordmark title="Horon design system" />
      <HoronWordmark title="" />
    </HoronProvider>,
  );

  const svgs = findSvgs(screen.toJSON());
  expect(svgs).toHaveLength(3);

  const [defaultSvg, customSvg, decorativeSvg] = svgs;
  expect(defaultSvg?.props.accessible).toBeUndefined();
  expect(defaultSvg?.props.role).toBe("img");
  expect(defaultSvg?.props["aria-label"]).toBe("Horon");

  expect(customSvg?.props.accessible).toBeUndefined();
  expect(customSvg?.props.role).toBe("img");
  expect(customSvg?.props["aria-label"]).toBe("Horon design system");

  expect(decorativeSvg?.props.accessible).toBeUndefined();
  expect(decorativeSvg?.props["aria-hidden"]).toBe(true);
  expect(decorativeSvg?.props.role).toBeUndefined();
  expect(decorativeSvg?.props["aria-label"]).toBeUndefined();

  expect(error).not.toHaveBeenCalled();
  expect(warn).not.toHaveBeenCalled();
});
