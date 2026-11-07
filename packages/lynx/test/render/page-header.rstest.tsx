import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { IconButton } from "../../src/components/icon-button";
import { PageHeader } from "../../src/components/page-header";
import { Icon } from "../../src/icons";
import { HoronProvider } from "../../src/provider";

const requireElement = (element: Element | null | undefined): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

test("the back button calls onBack and the actions render beside the title", async () => {
  const onBack = rstest.fn();
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <PageHeader
        title="Routines"
        onBack={onBack}
        actions={<IconButton label="Search" icon={<Icon name="MagnifyingGlass" />} />}
      >
        <view>
          <text>All</text>
        </view>
      </PageHeader>
    </HoronProvider>,
  );

  await findByText("Routines");

  fireEvent.tap(requireElement(container.querySelector('[accessibility-label="Back"]')));

  expect(onBack).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[accessibility-label="Search"]')).not.toBeNull();
  expect(await findByText("All")).toBeInTheDocument();
});

test("without onBack there is no back button and the title keeps its left padding", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <PageHeader title="Sources" />
    </HoronProvider>,
  );

  const title = await findByText("Sources");

  expect(container.querySelector('[accessibility-label="Back"]')).toBeNull();
  expect(title.className).toContain("pl-2");
});

test("a backLabel names the back button and the glass surface keeps the host clipping its rim", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <PageHeader title="Runs" onBack={() => undefined} backLabel="Return" surface="glass" />
    </HoronProvider>,
  );

  await findByText("Runs");

  expect(container.querySelector('[accessibility-label="Return"]')).not.toBeNull();
  expect(container.querySelector(".liquid-layers")).not.toBeNull();
  expect(container.querySelector(".overflow-hidden")).not.toBeNull();
});
