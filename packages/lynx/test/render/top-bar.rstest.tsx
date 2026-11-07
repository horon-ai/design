import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { TopBar } from "../../src/components/top-bar";
import { HoronProvider } from "../../src/provider";

/** The bar announces its two actions by their accessible labels, which is what a screen reader reads. */
const action = (container: HTMLElement, label: string): Element | null => container.querySelector(`[accessibility-label="${label}"]`);

test("the back and overflow buttons fire their own handlers", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <TopBar
        title="Chief of staff"
        subtitle="Online"
        live
        onBack={() => seen.push("back")}
        onMore={() => seen.push("more")}
      />
    </HoronProvider>,
  );

  fireEvent.tap(action(container, "Back")!);
  fireEvent.tap(action(container, "More")!);
  await Promise.resolve();

  expect(seen).toEqual(["back", "more"]);
});

test("the accessible labels follow backLabel and moreLabel", async () => {
  const seen: string[] = [];
  const { container } = render(
    <HoronProvider>
      <TopBar title="Research bot" backLabel="Back to bots" moreLabel="Routine actions" onBack={() => seen.push("back")} onMore={() => seen.push("more")} />
    </HoronProvider>,
  );

  expect(action(container, "Back")).toBeNull();
  fireEvent.tap(action(container, "Back to bots")!);
  fireEvent.tap(action(container, "Routine actions")!);
  await Promise.resolve();

  expect(seen).toEqual(["back", "more"]);
});

test("a read-only bar draws neither action", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <TopBar title="Quarterly planning" />
    </HoronProvider>,
  );

  await findByText("Quarterly planning");
  expect(action(container, "Back")).toBeNull();
  expect(action(container, "More")).toBeNull();
});
