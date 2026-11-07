import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { PlanStep } from "../../src/components/plan-step";
import { HoronProvider } from "../../src/provider";

/**
 * The marker carries no role of its own, so the tests read the row's text and the retry pill:
 * each state is identified by the glyph it draws (a check icon, the step number, `!`, a spinner)
 * and the actions it offers.
 */
const retryPills = (container: HTMLElement): Element[] =>
  [...container.querySelectorAll("[accessibility-traits='button']")].filter((node) =>
    (node.textContent ?? "").includes("Retry from here"),
  );

test("a failed step shows its error line and the retry pill fires the handler", async () => {
  let retried = 0;
  const { container, findByText } = render(
    <HoronProvider>
      <PlanStep status="failed" index={2} title="Build the metrics slide" error="timed out after 30s" onRetry={() => (retried += 1)} />
    </HoronProvider>,
  );

  await findByText("Build the metrics slide");
  expect(container.textContent).toContain("timed out after 30s");

  const [pill] = retryPills(container);
  fireEvent.tap(pill);
  await Promise.resolve();
  expect(retried).toBe(1);
});

test("a pending step shows its number and no error block or retry pill", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <PlanStep status="pending" index={3} title="Write the summary" error="never shown" onRetry={() => undefined} />
    </HoronProvider>,
  );

  await findByText("Write the summary");
  expect(container.textContent).toContain("3");
  expect(container.textContent).not.toContain("never shown");
  expect(retryPills(container)).toEqual([]);
});

test("a done step prints the check glyph and its timing, and a running step spins instead", async () => {
  const done = render(
    <HoronProvider>
      <PlanStep status="done" index={1} title="Read the brief" elapsed="2s" />
    </HoronProvider>,
  );
  await done.findByText("Read the brief");
  expect(done.container.querySelector("svg")).not.toBeNull();
  expect(done.container.textContent).toContain("2s");

  const running = render(
    <HoronProvider>
      <PlanStep status="running" index={2} title="Search the web" elapsed="0.4s" />
    </HoronProvider>,
  );
  await running.findByText("Search the web");
  expect(running.container.querySelector("[accessibility-role-description='progressbar']")).not.toBeNull();
});

test("a pending step hides the timing label even when one is passed", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <PlanStep status="pending" index={4} title="Write the summary" elapsed="9s" />
    </HoronProvider>,
  );

  await findByText("Write the summary");
  expect(container.textContent).not.toContain("9s");
});

test("the rail is drawn under every step except the last one", async () => {
  const withRail = render(
    <HoronProvider>
      <PlanStep status="done" index={1} title="Read the brief" />
    </HoronProvider>,
  );
  await withRail.findByText("Read the brief");
  expect(withRail.container.querySelector(".bg-status-live")).not.toBeNull();

  const last = render(
    <HoronProvider>
      <PlanStep status="done" index={1} title="Read the brief" last />
    </HoronProvider>,
  );
  await last.findByText("Read the brief");
  // The only sky node left is the 24px marker; the rail under it is gone.
  expect(last.container.querySelectorAll(".bg-status-live").length).toBe(1);
});
