import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { MenuItem, MenuSeparator } from "../../src/components/menu";
import { McpServerRow } from "../../src/components/mcp-server-row";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

const renderRow = (onConfigure = rstest.fn(), onSelect = rstest.fn(), withMenu = true) =>
  render(
    <HoronProvider scheme="light">
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        brandTags={["All devices"]}
        description="Read and update issues, projects and cycles."
        meta={["12 tools", "Last used today"]}
        onConfigure={onConfigure}
        menu={
          withMenu ? (
            <view>
              <MenuItem onClick={() => onSelect("tools")}>View tools</MenuItem>
              <MenuSeparator />
              <MenuItem danger onClick={() => onSelect("remove")}>
                Remove
              </MenuItem>
            </view>
          ) : undefined
        }
      />
    </HoronProvider>,
  );

test("Configure reports the tap and an overflow item reports its own action", async () => {
  const onConfigure = rstest.fn();
  const onSelect = rstest.fn();
  const { container, findByText, getByText, queryByText } = renderRow(onConfigure, onSelect);

  fireEvent.tap(await findByText("Configure"));
  expect(onConfigure).toHaveBeenCalledTimes(1);

  const trigger = requireElement(requireElement(container.querySelector("[accessibility-label='More']")).parentElement);
  fireEvent.layoutchange(trigger, { detail: { left: 8, top: 8, width: 32, height: 32 } });
  fireEvent.tap(trigger);

  expect(await findByText("View tools")).toBeInTheDocument();
  fireEvent.tap(getByText("View tools"));

  expect(onSelect).toHaveBeenCalledWith("tools");
  expect(queryByText("View tools")).toBeNull();
});

test("without a menu the row draws no overflow button and Configure stays inert without a handler", async () => {
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <McpServerRow name="Sentry" statusLabel="Needs auth" statusTone="warning" />
    </HoronProvider>,
  );

  expect(await findByText("Needs auth")).toBeInTheDocument();
  expect(container.querySelector("[accessibility-label='More']")).toBeNull();

  fireEvent.tap(await findByText("Configure"));
  expect(container.textContent).toContain("Sentry");
});
