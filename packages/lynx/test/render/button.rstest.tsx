import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Button } from "../../src/components/button";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

/** A button wired to a counter, the way a screen counts the action it fires. */
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <view>
      <Button onClick={() => setCount(count + 1)}>Save</Button>
      <text>saved {count}</text>
    </view>
  );
}

test("tapping a Button calls onClick exactly once", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <Counter />
    </HoronProvider>,
  );

  expect(container.textContent).toContain("saved 0");

  const button = container.querySelector(".bg-interactive-primary")!;
  fireEvent.tap(button);
  expect(container.textContent).toContain("saved 1");

  fireEvent.tap(button);
  expect(container.textContent).toContain("saved 2");
});

test("a disabled Button never runs onClick and announces itself as disabled", () => {
  let calls = 0;
  const { container } = render(
    <HoronProvider scheme="light">
      <Button disabled onClick={() => (calls += 1)}>
        Delete bot
      </Button>
    </HoronProvider>,
  );

  expect(container.textContent).toContain("Delete bot");
  const button = container.querySelector(".bg-interactive-primary")!;
  expect(button.getAttribute("accessibility-traits")).toBe("disabled");
  expect(button.className).toContain("opacity-40");

  fireEvent.tap(button);
  expect(calls).toBe(0);
});

test("the link variant is a link, and a leading icon gets the button's rung", () => {
  const { container } = render(
    <HoronProvider scheme="light">
      <view>
        <Button variant="link" aria-current="page">
          Settings
        </Button>
        <Button size="lg" icon={<Icon name="Plus" />}>
          New bot
        </Button>
      </view>
    </HoronProvider>,
  );

  const link = container.querySelector(".rounded-sm")!;
  expect(link.textContent).toContain("Settings");
  expect(link.getAttribute("accessibility-traits")).toBe("link");
  expect(link.getAttribute("accessibility-value")).toBe("current page");

  // React sized the icon through `[&_svg]:size-5` on the lg rung; the Lynx port
  // passes 20px to `<Icon>`, whose wrapper is the sized node.
  const sized = container.querySelector('[style="width: 20px; height: 20px;"]');
  expect(sized).not.toBeNull();
  expect(sized?.querySelector("svg")?.getAttribute("content")).toContain('fill="#ffffff"');
});
