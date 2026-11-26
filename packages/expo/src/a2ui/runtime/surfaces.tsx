import {
  MessageProcessor,
  STRICT_VALIDATION,
  type ActionListener,
  type Catalog,
  type MessageProcessorOptions,
} from "@a2ui/web_core";
import { spacing } from "@horon-ai/tokens";
import { useEffect, useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { A2uiSurface } from "./surface";
import type { NativeCatalogComponent, NativeSurfaceModel } from "./types";

/** A message processor whose catalogs hold React Native entries. */
export type NativeMessageProcessor = MessageProcessor<NativeCatalogComponent>;

/** Options of {@link createA2uiProcessor}. */
export type A2uiProcessorOptions = Omit<MessageProcessorOptions, "validationConfig"> & {
  /** Receives every user action, its `context` already resolved against the data model. */
  onAction?: ActionListener;
  /**
   * Validates payloads with `STRICT_VALIDATION` (schema, ids, references, cycles) when true, and with
   * the processor's default checks when false.
   * @default true
   */
  strict?: boolean;
};

/**
 * Creates a `MessageProcessor` for React Native catalogs. Strict validation is on by default because
 * an agent's payload is untrusted input.
 */
export function createA2uiProcessor(
  catalogs: Catalog<NativeCatalogComponent>[],
  { onAction, strict = true, ...options }: A2uiProcessorOptions = {},
): NativeMessageProcessor {
  return new MessageProcessor<NativeCatalogComponent>(catalogs, onAction, {
    ...options,
    ...(strict ? { validationConfig: STRICT_VALIDATION } : {}),
  });
}

/** The processor's active surfaces, updated as `createSurface` and `deleteSurface` arrive. */
export function useA2uiSurfaces(processor: NativeMessageProcessor): NativeSurfaceModel[] {
  const [surfaces, setSurfaces] = useState(() => Array.from(processor.getSurfaces().values()));
  useEffect(() => {
    const sync = () => setSurfaces(Array.from(processor.getSurfaces().values()));
    const created = processor.onSurfaceCreated(sync);
    const deleted = processor.onSurfaceDeleted(sync);
    sync();
    return () => {
      created.unsubscribe();
      deleted.unsubscribe();
    };
  }, [processor]);
  return surfaces;
}

/** Props of {@link A2uiSurfaces}. */
export type A2uiSurfacesProps = {
  processor: NativeMessageProcessor;
  /** Layout of the stack (width, padding). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Renders every surface of a processor in a vertical stack, mounting a surface when
 * `createSurface` arrives and unmounting it on `deleteSurface`.
 */
export function A2uiSurfaces({ processor, style }: A2uiSurfacesProps) {
  const surfaces = useA2uiSurfaces(processor);
  return (
    <View style={[{ gap: spacing["4"] }, style]}>
      {surfaces.map((surface) => (
        <A2uiSurface key={surface.id} surface={surface} />
      ))}
    </View>
  );
}
