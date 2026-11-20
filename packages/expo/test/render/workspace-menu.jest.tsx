import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { WorkspaceMenu } from "../../src/components/workspace-menu";
import { HoronProvider } from "../../src/provider";

const WORKSPACES = [
  { id: "acme", name: "Acme", meta: "12 members" },
  { id: "labs", name: "Labs", meta: "4 members" },
];

/** A controlled workspace switcher, the way a sidebar owns the current workspace. */
function Switcher() {
  const [current, setCurrent] = useState("acme");
  const [created, setCreated] = useState(0);
  const [settings, setSettings] = useState(0);
  return (
    <HoronProvider scheme="light">
      <WorkspaceMenu
        workspaces={WORKSPACES}
        value={current}
        onValueChange={setCurrent}
        onCreate={() => setCreated((count) => count + 1)}
        onSettings={() => setSettings((count) => count + 1)}
        trigger={
          <Text accessible accessibilityRole="button">
            Open workspaces
          </Text>
        }
      />
      <Text>
        {current} created {created} settings {settings}
      </Text>
    </HoronProvider>
  );
}

test("picking a workspace reports its id and the action rows call their own handlers", async () => {
  await render(<Switcher />);
  await fireEvent.press(screen.getByRole("button", { name: "Open workspaces" }));

  await fireEvent.press(screen.getByRole("button", { name: /Labs/ }));
  expect(screen.getByText("labs created 0 settings 0")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Open workspaces" }));
  await fireEvent.press(screen.getByRole("button", { name: "New workspace" }));
  expect(screen.getByText("labs created 1 settings 0")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Open workspaces" }));
  await fireEvent.press(screen.getByRole("button", { name: "Workspace settings" }));
  expect(screen.getByText("labs created 1 settings 1")).toBeTruthy();
});
