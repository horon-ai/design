import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { FileDrop, type FileDropFile } from "../../src/components/file-drop";
import { HoronProvider } from "../../src/provider";

/** Narrows a query result for `fireEvent`, which needs a real element. */
const requireElement = (element: Element | null): Element => {
  if (!element) throw new Error("expected the element to be rendered");
  return element;
};

/** What the host's own picker returns; Lynx has no `File`, so these descriptors stand in for one. */
const HOST_FILES: FileDropFile[] = [{ name: "report.pdf", size: 1024, type: "application/pdf", path: "/tmp/report.pdf" }];

/** The target, found through the label it announces. */
const targetOf = (container: HTMLElement, label: string): Element =>
  requireElement(container.querySelector(`[accessibility-label="${label}"]`));

test("a tap asks the host to pick and reports the host's files", () => {
  const onFiles = rstest.fn();
  const onPick = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <FileDrop label="Drop contracts here" files={HOST_FILES} onFiles={onFiles} onPick={onPick} />
    </HoronProvider>,
  );

  fireEvent.tap(targetOf(container, "Drop contracts here"));

  expect(onPick).toHaveBeenCalledTimes(1);
  expect(onFiles).toHaveBeenCalledTimes(1);
  expect(onFiles).toHaveBeenCalledWith(HOST_FILES);
});

test("a disabled target ignores the tap", () => {
  const onFiles = rstest.fn();
  const onPick = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <FileDrop label="Uploads are off" files={HOST_FILES} onFiles={onFiles} onPick={onPick} disabled />
    </HoronProvider>,
  );

  fireEvent.tap(targetOf(container, "Uploads are off"));

  expect(onPick).not.toHaveBeenCalled();
  expect(onFiles).not.toHaveBeenCalled();
  expect(targetOf(container, "Uploads are off").getAttribute("accessibility-traits")).toBe("disabled");
});

test("an uploading target neither reports nor picks, and still shows its label", () => {
  const onFiles = rstest.fn();
  const onPick = rstest.fn();
  const { container, getByText } = render(
    <HoronProvider scheme="light">
      <FileDrop label="Uploading report.pdf" files={HOST_FILES} uploading onFiles={onFiles} onPick={onPick} />
    </HoronProvider>,
  );

  fireEvent.tap(targetOf(container, "Uploading report.pdf"));

  expect(onPick).not.toHaveBeenCalled();
  expect(onFiles).not.toHaveBeenCalled();
  expect(getByText("Uploading report.pdf")).toBeInTheDocument();
  expect(targetOf(container, "Uploading report.pdf").getAttribute("accessibility-value")).toBe("busy");
});

test("a rejected target repaints its rim but still reports the retry", () => {
  const onFiles = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <FileDrop label="Try another file" files={HOST_FILES} rejected onFiles={onFiles} />
    </HoronProvider>,
  );

  const target = targetOf(container, "Try another file");
  expect(target.getAttribute("class")).toContain("border-border-danger");

  fireEvent.tap(target);
  expect(onFiles).toHaveBeenCalledWith(HOST_FILES);
});
