import { fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { FileText } from "phosphor-react-native";

import { SourceRow } from "../../src/components/source-row";
import { HoronProvider } from "../../src/provider";

test("Retry belongs to a failed row and reports through onRetry", async () => {
  const onRetry = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <SourceRow status="indexing" icon={<FileText />} name="brief.pdf" detail="9 of 12 pages read" progress={12} />
      <SourceRow
        status="failed"
        icon={<FileText />}
        name="broken.pdf"
        detail="Parse failed"
        onRetry={onRetry}
      />
    </HoronProvider>,
  );
  expect(screen.getAllByRole("button", { name: "Retry" })).toHaveLength(1);
  await fireEvent.press(screen.getByRole("button", { name: "Retry" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test("a ready row is announced as ready", async () => {
  await render(
    <HoronProvider scheme="light">
      <SourceRow status="ready" icon={<FileText />} name="tokens.md" detail="8 pages · 32 chunks" />
    </HoronProvider>,
  );
  expect(screen.getByLabelText("Ready")).toBeTruthy();
});
