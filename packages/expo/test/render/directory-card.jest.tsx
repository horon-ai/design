import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { Folder } from "phosphor-react-native";

import { DirectoryCard } from "../../src/components/directory-card";
import { HoronProvider } from "../../src/provider";

test("the add button reports the picker request under its accessible name", async () => {
  const onAdd = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <DirectoryCard
        icon={<Folder />}
        name="Product"
        description="Specs, research and launch notes."
        onAdd={onAdd}
        addLabel="Connect folder"
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Connect folder" }));
  expect(onAdd).toHaveBeenCalledTimes(1);
});

test("a card without onAdd shows no button", async () => {
  await render(
    <HoronProvider scheme="light">
      <DirectoryCard icon={<Folder />} name="Product" />
    </HoronProvider>,
  );
  expect(screen.queryByRole("button")).toBeNull();
});
