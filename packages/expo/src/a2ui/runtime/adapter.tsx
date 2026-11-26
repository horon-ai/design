import type { ComponentApi } from "@a2ui/web_core";
import { memo, type FC, type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

import { readAccessibility } from "./accessibility";
import { useNodeView } from "./surface";
import type { NativeA2uiComponentProps, NativeComponentImplementation, NodeViewProps } from "./types";

function apiFields(api: ComponentApi) {
  return {
    name: api.name,
    schema: api.schema,
    allowedParents: api.allowedParents,
    allowedChildren: api.allowedChildren,
    ...(api.metadata !== undefined ? { metadata: api.metadata } : {}),
  };
}

/**
 * Applies the props every v1.0 component shares and React Native has no element host for:
 * `weight` (flex share inside a Row or Column) and `accessibility.hidden` / `accessibility.live`.
 * `accessibility.label` and `description` stay with each view, which puts them on its own control.
 */
function withCommonProps(element: ReactNode, props: Record<string, unknown>): ReactNode {
  const weight = typeof props.weight === "number" && props.weight > 0 ? props.weight : undefined;
  const { hidden, live } = readAccessibility(props);
  if (weight === undefined && !hidden && !live) return element;

  const style: ViewStyle | undefined =
    weight === undefined ? undefined : { flexGrow: weight, flexShrink: 1, flexBasis: 0, minWidth: 0 };
  return (
    <View
      style={style}
      accessibilityElementsHidden={hidden || undefined}
      importantForAccessibility={hidden ? "no-hide-descendants" : undefined}
      accessibilityLiveRegion={live}
    >
      {element}
    </View>
  );
}

/**
 * Builds a catalog entry from a component API and a presentational React Native component, the
 * counterpart of `@a2ui/react`'s `createComponentImplementation`.
 *
 * The component receives resolved `props` (values, setters for bound properties, callable actions,
 * `isValid` / `validationErrors` from checks) and `buildChild` for its child references. The API
 * usually comes from a catalog document: `Catalog.fromJson(doc).components.get("Name")`.
 */
export function createComponentImplementation<P = Record<string, unknown>>(
  api: ComponentApi,
  Render: FC<NativeA2uiComponentProps<P>>,
): NativeComponentImplementation {
  const Memoized = memo(Render);
  Memoized.displayName = `${api.name}.memo`;

  function NodeView({ node, buildChild }: NodeViewProps) {
    const { viewProps, buildChild: build, surface } = useNodeView(node, buildChild);
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the processor validated these props against the component's catalog schema, which P describes
    const props = viewProps as P;
    return withCommonProps(<Memoized props={props} buildChild={build} node={node} surface={surface} />, viewProps);
  }
  NodeView.displayName = `${api.name}.view`;

  return { ...apiFields(api), view: NodeView };
}

/**
 * Builds a catalog entry whose view reads the node itself (`node.props`, `node.context`) and
 * manages its own subscriptions, the counterpart of `@a2ui/react`'s
 * `createBinderlessComponentImplementation`.
 */
export function createBinderlessComponentImplementation(
  api: ComponentApi,
  Render: FC<NodeViewProps>,
): NativeComponentImplementation {
  return { ...apiFields(api), view: Render };
}
