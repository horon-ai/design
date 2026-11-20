import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";

import { ApprovalCard } from "../../src/components/approval-card";
import { HoronProvider } from "../../src/provider";

test("a pending card reports Approve and Later separately", async () => {
  const onApprove = jest.fn();
  const onLater = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ApprovalCard title="Send the Q3 deck?" onApprove={onApprove} onLater={onLater} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Approve" }));
  await fireEvent.press(screen.getByRole("button", { name: "Later" }));
  expect(onApprove).toHaveBeenCalledTimes(1);
  expect(onLater).toHaveBeenCalledTimes(1);
});

test("a settled card drops its actions so it cannot be answered twice", async () => {
  const onApprove = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <ApprovalCard state="approved" title="Send the Q3 deck?" onApprove={onApprove} />
    </HoronProvider>,
  );
  expect(screen.getByText("Approved")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Later" })).toBeNull();
});
