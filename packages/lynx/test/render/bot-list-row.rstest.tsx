import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { BotListRow } from "../../src/components/bot-list-row";
import { HoronProvider } from "../../src/provider";

/** The row whose whole text contains `name`; every row carries a button-ish trait. */
const rowByName = (container: HTMLElement, name: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) =>
      element.getAttribute("accessibility-traits") !== null && (element.textContent ?? "").includes(name),
  );
  if (!node) throw new Error(`no row for ${name}`);
  return node;
};

test("tapping a row reports the tap and the selected row announces itself", async () => {
  const onOpen = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <view>
        <BotListRow
          name="Sales Outbound"
          time="8:41 AM"
          preview="Outreach drafts queued for approval."
          live
          selected
          onClick={onOpen}
        />
        <BotListRow name="Inbox Manager" time="7:02 AM" preview="6 emails need you." />
      </view>
    </HoronProvider>,
  );

  expect(getByText("Sales Outbound")).toBeInTheDocument();
  const selected = rowByName(container, "Sales Outbound");
  expect(selected.getAttribute("accessibility-traits")).toBe("selected");
  expect(selected.getAttribute("accessibility-value")).toBe("true");

  fireEvent.tap(rowByName(container, "Sales Outbound"));
  await Promise.resolve();

  expect(onOpen).toHaveBeenCalledTimes(1);
});

test("a row without a handler stays an idle row: the tap does nothing and it never reads as selected", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <BotListRow name="Recruiter" time="Yesterday" preview="Paused. Turn on to resume outreach." />
    </HoronProvider>,
  );

  const row = rowByName(container, "Recruiter");
  expect(row.getAttribute("accessibility-value")).toBe("false");
  expect(row.className).not.toContain("bg-overlay-ink-10");

  expect(() => fireEvent.tap(row)).not.toThrow();
  expect(row.getAttribute("accessibility-value")).toBe("false");
});
