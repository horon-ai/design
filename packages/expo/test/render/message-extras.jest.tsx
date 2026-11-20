import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { Copy, PencilSimple } from "phosphor-react-native";

import { MessageActions } from "../../src/components/message-extras";
import { HoronProvider } from "../../src/provider";

test("each action button is named by its label and fires that action", async () => {
  const onCopy = jest.fn();
  const onEdit = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <MessageActions
        actions={[
          { label: "Copy", icon: <Copy />, onClick: onCopy },
          { label: "Edit", icon: <PencilSimple />, onClick: onEdit },
        ]}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Edit" }));
  expect(onEdit).toHaveBeenCalledTimes(1);
  expect(onCopy).not.toHaveBeenCalled();
});
