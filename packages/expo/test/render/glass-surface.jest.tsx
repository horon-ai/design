import { createElement as mockCreateElement, type ReactNode } from "react";
import { StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { describe, expect, jest, test } from "@jest/globals";
import { darkColors, glass, lightColors } from "@horon-ai/tokens";

jest.mock("expo-glass-effect", () => ({
  isLiquidGlassAvailable: () => true,
  isGlassEffectAPIAvailable: () => true,
  GlassView: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) =>
    mockCreateElement("ExpoGlassView", props, children),
}));

import { TabBar } from "../../src/components/tab-bar";
import { TopBar } from "../../src/components/top-bar";
import { GlassSurface } from "../../src/lib/glass-surface";
import { HoronProvider } from "../../src/provider";

type JsonNode = { type: string; props: Record<string, unknown> & { style?: StyleProp<ViewStyle> }; children?: unknown[] | null };

function isNode(value: unknown): value is JsonNode {
  return typeof value === "object" && value !== null && "type" in value && "props" in value;
}

function findAll(node: unknown, predicate: (n: JsonNode) => boolean, out: JsonNode[] = []): JsonNode[] {
  if (!node || typeof node === "string") return out;
  if (Array.isArray(node)) {
    for (const child of node) findAll(child, predicate, out);
    return out;
  }
  if (!isNode(node)) return out;
  if (predicate(node)) out.push(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) findAll(child, predicate, out);
  }
  return out;
}

function findParentOf(node: unknown, target: JsonNode | undefined): JsonNode | null {
  if (!target || !node || typeof node === "string") return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = findParentOf(child, target);
      if (hit) return hit;
    }
    return null;
  }
  if (!isNode(node) || !Array.isArray(node.children)) return null;
  if (node.children.includes(target)) return node;
  for (const child of node.children) {
    const hit = findParentOf(child, target);
    if (hit) return hit;
  }
  return null;
}

describe("GlassSurface native Liquid Glass and frost fallback", () => {
  test("dark floating chrome uses regular effect at 0.92 opacity while light uses regular at 0.75 opacity, both unclipped", async () => {
    const { rerender } = await render(
      <HoronProvider scheme="dark">
        <GlassSurface testID="surface" tier="clear" radius={24}>
          <Text>Chrome</Text>
        </GlassSurface>
      </HoronProvider>,
    );

    const darkTree = screen.toJSON();
    const darkSurface = screen.getByTestId("surface");
    const darkViews = findAll(darkTree, (n) => n.type === "ExpoGlassView");
    expect(darkViews).toHaveLength(1);
    expect(darkViews[0]?.props.glassEffectStyle).toBe("regular");
    expect(darkViews[0]?.props.colorScheme).toBe("dark");
    expect(darkViews[0]?.props.tintColor).toBeUndefined();
    const darkWrapper = findParentOf(darkTree, darkViews[0]);
    expect(StyleSheet.flatten(darkWrapper?.props.style)?.opacity).toBe(0.92);
    expect(StyleSheet.flatten(darkSurface.props.style)?.overflow).not.toBe("hidden");

    await rerender(
      <HoronProvider scheme="light">
        <GlassSurface testID="surface" tier="clear" radius={24}>
          <Text>Chrome</Text>
        </GlassSurface>
      </HoronProvider>,
    );

    const lightTree = screen.toJSON();
    const lightSurface = screen.getByTestId("surface");
    const lightViews = findAll(lightTree, (n) => n.type === "ExpoGlassView");
    expect(lightViews).toHaveLength(1);
    expect(lightViews[0]?.props.glassEffectStyle).toBe("regular");
    expect(lightViews[0]?.props.colorScheme).toBe("light");
    expect(lightViews[0]?.props.tintColor).toBeUndefined();
    const lightWrapper = findParentOf(lightTree, lightViews[0]);
    expect(StyleSheet.flatten(lightWrapper?.props.style)?.opacity).toBe(0.75);
    expect(StyleSheet.flatten(lightSurface.props.style)?.overflow).not.toBe("hidden");
  });

  test("thick tier keeps regular effect with scheme tint and veil material keeps regular effect while clipping", async () => {
    await render(
      <HoronProvider scheme="dark">
        <GlassSurface testID="thick" tier="thick" radius={16}>
          <Text>Card</Text>
        </GlassSurface>
        <GlassSurface testID="veil" material="veil" radius={16}>
          <Text>Menu</Text>
        </GlassSurface>
      </HoronProvider>,
    );

    const tree = screen.toJSON();
    const glassViews = findAll(tree, (n) => n.type === "ExpoGlassView");
    expect(glassViews).toHaveLength(2);
    expect(glassViews[0]?.props.glassEffectStyle).toBe("regular");
    expect(glassViews[0]?.props.tintColor).toBe(darkColors["glass-fill-strong"]);
    expect(glassViews[1]?.props.glassEffectStyle).toBe("regular");
    expect(glassViews[1]?.props.tintColor).toBeUndefined();
    expect(StyleSheet.flatten(screen.getByTestId("thick").props.style)?.overflow).not.toBe("hidden");
    expect(StyleSheet.flatten(screen.getByTestId("veil").props.style)?.overflow).toBe("hidden");
  });

  test("TabBar and TopBar leave their glass pill unclipped so native edge refraction stays visible", async () => {
    await render(
      <HoronProvider scheme="dark">
        <TabBar
          value="home"
          surface="glass"
          items={[{ value: "home", label: "Home", icon: <Text>H</Text> }]}
        />
        <TopBar title="Inbox" surface="glass" />
      </HoronProvider>,
    );

    const tree = screen.toJSON();
    const tablist = findAll(tree, (n) => n.props.role === "tablist")[0];
    const tabPill = Array.isArray(tablist?.children) ? tablist.children[0] : undefined;
    expect(isNode(tabPill)).toBe(true);
    expect(isNode(tabPill) && StyleSheet.flatten(tabPill.props.style)?.overflow).not.toBe("hidden");

    const banner = findAll(tree, (n) => n.props.role === "banner")[0];
    const topPill = Array.isArray(banner?.children) ? banner.children[0] : undefined;
    expect(isNode(topPill)).toBe(true);
    expect(isNode(topPill) && StyleSheet.flatten(topPill.props.style)?.overflow).not.toBe("hidden");
  });

  test("frost fallback omits GlassView and paints glass-fill-frost with the active scheme rim", async () => {
    await render(
      <HoronProvider scheme="light" glass="frost">
        <GlassSurface testID="frost" radius={20}>
          <Text>Fallback</Text>
        </GlassSurface>
      </HoronProvider>,
    );

    expect(findAll(screen.toJSON(), (n) => n.type === "ExpoGlassView")).toHaveLength(0);
    const style = StyleSheet.flatten(screen.getByTestId("frost").props.style);
    expect(style?.backgroundColor).toBe(lightColors["glass-fill-frost"]);
    expect(style?.borderTopColor).toBe(glass.rim.light.top);
  });
});
