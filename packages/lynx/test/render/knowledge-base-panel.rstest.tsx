import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, rstest, test } from "@rstest/core";

import { KnowledgeBasePanel } from "../../src/components/knowledge-base-panel";
import { HoronProvider } from "../../src/provider";

/** The pressable node whose own text contains `label`; the tab pills carry a button trait. */
const byText = (container: HTMLElement, label: string): Element => {
  const node = [...container.querySelectorAll("view")].find(
    (element) => element.getAttribute("accessibility-traits") !== null && (element.textContent ?? "").trim() === label,
  );
  if (!node) throw new Error(`no control labelled ${label}`);
  return node;
};

test("a tab tap reports the new id and the tray marks it selected", async () => {
  const onValueChange = rstest.fn();
  const { container } = render(
    <HoronProvider scheme="light">
      <KnowledgeBasePanel
        title="Company knowledge"
        meta="3 sources · 286 chunks"
        tabs={[
          { id: "sources", label: "Sources", count: 3 },
          { id: "retrieval", label: "Test retrieval" },
        ]}
        indexing={2}
        onValueChange={onValueChange}
      />
    </HoronProvider>,
  );

  const retrieval = byText(container, "Test retrieval");
  expect(retrieval.getAttribute("accessibility-value")).toBe("false");

  fireEvent.tap(retrieval);
  await Promise.resolve();

  expect(onValueChange).toHaveBeenCalledWith("retrieval");
  expect(byText(container, "Test retrieval").getAttribute("accessibility-value")).toBe("true");
});

test("an empty knowledge base keeps the header and the tabs without any source row", () => {
  const { getByText, queryByText } = render(
    <HoronProvider scheme="light">
      <KnowledgeBasePanel title="Company knowledge" tabs={[{ id: "all", label: "All", count: 0 }]} />
    </HoronProvider>,
  );

  expect(getByText("Company knowledge")).toBeInTheDocument();
  expect(queryByText("0 indexing")).toBeNull();
  expect(getByText("All")).toBeInTheDocument();
  expect(queryByText(/Uploaded/)).toBeNull();
  expect(queryByText("Drop files here, or browse")).toBeNull();
});

test("without onFiles the dropzone is not drawn, and indexing stays hidden at zero", () => {
  const { container, queryByText } = render(
    <HoronProvider scheme="light">
      <KnowledgeBasePanel title="Company knowledge" tabs={[{ id: "all", label: "All" }]} indexing={0} />
    </HoronProvider>,
  );

  expect(queryByText("Drop files here, or browse")).toBeNull();
  expect(queryByText("0 indexing")).toBeNull();
  expect(container.querySelector("[accessibility-role-description='tablist']")).not.toBeNull();
});
