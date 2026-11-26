import { Catalog, type ComponentApi, type FunctionImplementation, type JsonSchemaObject } from "@a2ui/web_core";

import { createComponentImplementation } from "../../runtime/adapter";
import type { NativeCatalogComponent } from "../../runtime/types";
import catalogDocument from "./catalog.json";
import { A2uiAudioPlayer, A2uiDivider, A2uiIcon, A2uiImage, A2uiText, A2uiVideo } from "./content";
import { createBasicCatalogFunctions, type BasicFunctionOptions } from "./functions";
import { A2uiButton, A2uiCheckBox, A2uiChoicePicker, A2uiDateTimeInput, A2uiSlider, A2uiTextField } from "./inputs";
import { A2uiCard, A2uiColumn, A2uiList, A2uiModal, A2uiRow, A2uiTabs } from "./layout";

/** The id agents use for the A2UI v1.0 basic catalog. */
export const BASIC_CATALOG_ID = "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json";

/**
 * The basic catalog document, vendored unchanged from `@a2ui/web_core@0.16.1`
 * (`specification/v1_0/catalogs/basic/catalog.json`, Apache-2.0).
 */
export const basicCatalogDocument: JsonSchemaObject = catalogDocument;

/** Builds a catalog entry from the component API its catalog document declares. */
export type ComponentFactory = (api: ComponentApi) => NativeCatalogComponent;

const BASIC_COMPONENTS: Record<string, ComponentFactory> = {
  Text: (api) => createComponentImplementation(api, A2uiText),
  Image: (api) => createComponentImplementation(api, A2uiImage),
  Icon: (api) => createComponentImplementation(api, A2uiIcon),
  Video: (api) => createComponentImplementation(api, A2uiVideo),
  AudioPlayer: (api) => createComponentImplementation(api, A2uiAudioPlayer),
  Row: (api) => createComponentImplementation(api, A2uiRow),
  Column: (api) => createComponentImplementation(api, A2uiColumn),
  List: (api) => createComponentImplementation(api, A2uiList),
  Card: (api) => createComponentImplementation(api, A2uiCard),
  Tabs: (api) => createComponentImplementation(api, A2uiTabs),
  Modal: (api) => createComponentImplementation(api, A2uiModal),
  Divider: (api) => createComponentImplementation(api, A2uiDivider),
  Button: (api) => createComponentImplementation(api, A2uiButton),
  TextField: (api) => createComponentImplementation(api, A2uiTextField),
  CheckBox: (api) => createComponentImplementation(api, A2uiCheckBox),
  ChoicePicker: (api) => createComponentImplementation(api, A2uiChoicePicker),
  Slider: (api) => createComponentImplementation(api, A2uiSlider),
  DateTimeInput: (api) => createComponentImplementation(api, A2uiDateTimeInput),
};

/**
 * Builds the entry of every component API a catalog document declares. A declared component with no
 * factory is an error, so a document and its views cannot drift apart silently.
 */
export function implementComponents(
  apis: ReadonlyMap<string, ComponentApi>,
  factories: Record<string, ComponentFactory>,
): NativeCatalogComponent[] {
  return Array.from(apis.values(), (api) => {
    const factory = factories[api.name];
    if (!factory) throw new Error(`A2UI catalog component '${api.name}' has no React Native view.`);
    return factory(api);
  });
}

/** Options of {@link createBasicCatalog}. */
export type BasicCatalogOptions = BasicFunctionOptions;

/** The parts of the basic catalog another catalog builds on. */
export type BasicCatalogParts = {
  components: NativeCatalogComponent[];
  functions: FunctionImplementation[];
};

/** The basic catalog's components and functions, for a catalog that extends it. */
export function basicCatalogParts(options: BasicCatalogOptions = {}): BasicCatalogParts {
  const document = Catalog.fromJson(basicCatalogDocument);
  return {
    components: implementComponents(document.components, BASIC_COMPONENTS),
    functions: createBasicCatalogFunctions(document.functions, options),
  };
}

/**
 * The A2UI v1.0 basic catalog drawn with Horon components, under the official catalog id, so an
 * agent that targets the basic catalog renders unchanged. `locale` sets the formatting functions.
 */
export function createBasicCatalog(options: BasicCatalogOptions = {}): Catalog<NativeCatalogComponent> {
  const document = Catalog.fromJson(basicCatalogDocument);
  return document.withEntries(
    implementComponents(document.components, BASIC_COMPONENTS),
    createBasicCatalogFunctions(document.functions, options),
  );
}

/** {@link createBasicCatalog} with the default `en-US` formatting. */
export const basicCatalog = createBasicCatalog();
