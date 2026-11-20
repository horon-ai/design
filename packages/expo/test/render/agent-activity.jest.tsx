import { View } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { ToolStep, WorkLog } from "../../src/components/agent-activity";
import { HoronProvider } from "../../src/provider";

test("pressing a ToolStep opens the call's detail", async () => {
  const open = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolStep state="done" title="Search the web" detail="3 results" onPress={open} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: /Search the web/ }));
  expect(open).toHaveBeenCalledTimes(1);
});

test("a disabled ToolStep ignores presses and announces itself as disabled", async () => {
  const open = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolStep state="done" title="Search the web" onPress={open} disabled />
    </HoronProvider>,
  );
  const row = screen.getByRole("button", { name: /Search the web/ });
  expect(row.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(row);
  expect(open).not.toHaveBeenCalled();
});

test("the WorkLog summary collapses and expands the steps", async () => {
  await render(
    <HoronProvider scheme="light">
      <View>
        <WorkLog
          summary="3 steps"
          steps={[
            { id: "read", title: "Read the sheet", detail: "18 rows" },
            { id: "write", title: "Draft the summary", running: true },
          ]}
        />
      </View>
    </HoronProvider>,
  );
  const summary = screen.getByRole("button", { name: "3 steps" });
  expect(summary.props.accessibilityState).toMatchObject({ expanded: true });
  expect(screen.getByText("Read the sheet")).toBeTruthy();

  await fireEvent.press(summary);
  expect(screen.queryByText("Read the sheet")).toBeNull();
  expect(screen.getByRole("button", { name: "3 steps" }).props.accessibilityState).toMatchObject({ expanded: false });
});
