import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { ChoiceCard } from "../../src/components/choice-card";
import { RadioGroup } from "../../src/components/radio-group";
import { HoronProvider } from "../../src/provider";

test("picking a ChoiceCard selects it inside its RadioGroup", async () => {
  await render(
    <HoronProvider scheme="light">
      <RadioGroup defaultValue="solo" aria-label="Plan">
        <ChoiceCard value="solo" title="Solo" description="One workspace." />
        <ChoiceCard value="team" title="Team" description="Shared bots." />
      </RadioGroup>
    </HoronProvider>,
  );
  expect(screen.getAllByRole("radio")[0].props.accessibilityState).toMatchObject({ checked: true });
  await fireEvent.press(screen.getAllByRole("radio")[1]);
  const [solo, team] = screen.getAllByRole("radio");
  expect(team.props.accessibilityState).toMatchObject({ checked: true });
  expect(solo.props.accessibilityState).toMatchObject({ checked: false });
});
