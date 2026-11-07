import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { CodeKey, CodePanel } from "../../src/components/code-panel";
import { HoronProvider } from "../../src/provider";

test("renders the code as pre text inside a horizontal scroller", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <CodePanel>{"---\ntitle: Weekly digest\n---"}</CodePanel>
    </HoronProvider>,
  );

  const code = await findByText((_, element) => element?.className.includes("whitespace-pre") ?? false);
  expect(code.textContent).toContain("title: Weekly digest");

  const scroller = container.querySelector("scroll-view") ?? container.querySelector(".overflow-hidden");
  expect(scroller).not.toBeNull();
});

test("the code surface keeps the mono type and hairline border", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <CodePanel>key: value</CodePanel>
    </HoronProvider>,
  );

  await findByText("key: value");
  expect(container.querySelector(".font-mono")).not.toBeNull();
  expect(container.querySelector(".border-border-default")).not.toBeNull();
});

test("a CodeKey tints only the token it wraps", async () => {
  const { findByText } = render(
    <HoronProvider>
      <CodePanel>
        <CodeKey>name:</CodeKey>
        {" weekly-investor-update"}
      </CodePanel>
    </HoronProvider>,
  );

  const key = await findByText("name:");
  expect(key.getAttribute("class")).toContain("text-syntax-key");
});

test("the copy action follows the engine's clipboard support", async () => {
  const { queryByText } = render(
    <HoronProvider>
      <CodePanel copyText="key: value">key: value</CodePanel>
    </HoronProvider>,
  );

  // jsdom may expose navigator.clipboard; when it does not, the action must be absent
  // rather than a button that does nothing.
  const supported = typeof navigator?.clipboard?.writeText === "function";
  expect(queryByText("Copy") !== null).toBe(supported);
});
