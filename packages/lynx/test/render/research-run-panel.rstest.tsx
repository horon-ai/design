declare global {
  interface Element {
    /** The handlers the Lynx runtime registered for this node, keyed by `eventType:eventName`. */
    eventMap?: Record<string, (event: unknown) => void>;
  }
}

import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import type { ResearchQuery } from "../../src/components/research-run-panel";
import { ResearchRunPanel } from "../../src/components/research-run-panel";
import { HoronProvider } from "../../src/provider";

const liveQueries: ResearchQuery[] = [
  { id: "q1", text: "seed round AI agent startup Korea 2026", results: "16 results" },
  { id: "q2", text: "lead investor agent startup Seoul seed", results: "12 results" },
  { id: "q3", text: "Korean VC portfolio AI agents", results: "9 results" },
  { id: "q4", text: "seed investors AI automation Korea", state: "searching" },
];

/** Calls the bound Lynx input handler with the event shape the engine sends (`detail.value`). */
function typeInto(element: Element, value: string) {
  const handler = element.eventMap?.["bindEvent:input"];
  if (!handler) throw new Error("no bindinput handler on the element");
  handler({ type: "bindEvent:input", detail: { value } });
}

const byLabel = (container: HTMLElement, label: string): Element => {
  const found = container.querySelector(`[accessibility-label='${label}']`);
  if (!found) throw new Error(`no control named ${label}`);
  return found;
};

const field = (container: HTMLElement): Element => {
  const found = container.querySelector("input");
  if (!found) throw new Error("no follow-up field rendered");
  return found;
};

/** The pressable node whose own text contains `text`. */
const byText = (container: HTMLElement, text: string): Element => {
  const found = [...container.querySelectorAll("view")].find(
    (element) =>
      element.getAttribute("accessibility-traits") === "button" && (element.textContent ?? "").includes(text),
  );
  if (!found) throw new Error(`no control containing ${text}`);
  return found;
};

test("a running panel shows the live status line and every query row", async () => {
  const onStop = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <ResearchRunPanel
        question="Which seed investors led AI agent rounds in Korea this year?"
        statusLabel="Reading sources"
        elapsed="12s"
        read={3}
        total={5}
        queries={liveQueries}
        onStop={onStop}
      />
    </HoronProvider>,
  );

  expect(
    getByText("Which seed investors led AI agent rounds in Korea this year?"),
  ).toBeInTheDocument();
  expect(getByText("Reading sources")).toBeInTheDocument();
  // The two meta values are separate text runs joined by a middot.
  expect(container.textContent).toContain("12s");
  expect(container.textContent).toContain("3 of 5 read");
  expect(getByText("seed investors AI automation Korea")).toBeInTheDocument();
  expect(getByText("16 results")).toBeInTheDocument();
  // The status spinner plus the one searching row; the three done rows draw a check instead.
  expect(container.querySelectorAll("[accessibility-role-description='progressbar']").length).toBe(2);

  // The round button stops the run, so a typed follow-up is not submitted.
  const onFollowUp = rstest.fn();
  await act(() => typeInto(field(container), "and the EU?"));
  fireEvent.tap(byLabel(container, "Stop"));
  expect(onStop).toHaveBeenCalledTimes(1);
  expect(onFollowUp).not.toHaveBeenCalled();
});

test("a finished panel folds the status line away and the sources pill submits nothing", async () => {
  const onOpenSources = rstest.fn();
  const onFollowUp = rstest.fn();
  const { container, getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <ResearchRunPanel
        question="Which blur radius keeps text legible?"
        running={false}
        elapsed="41s"
        read={5}
        total={5}
        queries={liveQueries.slice(0, 2)}
        sources={["T", "P", "M", "V", "B"]}
        onOpenSources={onOpenSources}
        onFollowUp={onFollowUp}
      />
    </HoronProvider>,
  );

  // No status block at all once the run is over, and no caret to expand.
  expect(queryByText("Researching")).toBeNull();
  expect(container.querySelectorAll("[accessibility-role-description='status']").length).toBe(0);
  expect(container.querySelectorAll("[accessibility-role-description='progressbar']").length).toBe(0);
  // "5 of 5 sources read" comes from read/total, not from the avatar count.
  expect(getByText("5 of 5 sources read")).toBeInTheDocument();

  // Five stacked avatars, the first flush and the rest pulled 6px left.
  const initials = ["T", "P", "M", "V", "B"].map((initial) => getByText(initial));
  expect(initials[0]?.parentElement?.getAttribute("style") ?? "").not.toContain("margin-left");
  expect(initials[1]?.parentElement?.getAttribute("style")).toContain("margin-left: -6px");

  fireEvent.tap(byText(container, "sources read"));
  expect(onOpenSources).toHaveBeenCalledTimes(1);
  expect(onFollowUp).not.toHaveBeenCalled();

  // The button is a send arrow now, and it reports the raw typed text then empties the field.
  await act(() => typeInto(field(container), "And on OLED?"));
  fireEvent.tap(byLabel(container, "Send"));
  expect(onFollowUp).toHaveBeenCalledWith("And on OLED?");

  fireEvent.tap(byLabel(container, "Send"));
  expect(onFollowUp).toHaveBeenLastCalledWith("");
});

test("a panel with no queries and no sources still renders the question and the field", () => {
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <ResearchRunPanel
        question="Start a run"
        running={false}
        followUpPlaceholder="Ask a follow-up"
      />
    </HoronProvider>,
  );

  expect(getByText("Start a run")).toBeInTheDocument();
  // No rail, because an empty list draws nothing under the question.
  expect(container.querySelector(".bg-overlay-ink-14")).toBeNull();
  // No pill, so no avatar stack and no source count.
  expect(container.querySelector(".bg-sky-700")).toBeNull();
  expect(byLabel(container, "Ask a follow-up")).toBe(field(container));

  const panel = [...container.querySelectorAll("view")].find((element) =>
    element.className.includes("rounded-[24px]"),
  );
  expect(panel?.className).toContain("max-w-[600px]");
  expect(panel?.className).toContain("border-border-default");
});
