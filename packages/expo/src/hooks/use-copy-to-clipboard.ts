import { useCallback, useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";

/** What {@link useCopyToClipboard} returns: the transient flag and the write function. */
export type CopyToClipboard = {
  /** True from a successful write until `resetMs` has passed; stays false when the write fails. */
  copied: boolean;
  /** Writes `text`; a failed write leaves `copied` false instead of throwing. */
  copy: (text: string) => void;
};

/**
 * Clipboard writes with a self-clearing confirmation: `copied` turns true when
 * the write resolves and back to false after `resetMs`, so a button needs no
 * timer of its own.
 *
 * The write goes through `expo-clipboard`'s `setStringAsync`, which is the
 * native clipboard on iOS and Android and `navigator.clipboard` (plus a paste
 * prompt) on the web. A rejected write is swallowed, so `copied` simply stays
 * false. The timer is cleared when the component unmounts or `resetMs` changes.
 *
 * @param resetMs - How long `copied` stays true after a successful write, in milliseconds. @default 1500
 * @returns A {@link CopyToClipboard}: the current `copied` flag and a stable `copy` function.
 *
 * @example
 * ```tsx
 * import { useCopyToClipboard } from "@horon-ai/expo";
 *
 * function CopyRow({ value }: { value: string }) {
 *   const { copied, copy } = useCopyToClipboard();
 *   return <Button onPress={() => copy(value)}>{copied ? "Copied" : "Copy"}</Button>;
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

  const copy = useCallback((text: string) => {
    Clipboard.setStringAsync(text).then(
      () => setCopied(true),
      () => undefined,
    );
  }, []);

  return { copied, copy };
}
