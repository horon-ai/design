import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, test } from "@jest/globals";

import { InputGroup, InputGroupSegment } from "../../src/components/input-group";
import { HoronProvider } from "../../src/provider";

test("typing into an InputGroup reports the text from its input", async () => {
  const typed: string[] = [];
  await render(
    <HoronProvider scheme="light">
      <InputGroup
        accessibilityLabel="Website"
        prefix={<InputGroupSegment>https://</InputGroupSegment>}
        onChange={(text) => typed.push(text)}
      />
    </HoronProvider>,
  );
  await fireEvent.changeText(screen.getByLabelText("Website"), "horon.ai");
  expect(typed).toEqual(["horon.ai"]);
});

test("a disabled InputGroup announces itself disabled and never reports an edit", async () => {
  const typed: string[] = [];
  await render(
    <HoronProvider scheme="light">
      <InputGroup accessibilityLabel="Website" disabled onChange={(text) => typed.push(text)} />
    </HoronProvider>,
  );
  const input = screen.getByLabelText("Website");
  expect(input.props.editable).toBe(false);
  await fireEvent.changeText(input, "horon.ai");
  expect(typed).toEqual([]);
});
