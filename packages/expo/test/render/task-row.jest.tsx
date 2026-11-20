import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { HoronProvider } from "../../src/provider";
import { TaskRow } from "../../src/components/task-row";

const bot = { initial: "H", name: "Horon" };

test("a running task offers Cancel and reports it", async () => {
  const cancel = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <TaskRow
        status="running"
        title="Draft the launch note"
        bot={bot}
        message="Writing the second draft"
        onCancel={cancel}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cancel" }));
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Archive" })).toBeNull();
});

test("a failed task offers Retry", async () => {
  const retry = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <TaskRow status="failed" title="Publish the changelog" bot={bot} message="Permission denied" onRetry={retry} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Retry" }));
  expect(retry).toHaveBeenCalledTimes(1);
});

test("a task waiting for a person offers Review and Archive", async () => {
  const review = jest.fn();
  const archive = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <TaskRow
        status="review"
        title="Summarise the metrics"
        bot={bot}
        message="Ready for review"
        onReview={review}
        onArchive={archive}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Review" }));
  await fireEvent.press(screen.getByRole("button", { name: "Archive" }));
  expect(review).toHaveBeenCalledTimes(1);
  expect(archive).toHaveBeenCalledTimes(1);
});

test("the message row announces the task state", async () => {
  await render(
    <HoronProvider scheme="light">
      <TaskRow status="done" title="Sync the calendar" bot={bot} message="Two events moved" onArchive={jest.fn()} />
    </HoronProvider>,
  );
  const message = screen.getByText("Two events moved").parent?.parent;
  expect(message?.props.accessibilityValue).toMatchObject({ text: "Done" });
});
