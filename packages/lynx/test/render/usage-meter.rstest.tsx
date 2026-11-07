import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { UsageMeter } from "../../src/components/usage-meter";
import { HoronProvider } from "../../src/provider";

/** Reads the fill bar's inline width, which is how the component paints the value. */
const fillWidth = (container: HTMLElement): string | undefined =>
  container.querySelector<HTMLElement>(".bg-sky-500")?.style.width;

test("paints the value as a share of the track and states it in the accessibility tree", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <UsageMeter label="Usage this month" value={64} detail="6,420 of 10,000 tasks" note="Resets Nov 1" />
    </HoronProvider>,
  );

  await findByText("Usage this month");
  expect(fillWidth(container)).toBe("64%");

  const root = container.querySelector('[accessibility-role-description="progressbar"]');
  expect(root?.getAttribute("accessibility-value")).toBe("64%");
  expect(root?.getAttribute("accessibility-label")).toBe("Usage this month");
});

test("a value outside 0-100 is clamped so the fill never leaves the track", () => {
  const over = render(
    <HoronProvider>
      <UsageMeter label="Tasks" value={140} />
    </HoronProvider>,
  );
  expect(fillWidth(over.container)).toBe("100%");

  const under = render(
    <HoronProvider>
      <UsageMeter label="Tasks" value={-20} />
    </HoronProvider>,
  );
  expect(fillWidth(under.container)).toBe("0%");
});

test("without detail or note the caption row is not rendered", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <UsageMeter label="Tasks" value={30} />
    </HoronProvider>,
  );

  await findByText("Tasks");
  // Only the label row and the track carry `text-caption`, so no caption text exists.
  expect(container.querySelectorAll(".text-caption").length).toBe(0);
  expect(container.querySelector(".bg-sky-500")?.getAttribute("style")).toContain("30%");
});
