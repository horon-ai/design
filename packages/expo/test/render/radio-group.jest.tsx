import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { Radio, RadioGroup } from "../../src/components/radio-group";
import { HoronProvider } from "../../src/provider";

test("picking a Radio in a group selects it and clears the previous one", async () => {
  await render(
    <HoronProvider scheme="light">
      <RadioGroup defaultValue="low" aria-label="Priority">
        <Radio value="low" label="Low" />
        <Radio value="high" label="High" />
      </RadioGroup>
    </HoronProvider>,
  );
  expect(screen.getAllByRole("radio")[0].props.accessibilityState).toMatchObject({ checked: true });
  await fireEvent.press(screen.getAllByRole("radio")[1]);
  const [low, high] = screen.getAllByRole("radio");
  expect(high.props.accessibilityState).toMatchObject({ checked: true });
  expect(low.props.accessibilityState).toMatchObject({ checked: false });
});
