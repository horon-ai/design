/**
 * A2UI for React Native: `@horon-ai/expo/a2ui`.
 *
 * The React Native counterpart of `@a2ui/react`, on the same `@a2ui/web_core` message processor:
 * agents send A2UI v1.0 messages, the processor keeps surfaces, components and data models, and
 * {@link A2uiSurface} draws each surface with Horon components. User actions come back through the
 * processor's action listener, their context resolved against the data model.
 *
 * - `basicCatalog`: the official A2UI v1.0 basic catalog (same id and schema), drawn with Horon
 *   components.
 * - `horonCatalog`: the basic catalog plus Horon components (Badge, Banner, Chip, EmptyState,
 *   IntegrationRow, Progress).
 * - `createComponentImplementation`: add your own components to a catalog.
 *
 * @example
 * ```tsx
 * import { A2uiSurfaces, createA2uiProcessor, horonCatalog } from "@horon-ai/expo/a2ui";
 *
 * const processor = createA2uiProcessor([horonCatalog], {
 *   onAction: (action) => sendToAgent({ version: "1.0", action }),
 * });
 * processor.processMessages(messagesFromAgent);
 *
 * <A2uiSurfaces processor={processor} />;
 * ```
 *
 * Wrap the tree in `SafeAreaProvider` and `HoronProvider`, as for every `@horon-ai/expo` component.
 *
 * @packageDocumentation
 */
export { readAccessibility, type A2uiAccessibility } from "./runtime/accessibility";
export { createBinderlessComponentImplementation, createComponentImplementation } from "./runtime/adapter";
export { MarkdownComponentContext, type MarkdownComponentProps } from "./runtime/markdown";
export { A2uiSurface, useA2uiSurface, useNodeView, useSignalValue, type NodeViewState } from "./runtime/surface";
export {
  A2uiSurfaces,
  createA2uiProcessor,
  useA2uiSurfaces,
  type A2uiProcessorOptions,
  type A2uiSurfacesProps,
  type NativeMessageProcessor,
} from "./runtime/surfaces";
export type {
  A2uiChildRef,
  NativeA2uiComponentProps,
  NativeCatalogComponent,
  NativeComponentImplementation,
  NativeComponentNode,
  NativeSurfaceModel,
  NodeBuildChild,
  NodeViewProps,
} from "./runtime/types";

export {
  BASIC_CATALOG_ID,
  basicCatalog,
  basicCatalogDocument,
  basicCatalogParts,
  createBasicCatalog,
  implementComponents,
  type BasicCatalogOptions,
  type BasicCatalogParts,
  type ComponentFactory,
} from "./catalogs/basic";
export { createBasicCatalogFunctions, type BasicFunctionOptions } from "./catalogs/basic/functions";
export {
  HORON_CATALOG_ID,
  createHoronCatalog,
  horonCatalog,
  horonCatalogDocument,
  type HoronCatalogOptions,
} from "./catalogs/horon";

export {
  Catalog,
  MessageProcessor,
  STRICT_VALIDATION,
  type ActionListener,
  type ActionPayload,
  type ComponentApi,
} from "@a2ui/web_core";
