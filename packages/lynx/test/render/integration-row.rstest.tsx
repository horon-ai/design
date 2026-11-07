import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Icon } from "../../src/icons";
import { IntegrationRow, type IntegrationStatus } from "../../src/components/integration-row";
import { HoronProvider } from "../../src/provider";

/** A row wired to its own status, so the tap's effect is observable in the tree. */
function Connectable({ onAction }: { onAction: () => void }) {
  const [status, setStatus] = useState<IntegrationStatus>("not-connected");
  return (
    <IntegrationRow
      icon={<Icon name="Plug" />}
      name="Slack"
      detail={status === "connected" ? "Workspace chat · Read, post" : "Post updates to a channel"}
      status={status}
      onAction={() => {
        onAction();
        setStatus("connected");
      }}
    />
  );
}

test("the Connect button reports the tap and the row swaps to the connected pill", async () => {
  const onAction = rstest.fn();
  const { findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <Connectable onAction={onAction} />
    </HoronProvider>,
  );

  expect(await findByText("Connect")).toBeInTheDocument();
  expect(queryByText("Connected")).toBeNull();

  fireEvent.tap(await findByText("Connect"));

  expect(onAction).toHaveBeenCalledTimes(1);
  expect(await findByText("Connected")).toBeInTheDocument();
  expect(queryByText("Connect")).toBeNull();
  expect(await findByText("Workspace chat · Read, post")).toBeInTheDocument();
});

test("a connected row draws no action, so tapping its pill never reports one", async () => {
  const onAction = rstest.fn();
  const { findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <IntegrationRow
        icon={<Icon name="EnvelopeSimple" />}
        name="Gmail"
        detail="alpoxdev@gmail.com · Read, draft"
        status="connected"
        onAction={onAction}
      />
    </HoronProvider>,
  );

  fireEvent.tap(await findByText("Connected"));

  expect(onAction).not.toHaveBeenCalled();
  expect(queryByText("Connect")).toBeNull();
  expect(queryByText("Reconnect")).toBeNull();
});

test("a reconnect row shows the danger detail and its own button label", async () => {
  const { findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <IntegrationRow
        icon={<Icon name="CalendarBlank" />}
        name="Google Calendar"
        detail="Access expired 2 days ago"
        status="reconnect"
        surface="glass"
      />
    </HoronProvider>,
  );

  expect(await findByText("Reconnect")).toBeInTheDocument();
  expect(await findByText("Access expired 2 days ago")).toBeInTheDocument();
  expect(queryByText("Connected")).toBeNull();
});
