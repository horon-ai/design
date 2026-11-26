import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { expect, jest, test } from "@jest/globals";
import { Linking } from "react-native";

import {
  A2uiSurfaces,
  BASIC_CATALOG_ID,
  HORON_CATALOG_ID,
  basicCatalog,
  createA2uiProcessor,
  createBasicCatalog,
  horonCatalog,
  type ActionPayload,
  type NativeMessageProcessor,
} from "../../src/a2ui";
import type { ProcessableMessagePayload } from "@a2ui/web_core";
import { HoronProvider } from "../../src/provider";

/** Messages as an agent sends them: JSON text over the transport, parsed on arrival. */
function wire(messages: unknown[]): ProcessableMessagePayload {
  const parsed: ProcessableMessagePayload = JSON.parse(JSON.stringify(messages));
  return parsed;
}

function surface(catalogId: string, components: unknown[], value?: Record<string, unknown>) {
  return wire([
    { version: "1.0", createSurface: { surfaceId: "s", catalogId } },
    { version: "1.0", updateComponents: { surfaceId: "s", components } },
    ...(value ? [{ version: "1.0", updateDataModel: { surfaceId: "s", path: "/", value } }] : []),
  ]);
}

async function show(processor: NativeMessageProcessor) {
  await render(
    <HoronProvider scheme="light">
      <A2uiSurfaces processor={processor} />
    </HoronProvider>,
  );
}

test("a button press sends its action with the context resolved from the data model", async () => {
  const actions: ActionPayload[] = [];
  const processor = createA2uiProcessor([basicCatalog], { onAction: (action) => void actions.push(action) });
  processor.processMessages(
    surface(
      BASIC_CATALOG_ID,
      [
        { id: "root", component: "Column", children: ["summary", "confirm"] },
        { id: "summary", component: "Text", text: { "@path": "/summary" } },
        {
          id: "confirm",
          component: "Button",
          variant: "primary",
          child: "confirmLabel",
          action: { event: { name: "confirm_order", context: { orderId: { "@path": "/orderId" } } } },
        },
        { id: "confirmLabel", component: "Text", text: "Confirm order" },
      ],
      { orderId: "ORD-4821", summary: "2 items ready" },
    ),
  );
  await show(processor);

  expect(screen.getByText("2 items ready")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Confirm order" }));
  expect(actions).toHaveLength(1);
  expect(actions[0]).toMatchObject({
    name: "confirm_order",
    surfaceId: "s",
    sourceComponentId: "confirm",
    context: { orderId: "ORD-4821" },
  });
});

test("typing in a text field writes the data model that bound text and formatString read", async () => {
  const processor = createA2uiProcessor([basicCatalog]);
  processor.processMessages(
    surface(
      BASIC_CATALOG_ID,
      [
        { id: "root", component: "Column", children: ["name", "greeting"] },
        { id: "name", component: "TextField", label: "Name", value: { "@path": "/name" } },
        { id: "greeting", component: "Text", text: { "@call": "formatString", args: { value: "Hello, ${/name}!" } } },
      ],
      { name: "" },
    ),
  );
  await show(processor);

  await fireEvent.changeText(screen.getByLabelText("Name"), "Mina");
  expect(screen.getByText("Hello, Mina!")).toBeTruthy();
});

test("a failing email check shows its message once the user edits the field", async () => {
  const processor = createA2uiProcessor([basicCatalog]);
  processor.processMessages(
    surface(
      BASIC_CATALOG_ID,
      [
        {
          id: "root",
          component: "TextField",
          label: "Email",
          value: { "@path": "/email" },
          checks: [
            { condition: { "@call": "email", args: { value: { "@path": "/email" } } }, message: "Enter a valid email" },
          ],
        },
      ],
      { email: "" },
    ),
  );
  await show(processor);

  expect(screen.queryByText("Enter a valid email")).toBeNull();
  await fireEvent.changeText(screen.getByLabelText("Email"), "mina@");
  expect(screen.getByText("Enter a valid email")).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText("Email"), "mina@horon.ai");
  expect(screen.queryByText("Enter a valid email")).toBeNull();
});

