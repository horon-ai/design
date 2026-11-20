import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { beforeEach, expect, jest, test } from "@jest/globals";
import { getDocumentAsync, type DocumentPickerResult } from "expo-document-picker";

import { FileDrop, type FileDropFile } from "../../src/components/file-drop";
import { HoronProvider } from "../../src/provider";

jest.mock("expo-document-picker", () => ({ getDocumentAsync: jest.fn() }));

const picker = jest.mocked(getDocumentAsync);

const asset = (name: string, mimeType: string) => ({
  name,
  mimeType,
  size: 2048,
  uri: `file:///cache/${name}`,
  lastModified: 0,
});

beforeEach(() => {
  picker.mockReset();
});

test("a tap opens the picker and reports the files that match accept", async () => {
  const picked: DocumentPickerResult = {
    canceled: false,
    assets: [asset("contract.pdf", "application/pdf"), asset("notes.txt", "text/plain")],
  };
  picker.mockResolvedValue(picked);
  const reported: FileDropFile[][] = [];
  await render(
    <HoronProvider scheme="light">
      <FileDrop accept=".pdf" multiple onFiles={(files) => reported.push(files)} label="Upload a contract" />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Upload a contract" }));
  await waitFor(() => expect(reported).toHaveLength(1));
  expect(picker).toHaveBeenCalledWith(expect.objectContaining({ multiple: true }));
  expect(reported[0]).toEqual([
    { name: "contract.pdf", size: 2048, type: "application/pdf", uri: "file:///cache/contract.pdf" },
  ]);
});

test("a cancelled pick reports nothing", async () => {
  const cancelled: DocumentPickerResult = { canceled: true, assets: null };
  picker.mockResolvedValue(cancelled);
  const reported: FileDropFile[][] = [];
  await render(
    <HoronProvider scheme="light">
      <FileDrop onFiles={(files) => reported.push(files)} label="Upload a contract" />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Upload a contract" }));
  await waitFor(() => expect(picker).toHaveBeenCalledTimes(1));
  expect(reported).toEqual([]);
});

test("an uploading target opens no picker and announces itself as busy", async () => {
  await render(
    <HoronProvider scheme="light">
      <FileDrop uploading label="Upload a contract" />
    </HoronProvider>,
  );
  const target = screen.getByRole("button", { name: "Upload a contract" });
  expect(target.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
  await fireEvent.press(target);
  expect(picker).not.toHaveBeenCalled();
});
