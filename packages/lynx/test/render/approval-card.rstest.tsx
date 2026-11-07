import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { ApprovalCard } from "../../src/components/approval-card";
import { HoronProvider } from "../../src/provider";

const buttonByText = (container: HTMLElement, text: string): Element => {
  const found = [...container.querySelectorAll("[accessibility-traits='button']")].find(
    (element) => element.textContent?.trim() === text,
  );
  if (!found) throw new Error(`no button labelled ${text}`);
  return found;
};

test("a pending card fires approve and later, and keeps both actions visible", () => {
  const onApprove = rstest.fn();
  const onLater = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <ApprovalCard
        title="Send the Q3 board deck to the team?"
        attachment="Q3 board deck v5"
        onApprove={onApprove}
        onLater={onLater}
      />
    </HoronProvider>,
  );

  expect(getByText("Needs your yes")).toBeInTheDocument();
  expect(getByText("Send the Q3 board deck to the team?")).toBeInTheDocument();
  expect(getByText("Q3 board deck v5")).toBeInTheDocument();

  fireEvent.tap(buttonByText(container, "Approve"));
  expect(onApprove).toHaveBeenCalledTimes(1);
  expect(onLater).not.toHaveBeenCalled();

  fireEvent.tap(buttonByText(container, "Later"));
  expect(onLater).toHaveBeenCalledTimes(1);
});

test("a settled card hides the actions, so it cannot be answered twice", () => {
  const onApprove = rstest.fn();
  const { getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <ApprovalCard state="approved" title="Ship the release?" onApprove={onApprove} />
    </HoronProvider>,
  );

  expect(getByText("Approved")).toBeInTheDocument();
  expect(queryByText("Approve")).toBeNull();
  expect(queryByText("Later")).toBeNull();
});

test("the status line follows the state and honours a custom status", () => {
  const { getByText, rerender } = render(
    <HoronProvider scheme="light">
      <ApprovalCard state="declined" title="Delete the workspace?" />
    </HoronProvider>,
  );

  expect(getByText("Declined")).toBeInTheDocument();

  rerender(
    <HoronProvider scheme="light">
      <ApprovalCard state="declined" status="Declined · yesterday" title="Delete the workspace?" />
    </HoronProvider>,
  );
  expect(getByText("Declined · yesterday")).toBeInTheDocument();
});

test("the pending rim is drawn and a glass card paints the liquid layer", () => {
  const { container, rerender } = render(
    <HoronProvider scheme="light">
      <ApprovalCard title="Publish the note?" />
    </HoronProvider>,
  );

  expect(container.querySelector(".border-border-brand")).not.toBeNull();
  expect(container.querySelector(".liquid-layers")).toBeNull();

  rerender(
    <HoronProvider scheme="light">
      <ApprovalCard surface="glass" title="Publish the note?" />
    </HoronProvider>,
  );
  expect(container.querySelector(".liquid-layers")).not.toBeNull();

  rerender(
    <HoronProvider scheme="light">
      <ApprovalCard state="approved" title="Publish the note?" />
    </HoronProvider>,
  );
  // Settled: the brand rim is gone, but the card itself is still there.
  expect(container.querySelector(".border-border-brand")).toBeNull();
});
