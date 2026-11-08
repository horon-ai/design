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
  // Base UI's words for a bar without a value, instead of an empty read-out.
  expect(spoken(container)).toBe("indeterminate progress");
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

/** The text the bar speaks, which is how the formatted and custom value text is observed. */
const spoken = (container: HTMLElement): string | null => {
  const root = container.querySelector('[accessibility-role-description="progressbar"]');
  expect(root).not.toBeNull();
  return root?.getAttribute("accessibility-value") ?? null;
};

test("format speaks the clamped value instead of the share of the range", () => {
  const { container } = render(
    <HoronProvider>
      <Progress value={64} max={200} format={{ style: "decimal", maximumFractionDigits: 0 }} />
    </HoronProvider>,
  );
  // 64 of 0-200 paints and speaks as 32% without `format`; with it the value itself is 64.
  expect(spoken(container)).toBe("64");
});

test("locale reaches the number formatter behind the default percentage", () => {
  const { container } = render(
    <HoronProvider>
      <Progress value={64} max={200} locale="de-DE" />
    </HoronProvider>,
  );
  // 32% of the range in a German locale: a non-breaking space before the sign.
  expect(spoken(container)).toBe("32\u00a0%");
});

test("getAriaValueText builds the spoken value from the formatted text and the raw value", () => {
  const seen: [string, number | null][] = [];
  const { container } = render(
    <HoronProvider>
      <Progress
        value={3}
        max={5}
        getAriaValueText={(text, raw) => {
          seen.push([text, raw]);
          return `${raw} of 5 files`;
        }}
      />
    </HoronProvider>,
  );
  expect(spoken(container)).toBe("3 of 5 files");
  // The formatted text is the default percentage of the range (60%), whatever separator the runtime
  // locale puts before the sign, and the raw value is the prop.
  expect(seen.map(([, raw]) => raw)).toEqual([3]);
  expect(seen[0]?.[0]).toMatch(/^60\s?%$/);
});

test("a caller's inline style reaches the same root that carries the classes", () => {
  const { container } = render(
    <HoronProvider>
      <Progress value={64} style={{ width: "320px" }} />
    </HoronProvider>,
  );
  const root = container.querySelector<HTMLElement>('[accessibility-role-description="progressbar"]');
  expect(root).not.toBeNull();
  expect(root?.style.width).toBe("320px");
});
