import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { TaskRow } from "../../src/components/task-row";
import { HoronProvider } from "../../src/provider";

/** Narrows a queried control to a node, failing the test instead of asserting a nullable away. */
const need = (node: Element | null): Element => {
  if (!node) throw new Error("expected a control in the render tree");
  return node;
};

/** The action pills and the archive disc are the row's only tappable nodes; they are found by their label. */
const action = (container: HTMLElement, label: string): Element | null =>
  [...container.querySelectorAll("[accessibility-traits='button']")].find(
    (node) => node.getAttribute("accessibility-label") === label || (node.textContent ?? "").trim() === label,
  ) ?? null;

test("a running task offers Cancel and the tap reaches its handler", async () => {
  let cancelled = 0;
  const { container, findByText } = render(
    <HoronProvider>
      <TaskRow
        status="running"
        title="Draft the Q4 launch note"
        bot={{ initial: "H", name: "Horon" }}
        project="Launch"
        message="Writing the second draft"
        onCancel={() => (cancelled += 1)}
      />
    </HoronProvider>,
  );

  await findByText("Draft the Q4 launch note");
  expect(container.querySelector("[accessibility-role-description='progressbar']")).not.toBeNull();
  expect(action(container, "Retry")).toBeNull();

  const cancel = action(container, "Cancel");
  expect(cancel).not.toBeNull();
  fireEvent.tap(need(cancel));
  await Promise.resolve();
  expect(cancelled).toBe(1);
});

test("a failed task shows the error line and retries", async () => {
  let retried = 0;
  const { container, findByText } = render(
    <HoronProvider>
      <TaskRow
        status="failed"
        title="Book interviews"
        bot={{ initial: "R", name: "Recruiter" }}
        message="Failed"
        detail="Google Calendar needs to be reconnected"
        onRetry={() => (retried += 1)}
      />
    </HoronProvider>,
  );

  await findByText("Book interviews");
  expect(container.textContent).toContain("Google Calendar needs to be reconnected");

  fireEvent.tap(need(action(container, "Retry")));
  await Promise.resolve();
  expect(retried).toBe(1);
  expect(action(container, "Cancel")).toBeNull();
});

test("a reviewed task offers Review and Archive, and a done task keeps only Archive", async () => {
  let reviewed = 0;
  const review = render(
    <HoronProvider>
      <TaskRow
        status="review"
        title="Draft replies"
        bot={{ initial: "W", name: "Writer" }}
        message="Ready for review"
        onReview={() => (reviewed += 1)}
      />
    </HoronProvider>,
  );

  await review.findByText("Draft replies");
  fireEvent.tap(need(action(review.container, "Review")));
  await Promise.resolve();
  expect(reviewed).toBe(1);
  expect(action(review.container, "Archive")).not.toBeNull();

  const done = render(
    <HoronProvider>
      <TaskRow status="done" title="Draft replies" bot={{ initial: "W", name: "Writer" }} message="Sent" />
    </HoronProvider>,
  );
  await done.findByText("Draft replies");
  expect(action(done.container, "Review")).toBeNull();
  expect(action(done.container, "Cancel")).toBeNull();
  expect(action(done.container, "Archive")).not.toBeNull();
});

test("the bot tile keeps the caller's fill and turns its initial inverse when one is given", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <TaskRow
        status="done"
        title="Send the deck"
        bot={{ initial: "C", name: "Chief of staff", tileClassName: "bg-sky-700" }}
        message="Sent"
      />
    </HoronProvider>,
  );

  await findByText("Send the deck");
  expect(container.querySelector(".bg-sky-700")).not.toBeNull();
  expect(container.querySelector(".text-text-inverse")).not.toBeNull();
  expect(container.querySelector(".bg-interactive-primary")).toBeNull();
});
