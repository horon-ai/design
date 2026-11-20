import { fireEvent, render, screen, within } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { ToolPermissions } from "../../src/components/tool-permissions";
import { HoronProvider } from "../../src/provider";

/** The two tools the tests read back from `onValuesChange`. */
const TOOLS = [{ name: "web_search", description: "Read public pages" }, { name: "shell" }];

test("picking one permission reports the whole map for every tool", async () => {
  const onValuesChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolPermissions title="Tool access" tools={TOOLS} onValuesChange={onValuesChange} />
    </HoronProvider>,
  );
  const shell = screen.getByLabelText("shell permission");
  await fireEvent.press(within(shell).getByRole("tab", { name: "Allow" }));
  expect(onValuesChange).toHaveBeenCalledWith({ web_search: "ask", shell: "allow" });
});

test("Allow all sets every tool to allow", async () => {
  const onValuesChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolPermissions title="Tool access" tools={TOOLS} onValuesChange={onValuesChange} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Allow all" }));
  expect(onValuesChange).toHaveBeenCalledWith({ web_search: "allow", shell: "allow" });
});

test("a controlled values map wins over the internal copy", async () => {
  const onValuesChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolPermissions
        title="Tool access"
        tools={TOOLS}
        values={{ web_search: "ask", shell: "off" }}
        onValuesChange={onValuesChange}
      />
    </HoronProvider>,
  );
  const shell = screen.getByLabelText("shell permission");
  expect(within(shell).getByRole("tab", { name: "Off" }).props.accessibilityState).toMatchObject({
    selected: true,
  });
  await fireEvent.press(within(shell).getByRole("tab", { name: "Allow" }));
  expect(onValuesChange).toHaveBeenCalledWith({ web_search: "ask", shell: "allow" });
  expect(within(shell).getByRole("tab", { name: "Off" }).props.accessibilityState).toMatchObject({
    selected: true,
  });
});
