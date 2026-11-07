import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Attachment, CodeBlock, DateSeparator, MessageActions } from "../../src/components/message-extras";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

test("a message action pill reports the tapped label and marks itself as a toolbar", () => {
  const onCopy = rstest.fn();
  const onMore = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <MessageActions
        actions={[
          { label: "Copy", icon: <Icon name="Copy" />, onClick: onCopy },
          { label: "More", icon: <Icon name="DotsThree" />, onClick: onMore },
        ]}
      />
    </HoronProvider>,
  );

  expect(container.querySelector(".rounded-full")?.getAttribute("accessibility-role-description")).toBe("toolbar");

  fireEvent.tap(container.querySelector("[accessibility-label='Copy']")!);
  expect(onCopy).toHaveBeenCalledTimes(1);
  expect(onMore).not.toHaveBeenCalled();

  // Each button in the pill is 30px with its own accessible name.
  expect(container.querySelector("[accessibility-label='More']")?.className).toContain("size-[30px]");
});

test("the date separator draws its caption between two rules", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <DateSeparator>Today</DateSeparator>
    </HoronProvider>,
  );

  expect(getByText("Today")).toBeInTheDocument();
  expect(container.querySelectorAll(".bg-overlay-ink-10").length).toBe(2);
});

test("an attachment reports its remove tap and drops the button when it cannot be removed", () => {
  const onRemove = rstest.fn();
  const { container, getByText, rerender } = render(
    <HoronProvider scheme="light">
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={onRemove} />
    </HoronProvider>,
  );

  expect(getByText("PDF · 2.4 MB")).toBeInTheDocument();
  fireEvent.tap(container.querySelector("[accessibility-label='Remove']")!);
  expect(onRemove).toHaveBeenCalledTimes(1);

  rerender(
    <HoronProvider scheme="light">
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" />
    </HoronProvider>,
  );
  // Without onRemove there is no remove button rather than a dead one.
  expect(container.querySelector("[accessibility-label='Remove']")).toBeNull();
});

test("a thumbnail attachment draws the picture instead of the document tile", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Attachment name="chart.png" thumbnail="https://example.test/chart.png" />
    </HoronProvider>,
  );

  const image = container.querySelector("image");
  expect(image).not.toBeNull();
  expect(image?.getAttribute("src")).toBe("https://example.test/chart.png");
  expect(image?.getAttribute("mode") ?? "").toContain("aspectFill");
});

test("the code block keeps the code verbatim and shows the copy label", async () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <CodeBlock language="bash" code={"horon routine run weekly-report \\\n  --to alpoxdev@gmail.com"} />
    </HoronProvider>,
  );

  expect(getByText("bash")).toBeInTheDocument();
  const code = container.querySelector(".whitespace-pre");
  expect(code?.textContent).toContain("horon routine run weekly-report");
  expect(code?.textContent).toContain("--to alpoxdev@gmail.com");

  // The copy affordance is part of the frame and keeps its resting label.
  expect(getByText("Copy")).toBeInTheDocument();
});
