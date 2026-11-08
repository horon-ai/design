import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { AgentLane } from "../../src/components/agent-lane";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

test("a running lane spins, names its bot and shows the tool and usage lines", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <AgentLane
        status="running"
        bot={{ initial: "R", name: "Researcher" }}
        elapsed="1.9s"
        task="Portfolio metrics"
        tool={{
          icon: <Icon name="MagnifyingGlass" size={14} color="text-secondary" />,
          label: "Notion · Q3 metrics dashboard",
        }}
        usage="2.6k tokens"
      />
    </HoronProvider>,
  );

  expect(getByText("R")).toBeInTheDocument();
  expect(getByText("Researcher")).toBeInTheDocument();
  expect(getByText("1.9s")).toBeInTheDocument();
  expect(getByText("2.6k tokens")).toBeInTheDocument();
  expect(container.querySelector("[accessibility-role-description='progressbar']")).not.toBeNull();
  // The running tile is the sky-400 shade; done and failed step away from it.
  expect(container.querySelector(".bg-sky-400")).not.toBeNull();
});

test("a failed lane paints the danger rim and its output, and drops the spinner", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <AgentLane
        status="failed"
        bot={{ initial: "I", name: "Inbox triage" }}
        task="Collect open investor questions"
        output="Gmail access expired. Reconnect to continue."
      />
    </HoronProvider>,
  );

  expect(container.querySelector(".border-border-danger")).not.toBeNull();
  expect(getByText("Gmail access expired. Reconnect to continue.").className).toContain("text-text-danger");
  expect(container.querySelector("[accessibility-role-description='progressbar']")).toBeNull();
  expect(container.querySelector(".bg-sky-800")).not.toBeNull();
});

test("a done lane draws a check instead of a spinner and leaves out absent slots", () => {
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <AgentLane status="done" bot={{ initial: "W", name: "Writer" }} task="Draft the update" />
    </HoronProvider>,
  );

  expect(getByText("Draft the update")).toBeInTheDocument();
  expect(container.querySelector("svg")).not.toBeNull();
  expect(container.querySelector("[accessibility-role-description='progressbar']")).toBeNull();
  // No elapsed, tool, output or usage was passed, so no text repeats them.
  expect(queryByText("tokens")).toBeNull();
  expect(container.querySelector(".bg-sky-600")).not.toBeNull();
});
