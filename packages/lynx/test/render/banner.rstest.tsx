import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Banner } from "../../src/components/banner";
import { HoronProvider } from "../../src/provider";

/** A banner wired to its own dismiss action, the way the gallery shows the interaction. */
function Dismissible() {
  const [open, setOpen] = useState(true);
  return (
    <view>
      {open ? (
        <Banner
          tone="danger"
          action={
            <view bindtap={() => setOpen(false)} accessibility-element accessibility-traits="button">
              <text>Dismiss</text>
            </view>
          }
        >
          Your API key expired.
        </Banner>
      ) : (
        <text>dismissed</text>
      )}
    </view>
  );
}

test("tapping the banner action hides the strip", async () => {
  const { findByText, queryByText } = render(
    <HoronProvider>
      <Dismissible />
    </HoronProvider>,
  );

  const dismiss = await findByText("Dismiss");
  expect(queryByText("Your API key expired.")).not.toBeNull();

  fireEvent.tap(dismiss.parentElement!);

  expect(await findByText("dismissed")).toBeInTheDocument();
  expect(queryByText("Your API key expired.")).toBeNull();
});

test("a banner without an action renders no action slot", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Banner>Inbox Manager is running.</Banner>
    </HoronProvider>,
  );

  await findByText("Inbox Manager is running.");
  // Only the message text exists; no action label was added.
  expect(container.textContent).toBe("Inbox Manager is running.");
  expect(container.querySelector('[accessibility-role-description="status"]')).not.toBeNull();
});

test("the danger tone announces itself as an alert", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <Banner tone="danger">Could not reach Gmail.</Banner>
    </HoronProvider>,
  );

  await findByText("Could not reach Gmail.");
  const strip = container.querySelector('[accessibility-role-description="alert"]');
  expect(strip).not.toBeNull();
});
