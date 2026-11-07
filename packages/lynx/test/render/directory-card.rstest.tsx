import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { Icon } from "../../src/icons";
import { DirectoryCard } from "../../src/components/directory-card";
import { HoronProvider } from "../../src/provider";

test("the add button reports the tap and the card keeps its copy", async () => {
  const onAdd = rstest.fn();
  const { container, findByText } = render(
    <HoronProvider scheme="light">
      <DirectoryCard
        icon={<Icon name="Cube" />}
        name="GitHub"
        description="Read issues, open pull requests, and review code."
        onAdd={onAdd}
        addLabel="Connect GitHub"
      />
    </HoronProvider>,
  );

  expect(await findByText("Read issues, open pull requests, and review code.")).toBeInTheDocument();
  const addButton = container.querySelector("[accessibility-label='Connect GitHub']");
  if (!addButton) throw new Error("expected the add button to be rendered");
  fireEvent.tap(addButton);

  expect(onAdd).toHaveBeenCalledTimes(1);
});

test("without onAdd the card draws no button at all", async () => {
  const { container, findByText, queryByText } = render(
    <HoronProvider scheme="light">
      <DirectoryCard icon={<Icon name="Folder" />} name="Local files" description="Files on this device." surface="glass" />
    </HoronProvider>,
  );

  fireEvent.tap(await findByText("Local files"));

  expect(container.querySelector("[accessibility-label='Add']")).toBeNull();
  expect(queryByText("Files on this device.")).toBeInTheDocument();
});
