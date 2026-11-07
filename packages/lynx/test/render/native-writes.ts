import type { NodesRef, SelectorQuery, uiMethodOptions } from "@lynx-js/types/background";

/** One native method call a component asked for through an element ref. */
export type NativeWrite = { selector: string; method: string; value: string | undefined };

/**
 * Records the calls a component makes into a native editor. Element refs resolve through
 * `lynx.createSelectorQuery`, so stubbing that one entry point is enough to observe every
 * `setValue` without a native host.
 */
export function recordNativeWrites() {
  const original = lynx.createSelectorQuery.bind(lynx);
  const writes: NativeWrite[] = [];

  const query: SelectorQuery = {
    exec: () => undefined,
    select: (selector: string): NodesRef => {
      const node: NodesRef = {
        invoke: (options: uiMethodOptions) => {
          writes.push({
            selector,
            method: options.method,
            value: typeof options.params?.value === "string" ? options.params.value : undefined,
          });
          return query;
        },
        path: () => query,
        fields: () => query,
        animate: () => query,
        playAnimation: () => query,
        pauseAnimation: () => query,
        cancelAnimation: () => query,
        setNativeProps: () => query,
      };
      return node;
    },
    selectRoot: () => query.select(""),
    selectAll: () => ({
      path: () => query,
      fields: () => query,
      animate: () => query,
      playAnimation: () => query,
      pauseAnimation: () => query,
      cancelAnimation: () => query,
      setNativeProps: () => query,
    }),
  };

  lynx.createSelectorQuery = () => query;
  return {
    /** Every recorded call, in the order the component made them. */
    writes,
    restore: () => {
      lynx.createSelectorQuery = original;
    },
  };
}
