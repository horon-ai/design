import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { AgentPanel, ComposerChip, TaskComposer } from "../../src/components/agent-panel";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

test("the composer chip reports its tap and switches the leading tile by type", () => {
  const onClick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <view>
        <ComposerChip leading="C" onClick={onClick}>
          Chief of staff
        </ComposerChip>
        <ComposerChip leading={<Icon name="Folder" size={14} color="text-secondary" />} tileClassName="bg-sky-500">
          Horon HQ
        </ComposerChip>
      </view>
    </HoronProvider>,
  );

  // A string leading becomes the brand tile; a node leading gets no tile.
  expect(container.querySelector(".bg-interactive-primary")).not.toBeNull();
  expect(container.querySelector(".bg-sky-500")).toBeNull();

  fireEvent.tap(getByText("Chief of staff").parentElement!);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("the composer reports the typed draft and starts from the Start pill", async () => {
  const onValueChange = rstest.fn();
  const onStart = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <TaskComposer onValueChange={onValueChange} onStart={onStart} />
    </HoronProvider>,
  );

  const field = container.querySelector("textarea")!;
  const handler = field.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the composer field");
  handler({ type: "bindEvent:input", detail: { value: "Book the room" } });
  await Promise.resolve();

  expect(onValueChange).toHaveBeenCalledWith("Book the room");
  expect(field.getAttribute("placeholder")).toBe("Describe a task for a bot");

  fireEvent.tap(getByText("Start").parentElement!);
  expect(onStart).toHaveBeenCalledTimes(1);
});

test("the composer's confirm key also starts the task", async () => {
  const onStart = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <TaskComposer onStart={onStart} />
    </HoronProvider>,
  );

  const handler = container.querySelector("textarea")!.eventMap?.["bindEvent:confirm"];
  if (!handler) throw new Error("no bindconfirm handler on the composer field");
  handler({ type: "bindEvent:confirm", detail: { value: "" } });
  await Promise.resolve();

  expect(onStart).toHaveBeenCalledTimes(1);
});

test("the panel draws the filter slot above its children, and omits it when unset", () => {
  const withFilter = render(
    <HoronProvider scheme="light">
      <AgentPanel
        filter={
          <view>
            <text>All</text>
          </view>
        }
      >
        <text>Task composer</text>
      </AgentPanel>
    </HoronProvider>,
  );

  expect(withFilter.getByText("All")).toBeInTheDocument();
  expect(withFilter.getByText("Task composer")).toBeInTheDocument();

  const bare = render(
    <HoronProvider scheme="light">
      <AgentPanel>
        <text>Task composer</text>
      </AgentPanel>
    </HoronProvider>,
  );
  expect(bare.queryByText("All")).toBeNull();
});

test("a disabled chip never reports a tap and announces itself as disabled", () => {
  const onClick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <ComposerChip leading="R" onClick={onClick} disabled>
        Researcher
      </ComposerChip>
    </HoronProvider>,
  );

  fireEvent.tap(getByText("Researcher").parentElement!);
  expect(onClick).not.toHaveBeenCalled();
  expect(container.querySelector("[accessibility-traits='disabled']")).not.toBeNull();
});
