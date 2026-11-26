import { Catalog, type JsonSchemaObject } from "@a2ui/web_core";

import { createComponentImplementation } from "../../runtime/adapter";
import type { NativeCatalogComponent } from "../../runtime/types";
import { basicCatalogParts, implementComponents, type BasicCatalogOptions, type ComponentFactory } from "../basic";
import catalogDocument from "./catalog.json";
import { HoronBadge, HoronBanner, HoronChip, HoronEmptyState, HoronIntegrationRow, HoronProgress } from "./components";

/** The id agents use for the Horon Expo catalog. */
export const HORON_CATALOG_ID = "https://horon.ai/a2ui/catalogs/horon-expo/v1";

/** The Horon components' catalog document (the basic catalog's entries are added at build time). */
export const horonCatalogDocument: JsonSchemaObject = catalogDocument;

const HORON_COMPONENTS: Record<string, ComponentFactory> = {
  Badge: (api) => createComponentImplementation(api, HoronBadge),
  Banner: (api) => createComponentImplementation(api, HoronBanner),
  Chip: (api) => createComponentImplementation(api, HoronChip),
  EmptyState: (api) => createComponentImplementation(api, HoronEmptyState),
  IntegrationRow: (api) => createComponentImplementation(api, HoronIntegrationRow),
  Progress: (api) => createComponentImplementation(api, HoronProgress),
};

/** Options of {@link createHoronCatalog}. */
export type HoronCatalogOptions = BasicCatalogOptions;

/**
 * The Horon Expo catalog: every basic catalog component and function, plus the Horon components
 * Badge, Banner, Chip, EmptyState, IntegrationRow and Progress. `toJson()` gives the combined
 * document an agent needs for this id.
 */
export function createHoronCatalog(options: HoronCatalogOptions = {}): Catalog<NativeCatalogComponent> {
  const document = Catalog.fromJson(horonCatalogDocument);
  const basic = basicCatalogParts(options);
  return new Catalog<NativeCatalogComponent>(
    HORON_CATALOG_ID,
    "1.0",
    [...basic.components, ...implementComponents(document.components, HORON_COMPONENTS)],
    basic.functions,
    { instructions: document.instructions },
  );
}

/** {@link createHoronCatalog} with the default `en-US` formatting. */
export const horonCatalog = createHoronCatalog();
