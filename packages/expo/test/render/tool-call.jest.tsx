import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { Globe } from "phosphor-react-native";

import { ToolCall } from "../../src/components/tool-call";
import { HoronProvider } from "../../src/provider";

test("the header expands to the arguments and folds them away again", async () => {
  await render(
    <HoronProvider scheme="light">
      <ToolCall
        status="done"
        tool={{ icon: <Globe />, name: "Web search" }}
        summary="Fetched 8 results"
        args={{ query: "tokens" }}
        result={{ count: 2 }}
      />
    </HoronProvider>,
  );
  expect(screen.queryByText("ARGUMENTS")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { expanded: false }));
  expect(screen.getByText("ARGUMENTS")).toBeTruthy();
  expect(screen.getByText("RESULT")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { expanded: true }));
  expect(screen.queryByText("ARGUMENTS")).toBeNull();
});

test("a failed call offers Retry, which reports the retry without changing the card", async () => {
  const onRetry = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolCall
        status="failed"
        tool={{ icon: <Globe />, name: "Web search" }}
        summary="Could not reach the host"
        error="ENOTFOUND"
        onRetry={onRetry}
        defaultOpen
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Retry" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(screen.getByText("ENOTFOUND")).toBeTruthy();
  expect(screen.queryByText("RESULT")).toBeNull();
});

test("a truncated, finished result shows the Show all link", async () => {
  const onShowAll = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ToolCall
        status="done"
        tool={{ icon: <Globe />, name: "Web search" }}
        summary="Long answer"
        result="first 400 characters"
        truncated
        defaultOpen
        onShowAll={onShowAll}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("link", { name: "Show all" }));
  expect(onShowAll).toHaveBeenCalledTimes(1);
});
