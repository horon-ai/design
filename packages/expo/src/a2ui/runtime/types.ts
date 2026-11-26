import type { ComponentApi, ComponentNode, SurfaceModel } from "@a2ui/web_core";
import type { FC, ReactNode } from "react";

/**
 * Renders a resolved child node, or a child component id (optionally at another data path).
 *
 * The same contract as `@a2ui/react`'s `NodeBuildChild`: an id that has no node at the requested
 * path reports `UNRESOLVED_CHILD_REFERENCE` to the agent and renders nothing.
 */
export type NodeBuildChild = (child: ComponentNode<NativeCatalogComponent> | string, basePath?: string) => ReactNode;

/** What a catalog entry's `view` receives from the surface. */
export type NodeViewProps = {
  node: ComponentNode<NativeCatalogComponent>;
  buildChild: NodeBuildChild;
};

/**
 * A catalog entry implemented with React Native views. The surface renders it through `view`; the
 * API fields (`name`, `schema`, `allowedParents`, `allowedChildren`) are the ones the
 * `MessageProcessor` validates payloads against.
 */
export interface NativeComponentImplementation extends ComponentApi {
  view: FC<NodeViewProps>;
}

/** Any entry a React Native catalog holds. */
export type NativeCatalogComponent = NativeComponentImplementation;

/** A surface whose catalogs hold React Native entries. */
export type NativeSurfaceModel = SurfaceModel<NativeCatalogComponent>;

/** A resolved node of a React Native surface. */
export type NativeComponentNode = ComponentNode<NativeCatalogComponent>;

/**
 * A child reference in view props: the id of a child component, or the id and the data path of a
 * template instance that resolved below another path.
 */
export type A2uiChildRef = string | { id: string; basePath: string };

/** What {@link createComponentImplementation} hands a presentational component. */
export type NativeA2uiComponentProps<P = Record<string, unknown>> = {
  /**
   * Resolved properties: data bindings are read, function calls evaluated, actions turned into
   * callable functions and child components into {@link A2uiChildRef}s. A bound property `value`
   * also gets a setter `setValue` that writes the data model. Checks add `isValid` and
   * `validationErrors`.
   */
  props: P;
  /** Renders a child reference from `props`. */
  buildChild: (child: A2uiChildRef, basePath?: string) => ReactNode;
  /** The resolved node, for its id, type and data path. */
  node: NativeComponentNode;
  /** The surface the node belongs to. */
  surface: NativeSurfaceModel;
};
