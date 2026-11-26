import {
  NodeResolver,
  ResolvedBinding,
  effect,
  getValue,
  isComponentNode,
  isWritable,
  peekValue,
  type Signal,
} from "@a2ui/web_core";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type {
  A2uiChildRef,
  NativeCatalogComponent,
  NativeComponentNode,
  NativeSurfaceModel,
  NodeBuildChild,
} from "./types";

const SurfaceContext = createContext<NativeSurfaceModel | undefined>(undefined);

/** The enclosing surface inside an {@link A2uiSurface} tree, or `undefined` outside one. */
export function useA2uiSurface(): NativeSurfaceModel | undefined {
  return useContext(SurfaceContext);
}

function surfaceOf(node: NativeComponentNode, ambient: NativeSurfaceModel | undefined): NativeSurfaceModel {
  if (ambient) return ambient;
  throw new Error(`A2UI node '${node.componentId}' must be rendered inside an <A2uiSurface>.`);
}

/** Subscribes to an A2UI signal and returns its current value, re-rendering when it changes. */
export function useSignalValue<T>(signal: Signal<T>): T {
  const subscribe = useCallback(
    (onChange: () => void) =>
      effect(() => {
        getValue(signal);
        onChange();
      }),
    [signal],
  );
  const getSnapshot = useCallback(() => peekValue(signal), [signal]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

type ChildIndex = Map<string, NativeComponentNode>;

function toViewValue(parent: NativeComponentNode, value: unknown, index: ChildIndex): unknown {
  if (isComponentNode(value)) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- every node of a native surface resolves against its native catalogs
    const child = value as NativeComponentNode;
    index.set(child.id, child);
    return child.dataPath === parent.dataPath ? child.id : { id: child.id, basePath: child.dataPath };
  }
  if (value instanceof ResolvedBinding) return toViewValue(parent, value.value, index);
  if (Array.isArray(value)) return value.map((item) => toViewValue(parent, item, index));
  if (isPlainObject(value)) return toViewProps(parent, value, index);
  return value;
}

const noop = () => undefined;

function toViewProps(parent: NativeComponentNode, props: Record<string, unknown>, index: ChildIndex) {
  const result: Record<string, unknown> = {};
  for (const [key, inner] of Object.entries(props)) {
    // `@`-prefixed keys are the protocol's reserved spellings of the same properties.
    if (key.startsWith("@")) continue;
    result[key] = toViewValue(parent, inner, index);
    if (inner instanceof ResolvedBinding) {
      result[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`] = isWritable(inner) ? inner.set : noop;
    }
  }
  return result;
}

const reported = new WeakMap<NativeSurfaceModel, Set<string>>();

function UnresolvedChildReference({
  surface,
  id,
  requestedPath,
  detail,
}: {
  surface: NativeSurfaceModel;
  id: string;
  requestedPath: string;
  detail: string;
}) {
  const message = `Unresolved child reference '${id}' at '${requestedPath}': ${detail}`;
  useEffect(() => {
    let seen = reported.get(surface);
    if (!seen) {
      seen = new Set();
      reported.set(surface, seen);
    }
    const key = JSON.stringify([id, requestedPath]);
    if (seen.has(key)) return;
    seen.add(key);
    void surface.dispatchError({ code: "UNRESOLVED_CHILD_REFERENCE", message });
  }, [surface, id, requestedPath, message]);
  return null;
}

/** The state {@link useNodeView} derives from a node for its view. */
export type NodeViewState = {
  /** The node's props in view form (see `NativeA2uiComponentProps.props`). */
  viewProps: Record<string, unknown>;
  /** Renders a child reference taken from `viewProps`. */
  buildChild: (child: A2uiChildRef, basePath?: string) => ReactNode;
  /** The surface the node belongs to. */
  surface: NativeSurfaceModel;
};

/**
 * Subscribes to a node's resolved props and converts them for a view: bindings become values plus
 * setters, child nodes become ids that `buildChild` renders.
 */
export function useNodeView(node: NativeComponentNode, buildChild: NodeBuildChild): NodeViewState {
  const surface = surfaceOf(node, useContext(SurfaceContext));
  const resolved = useSignalValue(node.props);

  const { viewProps, childIndex } = useMemo(() => {
    const index: ChildIndex = new Map();
    return { viewProps: toViewProps(node, resolved, index), childIndex: index };
  }, [node, resolved]);

  const build = useCallback(
    (child: A2uiChildRef, basePath?: string): ReactNode => {
      const id = typeof child === "string" ? child : child.id;
      const requestedBase = typeof child === "string" ? basePath : child.basePath;
      const indexed = childIndex.get(id);
      if (indexed) return buildChild(indexed, requestedBase);
      return buildChild(id, requestedBase);
    },
    [buildChild, childIndex],
  );

  return { viewProps, buildChild: build, surface };
}

const NodeContent = memo(function NodeContent({ node }: { node: NativeComponentNode }) {
  const surface = surfaceOf(node, useContext(SurfaceContext));
  const buildChild = useCallback<NodeBuildChild>(
    (child, basePath) => {
      if (isComponentNode(child)) {
        return <ChildElement key={child.id} node={child} />;
      }
      const requestedPath = basePath ?? node.dataPath;
      const detail = surface.componentsModel.get(child)
        ? "the component exists, but the catalog schema does not mark the referencing property as a component id."
        : "no component with this id exists on the surface.";
      return (
        <UnresolvedChildReference
          key={JSON.stringify([child, requestedPath])}
          surface={surface}
          id={child}
          requestedPath={requestedPath}
          detail={detail}
        />
      );
    },
    [surface, node],
  );

  const impl = node.impl;
  if (node.disposed || !impl || typeof impl.view !== "function") return null;
  const View = impl.view;
  return <View node={node} buildChild={buildChild} />;
});

/** Renders one resolved node: nothing for a placeholder awaiting its component, else its view. */
export const ChildElement = memo(function ChildElement({ node }: { node: NativeComponentNode }) {
  if (node.isPlaceholder || !node.impl) return null;
  return <NodeContent node={node} />;
});

type ResolverBox = { resolver: NodeResolver<NativeCatalogComponent> | undefined };

/**
 * Renders one A2UI surface with React Native views, the counterpart of `@a2ui/react`'s
 * `A2uiSurface`.
 *
 * It owns a `NodeResolver` for the surface, subscribes to the resolved root and renders each node
 * through its catalog entry's `view`. Components, data model and actions update in place as
 * `updateComponents` and `updateDataModel` arrive. Wrap the tree in `HoronProvider`.
 *
 * The resolver is created on the first render, so the first frame (and a server render, such as
 * Expo web static rendering) already holds the surface's content.
 */
export function A2uiSurface({ surface }: { surface: NativeSurfaceModel }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- one box per surface
  const box = useMemo<ResolverBox>(() => ({ resolver: undefined }), [surface]);

  const resolverOf = useCallback(
    () => (box.resolver ??= new NodeResolver(surface, surface.defaultCatalog)),
    [surface, box],
  );
  const subscribe = useCallback(
    (onChange: () => void) => {
      const resolver = resolverOf();
      const stop = effect(() => {
        getValue(resolver.rootNode);
        onChange();
      });
      return () => {
        stop();
        resolver.dispose();
        if (box.resolver === resolver) box.resolver = undefined;
      };
    },
    [resolverOf, box],
  );
  const getSnapshot = useCallback(() => peekValue(resolverOf().rootNode), [resolverOf]);
  const root = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (!root) return null;
  return (
    <SurfaceContext.Provider value={surface}>
      <ChildElement node={root} />
    </SurfaceContext.Provider>
  );
}
