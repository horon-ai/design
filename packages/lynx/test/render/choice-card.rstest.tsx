import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { ChoiceCard } from "../../src/components/choice-card";
import { HoronProvider } from "../../src/provider";

/** The card announces its state through `accessibility-value`, the closest Lynx gets to `aria-checked`. */
const card = (container: HTMLElement): Element => {
  const found = container.querySelector("[accessibility-role-description='radio']");
  if (!found) throw new Error("no choice card in the tree");
  return found;
};

test("a tap selects an uncontrolled card and reports the pick", async () => {
  const seen: boolean[] = [];
  const { container, findByText } = render(
    <HoronProvider>
      <ChoiceCard value="team" title="Team" description="Shared bots" onCheckedChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );

  await findByText("Team");
  expect(card(container).getAttribute("accessibility-value")).toBe("unselected");

  fireEvent.tap(card(container));
  await Promise.resolve();

  expect(seen).toEqual([true]);
  expect(card(container).getAttribute("accessibility-value")).toBe("selected");
});

test("a controlled card reports the pick without moving on its own", async () => {
  const seen: boolean[] = [];
  const { container, findByText } = render(
    <HoronProvider>
      <ChoiceCard value="solo" title="Solo" checked={false} onCheckedChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );

  await findByText("Solo");
  fireEvent.tap(card(container));
  await Promise.resolve();

  expect(seen).toEqual([true]);
  expect(card(container).getAttribute("accessibility-value")).toBe("unselected");
});

test("a disabled card ignores the tap and keeps its state", async () => {
  const seen: boolean[] = [];
  const { container, findByText } = render(
    <HoronProvider>
      <ChoiceCard value="manual" title="Manual only" disabled onCheckedChange={(next) => seen.push(next)} />
    </HoronProvider>,
  );

  await findByText("Manual only");
  fireEvent.tap(card(container));
  await Promise.resolve();

  expect(seen).toEqual([]);
  expect(card(container).getAttribute("accessibility-value")).toBe("unselected");
  expect(card(container).getAttribute("accessibility-traits")).toBe("disabled");
});

test("a selected card turns its border brand and shows the core dot", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <ChoiceCard value="team" title="Team" badge="Recommended" checked onCheckedChange={() => undefined} />
    </HoronProvider>,
  );

  await findByText("Team");
  expect(container.textContent).toContain("Recommended");
  expect(container.querySelector(".border-border-brand")).not.toBeNull();
  expect(container.querySelector(".bg-interactive-on-primary")).not.toBeNull();
});

test("a passed style reaches the card root", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <ChoiceCard value="styled" title="Styled" style={{ marginTop: "7px" }} />
    </HoronProvider>,
  );

  await findByText("Styled");
  expect(card(container)).toHaveStyle({ marginTop: "7px" });
});
