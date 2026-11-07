import { useCallback, useEffect, useState } from "react";

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
 * The write goes through `navigator.clipboard`, so it needs a secure context and a user gesture; where that API
 * is missing the call is a no-op and `copied` never turns true. The timer is cleared when the component unmounts
 * or `resetMs` changes.
 *
 * @param resetMs - How long `copied` stays true after a successful write, in milliseconds. @default 1500
 * @returns A {@link CopyToClipboard}: the current `copied` flag and a stable `copy` function.
 *
 * @example
 * ```tsx
 * import { useCopyToClipboard } from "@horon-ai/react";
 *
 * function CopyRow({ value }: { value: string }) {
 *   const { copied, copy } = useCopyToClipboard();
 *   return (
 *     <Button variant="ghost" onClick={() => copy(value)}>
 *       {copied ? "Copied" : "Copy"}
 *     </Button>
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

  const copy = useCallback((text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => setCopied(true),
      () => undefined,
    );
  }, []);

  return { copied, copy };
}
