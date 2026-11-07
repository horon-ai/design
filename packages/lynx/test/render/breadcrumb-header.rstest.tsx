import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { BreadcrumbHeader } from "../../src/components/breadcrumb-header";
import { HoronProvider } from "../../src/provider";

const requireElement = (element: Element | null | undefined): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

const crumbs = [
  { label: "Horon HQ", tile: "H", href: "/" },
  { label: "Q4 hiring", href: "/hiring" },
  { label: "Chief of staff" },
];

test("the search and more buttons call their handlers and the last crumb is the current page", async () => {
  const onSearch = rstest.fn();
  const onMore = rstest.fn();
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <BreadcrumbHeader crumbs={crumbs} onSearch={onSearch} onMore={onMore} />
    </HoronProvider>,
  );

  await findByText("Chief of staff");

  fireEvent.tap(requireElement(container.querySelector('[accessibility-label="Search"]')));
  fireEvent.tap(requireElement(container.querySelector('[accessibility-label="More"]')));

  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onMore).toHaveBeenCalledTimes(1);

  const current = container.querySelector('[accessibility-traits="selected"]');
  expect(current).not.toBeNull();
  expect(current?.textContent).toContain("Chief of staff");
});

test("custom labels name the buttons instead of the defaults", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <BreadcrumbHeader crumbs={crumbs} onSearch={() => undefined} searchLabel="Find" moreLabel="Actions" onMore={() => undefined} />
    </HoronProvider>,
  );

  await findByText("Chief of staff");

  expect(container.querySelector('[accessibility-label="Find"]')).not.toBeNull();
  expect(container.querySelector('[accessibility-label="Actions"]')).not.toBeNull();
  expect(container.querySelector('[accessibility-label="Search"]')).toBeNull();
});

test("without handlers neither icon button is rendered", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <BreadcrumbHeader crumbs={crumbs} />
    </HoronProvider>,
  );

  await findByText("Chief of staff");

  expect(container.querySelector('[accessibility-label="Search"]')).toBeNull();
  expect(container.querySelector('[accessibility-label="More"]')).toBeNull();
  expect(container.querySelectorAll("svg").length).toBe(2);
});
