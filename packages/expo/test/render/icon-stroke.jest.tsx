import { useContext } from "react";
import { Text } from "react-native";
import { IconContext, type IconWeight } from "phosphor-react-native";
import { render, screen } from "@testing-library/react-native";
import { describe, expect, test } from "@jest/globals";

import { Button } from "../../src/components/button";
import { HoronGlyph } from "../../src/components/horon-icon";
import { IconButton } from "../../src/components/icon-button";
import { TabBar } from "../../src/components/tab-bar";
import { HoronProvider } from "../../src/provider";

function IconContextProbe({ label, explicitWeight }: { label: string; explicitWeight?: IconWeight }) {
  const ctx = useContext(IconContext);
  const effectiveWeight = explicitWeight ?? ctx.weight ?? "regular";
  return <Text testID={label}>{`${String(ctx.size)}:${effectiveWeight}`}</Text>;
}

describe("icon stroke and Phosphor weight defaults", () => {
  test("HoronProvider defaults icons to light weight and nested controls preserve it across 16/20/24px sizes", async () => {
    await render(
      <HoronProvider scheme="dark">
        <IconContextProbe label="root" />
        <IconButton size="sm" label="Small" icon={<IconContextProbe label="btn-sm" />} />
        <IconButton size="md" label="Medium" icon={<IconContextProbe label="btn-md" />} />
        <IconButton size="lg" label="Large" icon={<IconContextProbe label="btn-lg" />} />
        <Button icon={<IconContextProbe label="button" />}>Action</Button>
      </HoronProvider>,
    );

    expect(screen.getByTestId("root").props.children).toBe("16:light");
    expect(screen.getByTestId("btn-sm").props.children).toBe("16:light");
    expect(screen.getByTestId("btn-md").props.children).toBe("20:light");
    expect(screen.getByTestId("btn-lg").props.children).toBe("24:light");
    expect(screen.getByTestId("button").props.children).toBe("16:light");
  });

  test("TabBar applies active weight to the selected tab, resting weight to inactive tabs, and lets an explicit weight win", async () => {
    await render(
      <HoronProvider scheme="light">
        <TabBar
          value="home"
          items={[
            { value: "home", label: "Home", icon: <IconContextProbe label="tab-active" /> },
            { value: "chat", label: "Chat", icon: <IconContextProbe label="tab-rest" /> },
            { value: "me", label: "Me", icon: <IconContextProbe label="tab-explicit" explicitWeight="fill" /> },
          ]}
        />
      </HoronProvider>,
    );

    expect(screen.getByTestId("tab-active").props.children).toBe("22:regular");
    expect(screen.getByTestId("tab-rest").props.children).toBe("22:light");
    expect(screen.getByTestId("tab-explicit").props.children).toBe("22:fill");
  });

  test("HoronGlyph uses the ambient light weight by default instead of Phosphor regular and honors an explicit weight", async () => {
    const { rerender } = await render(
      <HoronProvider scheme="light">
        <HoronGlyph name="search" size={20} />
      </HoronProvider>,
    );
    const defaultTree = JSON.stringify(screen.toJSON());

    await rerender(
      <HoronProvider scheme="light">
        <HoronGlyph name="search" size={20} weight="regular" />
      </HoronProvider>,
    );
    const regularTree = JSON.stringify(screen.toJSON());

    await rerender(
      <HoronProvider scheme="light">
        <HoronGlyph name="search" size={20} weight="light" />
      </HoronProvider>,
    );
    const lightTree = JSON.stringify(screen.toJSON());

    expect(defaultTree).toBe(lightTree);
    expect(defaultTree).not.toBe(regularTree);
  });
});
