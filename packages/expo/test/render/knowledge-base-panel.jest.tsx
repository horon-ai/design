import { useState } from "react";
import { Text } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { getDocumentAsync, type DocumentPickerResult } from "expo-document-picker";

import { KnowledgeBasePanel } from "../../src/components/knowledge-base-panel";
import { HoronProvider } from "../../src/provider";

jest.mock("expo-document-picker", () => ({ getDocumentAsync: jest.fn() }));

/** A screen that owns the tab selection, the way a knowledge base view does. */
function Controlled({ onValueChange }: { onValueChange: (id: string) => void }) {
  const [tab, setTab] = useState("all");
  return (
    <KnowledgeBasePanel
      title="Knowledge base"
      tabs={[
        { id: "all", label: "All", count: 3 },
        { id: "documents", label: "Documents", count: 2 },
      ]}
      value={tab}
      onValueChange={(id) => {
        setTab(id);
        onValueChange(id);
      }}
    >
      <Text>rows for {tab}</Text>
    </KnowledgeBasePanel>
  );
}

test("a source tab reports its id and the caller's selection drives the list", async () => {
  const onValueChange = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <Controlled onValueChange={onValueChange} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("tab", { name: /Documents/ }));
  expect(onValueChange).toHaveBeenCalledWith("documents");
  expect(screen.getByText("rows for documents")).toBeTruthy();
});

test("the add-source and settings buttons always report", async () => {
  const onAddSource = jest.fn();
  const onSettings = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <KnowledgeBasePanel
        title="Knowledge base"
        tabs={[{ id: "all", label: "All" }]}
        onAddSource={onAddSource}
        onSettings={onSettings}
      />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Knowledge base settings" }));
  await fireEvent.press(screen.getByRole("button", { name: /Add source/ }));
  expect(onSettings).toHaveBeenCalledTimes(1);
  expect(onAddSource).toHaveBeenCalledTimes(1);
});

test("tapping the dropzone picks several files and hands them to onFiles", async () => {
  const picked: DocumentPickerResult = {
    canceled: false,
    assets: [
      { name: "handbook.pdf", mimeType: "application/pdf", size: 10, uri: "file:///cache/handbook.pdf", lastModified: 0 },
    ],
  };
  jest.mocked(getDocumentAsync).mockResolvedValue(picked);
  const onFiles = jest.fn();
  await render(
    <HoronProvider scheme="light">
      <KnowledgeBasePanel title="Knowledge base" tabs={[]} onFiles={onFiles} />
    </HoronProvider>,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Drop files here, or browse" }));
  await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
  expect(getDocumentAsync).toHaveBeenCalledWith(expect.objectContaining({ multiple: true }));
  expect(onFiles).toHaveBeenCalledWith([
    { name: "handbook.pdf", size: 10, type: "application/pdf", uri: "file:///cache/handbook.pdf" },
  ]);
});