test("a template list renders one child per data item and follows data model updates", async () => {
  const processor = createA2uiProcessor([basicCatalog]);
  processor.processMessages(
    surface(
      BASIC_CATALOG_ID,
      [
        { id: "root", component: "List", children: { componentId: "item", path: "/items" } },
        { id: "item", component: "Text", text: { "@path": "name" } },
      ],
      { items: [{ name: "Standup" }, { name: "Review" }] },
    ),
  );
  await show(processor);

  expect(screen.getByText("Standup")).toBeTruthy();
  expect(screen.getByText("Review")).toBeTruthy();
  await act(async () => {
    processor.processMessages(
      wire([{ version: "1.0", updateDataModel: { surfaceId: "s", path: "/items", value: [{ name: "Retro" }] } }]),
    );
  });
  expect(screen.getByText("Retro")).toBeTruthy();
  expect(screen.queryByText("Standup")).toBeNull();
});

test("the Horon catalog renders its components next to basic ones, and deleteSurface removes the surface", async () => {
  const processor = createA2uiProcessor([horonCatalog]);
  processor.processMessages(
    surface(HORON_CATALOG_ID, [
      { id: "root", component: "Row", children: ["title", "status"] },
      { id: "title", component: "Text", text: "Sync" },
      { id: "status", component: "Badge", label: "Live", tone: "brand" },
    ]),
  );
  await show(processor);

  expect(screen.getByText("Live")).toBeTruthy();
  expect(screen.getByText("Sync")).toBeTruthy();
  await act(async () => {
    processor.processMessages(wire([{ version: "1.0", deleteSurface: { surfaceId: "s" } }]));
  });
  expect(screen.queryByText("Live")).toBeNull();
});

function openUrlButton(id: string, url: string) {
  return {
    id,
    component: "Button",
    child: `${id}Label`,
    action: { functionCall: { "@call": "openUrl", args: { url } } },
  };
}

test("openUrl opens web links and refuses other schemes", async () => {
  const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
  const processor = createA2uiProcessor([basicCatalog]);
  processor.processMessages(
    surface(BASIC_CATALOG_ID, [
      { id: "root", component: "Row", children: ["safe", "unsafe"] },
      openUrlButton("safe", "https://horon.ai/docs"),
      { id: "safeLabel", component: "Text", text: "Docs" },
      openUrlButton("unsafe", "javascript:alert(1)"),
      { id: "unsafeLabel", component: "Text", text: "Script" },
    ]),
  );
  await show(processor);

  await fireEvent.press(screen.getByRole("button", { name: "Docs" }));
  await fireEvent.press(screen.getByRole("button", { name: "Script" }));
  expect(openURL.mock.calls).toEqual([["https://horon.ai/docs"]]);
  openURL.mockRestore();
});

test("the basic catalog builds and pluralizes on Hermes, which has no Intl.PluralRules", async () => {
  const pluralRules = Intl.PluralRules;
  Reflect.deleteProperty(Intl, "PluralRules");
  try {
    const processor = createA2uiProcessor([createBasicCatalog({ locale: "ko-KR" })]);
    processor.processMessages(
      surface(BASIC_CATALOG_ID, [
        { id: "root", component: "Column", children: ["one", "many"] },
        {
          id: "one",
          component: "Text",
          text: { "@call": "pluralize", args: { value: 1, one: "1 file", other: "files" } },
        },
        {
          id: "many",
          component: "Text",
          text: { "@call": "pluralize", args: { value: 3, one: "1 file", other: "3 files" } },
        },
      ]),
    );
    await show(processor);
    expect(screen.getByText("1 file")).toBeTruthy();
    expect(screen.getByText("3 files")).toBeTruthy();
  } finally {
    Object.defineProperty(Intl, "PluralRules", { value: pluralRules, writable: true, configurable: true });
  }
});
