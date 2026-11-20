import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { SlackLogo } from "phosphor-react-native";

import { IntegrationRow } from "../../src/components/integration-row";
import { HoronProvider } from "../../src/provider";

test("a reconnect row reports the reconnect request", async () => {
  const onAction = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <IntegrationRow
        icon={<SlackLogo />}
        name="Slack"
        detail="horon.slack.com · 4 scopes"
        status="reconnect"
        onAction={onAction}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Reconnect" }));
  expect(onAction).toHaveBeenCalledTimes(1);
});

test("a connected row shows its status pill and no action button", async () => {
  await render(
    <HoronProvider scheme="light">
      <IntegrationRow icon={<SlackLogo />} name="Slack" status="connected" onAction={() => undefined} />
    </HoronProvider>,
  );
  expect(screen.getByText("Connected")).toBeTruthy();
  expect(screen.queryByRole("button")).toBeNull();
});

test("a not-connected row offers Connect", async () => {
  const onAction = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <IntegrationRow icon={<SlackLogo />} name="Slack" status="not-connected" connectLabel="Link Slack" onAction={onAction} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Link Slack" }));
  expect(onAction).toHaveBeenCalledTimes(1);
});
