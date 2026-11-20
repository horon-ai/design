import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { MarketplaceCard } from "../../src/components/marketplace-card";
import { HoronProvider } from "../../src/provider";

test("the Install button reports the install request", async () => {
  const onInstall = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <MarketplaceCard
        initials="GH"
        name="GitHub"
        author="by Horon"
        description="Read repositories and open pull requests."
        score="4.8"
        installs="12k installs"
        onInstall={onInstall}
        installLabel="Add GitHub"
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Add GitHub" }));
  expect(onInstall).toHaveBeenCalledTimes(1);
});

test("a card without onInstall shows no footer action", async () => {
  await render(
    <HoronProvider scheme="light">
      <MarketplaceCard initials="LN" name="Linear" />
    </HoronProvider>,
  );
  expect(screen.queryByRole("button")).toBeNull();
});
