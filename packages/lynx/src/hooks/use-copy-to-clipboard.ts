import { useCallback, useEffect, useState } from "@lynx-js/react";

/** What {@link useCopyToClipboard} returns: the transient flag, the write function and whether a write can happen at all. */
export type CopyToClipboard = {
  /** True from a successful write until `resetMs` has passed; stays false when the write fails. */
  copied: boolean;
  /** Writes `text` and reports whether the write started; `false` when this engine has no clipboard. */
  copy: (text: string) => boolean;
  /** `true` when the engine exposes a clipboard; `false` on native Lynx, where copy is unsupported. */
  supported: boolean;
};

/**
 * Clipboard writes with a self-clearing confirmation.
 *
 * Lynx has no clipboard API of its own. The only documented path is the browser
 * engine's, so on `@lynx-js/web-core` (where `navigator.clipboard` exists) the
 * write goes through it, and on every native engine it does not happen at all:
 * `copy()` returns `false`, `copied` never turns true, and `supported` is
 * `false`. That explicit unsupported state is the documented difference from
 * react, which silently no-ops; a caller can now hide a copy button instead of
 * showing one that does nothing.
 *
 * @param resetMs - How long `copied` stays true after a successful write, in milliseconds. @default 1500
 * @returns A {@link CopyToClipboard}: the current `copied` flag, a stable `copy` function and `supported`.
 *
 * @example
 * ```tsx
 * import { useCopyToClipboard } from "@horon-ai/lynx";
 *
 * function CopyRow({ value }: { value: string }) {
 *   const { copied, copy, supported } = useCopyToClipboard();
 *   if (!supported) return null;
 *   return (
 *     <view bindtap={() => copy(value)}>
 *       <text className="text-label-sm text-text-secondary">{copied ? "Copied" : "Copy"}</text>
 *     </view>
 *   );
 * }
 * ```
 */
export function useCopyToClipboard(resetMs = 1500): CopyToClipboard {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  const clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
  const supported = typeof clipboard?.writeText === "function";

  const copy = useCallback(
    (text: string) => {
      if (!clipboard) return false;
      clipboard.writeText(text).then(
        () => setCopied(true),
        () => undefined,
      );
      return true;
    },
    [clipboard],
  );

  return { copied, copy, supported };
}
