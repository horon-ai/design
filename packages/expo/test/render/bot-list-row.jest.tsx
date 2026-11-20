import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { BotListRow } from "../../src/components/bot-list-row";
import { HoronProvider } from "../../src/provider";

test("pressing a row opens that bot and marks it as the current one", async () => {
  const onPress = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <BotListRow name="Researcher" time="8:41 AM" preview="Pulled the Q3 numbers" selected onPress={onPress} />
    </HoronProvider>,
  );
  const row = screen.getByRole("button", { name: /Researcher/ });
  expect(row.props.accessibilityState).toMatchObject({ selected: true });
  await fireEvent.press(row);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("a disabled row ignores presses and announces itself as disabled", async () => {
  let calls = 0;
  await render(
    <HoronProvider scheme="light">
      <BotListRow name="Archivist" disabled onPress={() => (calls += 1)} />
    </HoronProvider>,
  );
  const row = screen.getByRole("button", { name: "Archivist" });
  expect(row.props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(row);
  expect(calls).toBe(0);
});
