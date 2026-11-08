import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Icon } from "../../src/icons";
import { MarketplaceCard } from "../../src/components/marketplace-card";
import { HoronProvider } from "../../src/provider";

test("the Install button reports the tap and the card shows its rating, installs and chips", async () => {
  const onInstall = rstest.fn();
  const { findByText, getByText } = render(
    <HoronProvider scheme="light">
      <MarketplaceCard
        initials="AR"
        name="Analytics reports"
        author="by Horon"
        description="Turns raw exports into weekly summaries."
        chips={[{ id: "charts", label: "Charts", icon: <Icon name="ChartBar" weight="fill" /> }]}
        score="4.8"
        installs="12K installs"
        onInstall={onInstall}
      />
    </HoronProvider>,
  );

  expect(await findByText("by Horon")).toBeInTheDocument();
  expect(getByText("Charts")).toBeInTheDocument();
  expect(getByText("4.8")).toBeInTheDocument();
  expect(getByText("12K installs")).toBeInTheDocument();

  fireEvent.tap(await findByText("Install"));
  expect(onInstall).toHaveBeenCalledTimes(1);
});

test("without onInstall the footer draws no button, so tapping the card installs nothing", async () => {
  const { container, findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <MarketplaceCard
        initials="CR"
        name="Code review"
        description="Reads a diff and leaves comments."
        surface="glass"
      />
    </HoronProvider>,
  );

  fireEvent.tap(await findByText("Code review"));

  expect(queryByText("Install")).toBeNull();
  expect(container.textContent).not.toContain("4.8");
  expect(await findByText("Code review")).toBeInTheDocument();
});
