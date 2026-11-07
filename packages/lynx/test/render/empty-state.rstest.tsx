import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { EmptyState } from "../../src/components/empty-state";
import { HoronProvider } from "../../src/provider";

test("renders the heading and the description copy", async () => {
  const { findByText } = render(
    <HoronProvider>
      <EmptyState
        title="Meet your first bot"
        description="Give it a role and a task. It keeps working after you close the laptop."
      />
    </HoronProvider>,
  );

  expect(await findByText("Meet your first bot")).toBeInTheDocument();
  expect(await findByText("Give it a role and a task. It keeps working after you close the laptop.")).toBeInTheDocument();
});

test("the action slot renders only when an action is given", async () => {
  const withAction = render(
    <HoronProvider>
      <EmptyState title="Nothing matches" action={<text>Clear filter</text>} />
    </HoronProvider>,
  );
  expect(await withAction.findByText("Clear filter")).toBeInTheDocument();

  const withoutAction = render(
    <HoronProvider>
      <EmptyState title="Nothing here yet" />
    </HoronProvider>,
  );
  await withoutAction.findByText("Nothing here yet");
  expect(withoutAction.queryByText("Clear filter")).toBeNull();
});

test("the illustration slot is omitted when no illustration is passed", async () => {
  const { container, findByText } = render(
    <HoronProvider>
      <EmptyState title="Nothing here yet" />
    </HoronProvider>,
  );

  await findByText("Nothing here yet");
  expect(container.querySelector(".size-\\[140px\\]")).toBeNull();
});
