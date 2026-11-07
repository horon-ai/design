import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { ToolCall } from "../../src/components/tool-call";
import { HoronProvider } from "../../src/provider";

const tool = { icon: null, name: "Web search" };
const args = { query: "CRM pricing 2026", max_results: 5 };
const result = { hits: 8 };

const trigger = (container: HTMLElement): Element =>
  container.querySelector("[accessibility-value='expanded'], [accessibility-value='collapsed']")!;

test("a closed card hides the arguments and result until the header is tapped", async () => {
  const { container, findByText, queryByText } = render(
    <HoronProvider>
      <ToolCall status="done" tool={tool} summary="Searched the web" args={args} result={result} />
    </HoronProvider>,
  );

  await findByText("Searched the web");
  expect(queryByText("ARGUMENTS")).toBeNull();

  fireEvent.tap(trigger(container));
  await Promise.resolve();

  expect(await findByText("ARGUMENTS")).toBeTruthy();
  expect(queryByText("RESULT")).toBeTruthy();
  expect(container.textContent).toContain('"CRM pricing 2026"');
});

test("defaultOpen starts expanded and a second tap folds the body away again", async () => {
  const { container, findByText, queryByText } = render(
    <HoronProvider>
      <ToolCall status="done" tool={tool} summary="Searched the web" args={args} result={result} defaultOpen />
    </HoronProvider>,
  );

  await findByText("ARGUMENTS");
  expect(trigger(container).getAttribute("accessibility-value")).toBe("expanded");

  fireEvent.tap(trigger(container));
  await Promise.resolve();

  expect(queryByText("ARGUMENTS")).toBeNull();
  expect(trigger(container).getAttribute("accessibility-value")).toBe("collapsed");
});

test("a running call shows the waiting message instead of the result body", async () => {
  const { findByText, queryByText } = render(
    <HoronProvider>
      <ToolCall status="running" tool={tool} summary="Searched the web" defaultOpen />
    </HoronProvider>,
  );

  expect(await findByText("Waiting for result…")).toBeTruthy();
  expect(queryByText("RESULT")).toBeTruthy();
});

test("a failed call replaces the result with the error and reports a retry", async () => {
  let retries = 0;
  const { container, findByText, queryByText } = render(
    <HoronProvider>
      <ToolCall
        status="failed"
        tool={tool}
        summary="Searched the web"
        error="Request timed out after 8s."
        result={result}
        defaultOpen
        onRetry={() => (retries += 1)}
      />
    </HoronProvider>,
  );

  expect(await findByText("Request timed out after 8s.")).toBeTruthy();
  expect(queryByText("RESULT")).toBeNull();
  expect(await findByText("Failed")).toBeTruthy();

  const retry = container.querySelector("[accessibility-label='Retry']");
  expect(retry).not.toBeNull();
  fireEvent.tap(retry!);
  await Promise.resolve();

  expect(retries).toBe(1);
});

test("a failed call without a retry handler shows the error alone", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <ToolCall status="failed" tool={tool} summary="Searched the web" error="Offline." defaultOpen />
    </HoronProvider>,
  );

  await findByText("Offline.");
  expect(container.querySelector("[accessibility-label='Retry']")).toBeNull();
});
