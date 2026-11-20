import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { McpServerRow } from "../../src/components/mcp-server-row";
import { HoronProvider } from "../../src/provider";

test("Configure reports the configuration request", async () => {
  const onConfigure = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        description="Read issues and projects."
        meta={["12 tools", "OAuth"]}
        onConfigure={onConfigure}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: /Configure/ }));
  expect(onConfigure).toHaveBeenCalledTimes(1);
});

test("a warning row announces its warning pill colour without an overflow button", async () => {
  await render(
    <HoronProvider scheme="light">
      <McpServerRow name="Figma" statusLabel="Needs attention" statusTone="warning" />
    </HoronProvider>,
  );
  expect(screen.getByText("Needs attention")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "More" })).toBeNull();
});
