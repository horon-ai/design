import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { PlanCard } from "../../src/components/plan-card";
import { HoronProvider } from "../../src/provider";

test("a running plan shows the label, title, steps and the status footer", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <PlanCard
        label="Plan · 3 steps"
        title="Ship the parser"
        status="running"
        statusLabel="Running · 1 of 3"
        elapsed="0.8s"
      >
        <view>
          <text>Read the spec</text>
        </view>
      </PlanCard>
    </HoronProvider>,
  );

  expect(getByText("Plan · 3 steps")).toBeInTheDocument();
  expect(getByText("Ship the parser")).toBeInTheDocument();
  expect(getByText("Running · 1 of 3")).toBeInTheDocument();
  expect(getByText("0.8s")).toBeInTheDocument();
  expect(getByText("Read the spec")).toBeInTheDocument();

  // The running footer carries the spinner and keeps the primary footer colour.
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".text-text-danger")).toBeNull();
});

test("a failed plan swaps the spinner for a warning and tints the footer danger", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <PlanCard
        label="Plan · 2 steps"
        title="Reply to the thread"
        status="failed"
        statusLabel="Stopped · step 2 failed"
      />
    </HoronProvider>,
  );

  expect(getByText("Stopped · step 2 failed")).toBeInTheDocument();
  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(container.querySelector(".text-text-danger")).not.toBeNull();

  const warning = container.querySelector("svg[content]");
  expect(warning).not.toBeNull();
});

test("without a status the footer is absent, and elapsed is only read with one", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <PlanCard label="Plan · 1 step" title="Read the brief" elapsed="0.2s">
        <view>
          <text>step one</text>
        </view>
      </PlanCard>
    </HoronProvider>,
  );

  expect(getByText("Read the brief")).toBeInTheDocument();
  // No footer divider and no timestamp: the footer only exists while a status is set.
  expect(container.querySelector(".bg-overlay-ink-8")).toBeNull();
  expect(container.textContent).not.toContain("0.2s");
});
