import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { SourceRow } from "../../src/components/source-row";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

/** Narrows a queried control to a node, failing the test instead of asserting a nullable away. */
const need = (node: Element | null): Element => {
  if (!node) throw new Error("expected a control in the render tree");
  return node;
};

/** The retry control is the only tappable node in a source row, so it is found by that trait. */
const retryButton = (container: HTMLElement): Element | null =>
  container.querySelector("[accessibility-traits='button']");

test("a failed source shows the red detail and retries", async () => {
  let retried = 0;
  const { container, findByText } = render(
    <HoronProvider>
      <SourceRow
        status="failed"
        icon={<Icon name="EnvelopeSimple" />}
        name="Investor threads"
        detail="Embedding timed out after 41 of 68 chunks"
        onRetry={() => (retried += 1)}
      />
    </HoronProvider>,
  );

  await findByText("Investor threads");
  expect(container.textContent).toContain("Embedding timed out after 41 of 68 chunks");

  const button = retryButton(container);
  expect(button).not.toBeNull();
  fireEvent.tap(need(button));
  await Promise.resolve();
  expect(retried).toBe(1);
});

test("an indexing source paints the progress share on the active stage bar", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <SourceRow
        status="indexing"
        icon={<Icon name="Globe" />}
        name="help.horon.ai"
        detail="140 of 296 chunks"
        progress={62}
      />
    </HoronProvider>,
  );

  await findByText("help.horon.ai");
  const fill = container.querySelector<HTMLElement>(".bg-status-live");
  expect(fill?.style.width).toBe("62%");
  expect(container.textContent).toContain("62%");
});

test("a ready source shows the check and offers no retry", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <SourceRow status="ready" icon={<Icon name="FileText" />} name="Pricing FAQ.pdf" detail="8 pages" />
    </HoronProvider>,
  );

  await findByText("Pricing FAQ.pdf");
  expect(retryButton(container)).toBeNull();
  expect(container.querySelector("svg")).not.toBeNull();
});

test("explicit stage states override the ones the status implies", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <SourceRow
        status="ready"
        icon={<Icon name="FileText" />}
        name="Pricing FAQ.pdf"
        detail="8 pages"
        progress={25}
        stages={["done", "active", "todo", "todo"]}
      />
    </HoronProvider>,
  );

  await findByText("Pricing FAQ.pdf");
  expect(container.querySelector<HTMLElement>(".bg-status-live")?.style.width).toBe("25%");
  expect(container.querySelectorAll(".bg-overlay-ink-8").length).toBeGreaterThan(0);
});
