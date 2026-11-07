import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { Progress } from "../../src/components/progress";
import { HoronProvider } from "../../src/provider";

/** Reads the fill bar's inline width, which is how the component paints a determinate value. */
const fillWidth = (container: HTMLElement): string | undefined => {
  const fill = container.querySelector<HTMLElement>(".bg-interactive-primary");
  expect(fill).not.toBeNull();
  return fill?.style.width;
};

test("a determinate bar paints the value as a share of min-max", () => {
  const { container } = render(
    <HoronProvider>
      <Progress value={40} aria-label="In progress" />
    </HoronProvider>,
  );
  expect(fillWidth(container)).toBe("40%");
});

test("a value outside min-max is clamped to the track", () => {
  const over = render(
    <HoronProvider>
      <Progress value={140} />
    </HoronProvider>,
  );
  expect(fillWidth(over.container)).toBe("100%");

  const under = render(
    <HoronProvider>
      <Progress value={-20} />
    </HoronProvider>,
  );
  expect(fillWidth(under.container)).toBe("0%");
});

test("a custom range is honoured and a flat range reports nothing instead of dividing by zero", () => {
  const ranged = render(
    <HoronProvider>
      <Progress value={3} min={0} max={4} />
    </HoronProvider>,
  );
  expect(fillWidth(ranged.container)).toBe("75%");

  const flat = render(
    <HoronProvider>
      <Progress value={3} min={5} max={5} />
    </HoronProvider>,
  );
  expect(fillWidth(flat.container)).toBe("0%");
});

test("without a value the bar is indeterminate and animates the sweep instead of a share", () => {
  const { container } = render(
    <HoronProvider>
      <Progress aria-label="Loading" />
    </HoronProvider>,
  );
  const fill = container.querySelector<HTMLElement>(".bg-interactive-primary");
  expect(fill?.style.width).toBe("33.3333%");
  expect(fill?.style.animationName).toBe("sweep");
});

test("the label and spoken value reach the accessibility tree", () => {
  const { container } = render(
    <HoronProvider>
      <Progress value={64} aria-label="Upload" />
    </HoronProvider>,
  );
  const root = container.querySelector('[accessibility-role-description="progressbar"]');
  expect(root).not.toBeNull();
  expect(root?.getAttribute("accessibility-label")).toBe("Upload");
  expect(root?.getAttribute("accessibility-value")).toBe("64%");
});
