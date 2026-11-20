import { getDocumentAsync } from "expo-document-picker";

/**
 * One picked file, in place of the browser's `File`: React Native hands back a
 * URI to a copy in the app's cache instead of a blob.
 */
export type FileDropFile = {
  /** File name, such as `report.pdf`. */
  name: string;
  /** Size in bytes, when the platform reports it. */
  size?: number;
  /** MIME type, when the platform reports it. */
  type?: string;
  /** `file://` URI of the picked copy, readable with `fetch` or `expo-file-system`. */
  uri: string;
};

/** The browser `accept` string split into the MIME types a picker filters by and the extensions it cannot. */
function parseAccept(accept: string | undefined): { types: string[]; extensions: string[] } {
  const entries = (accept ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return {
    types: entries.filter((entry) => entry.includes("/")),
    extensions: entries.filter((entry) => entry.startsWith(".")),
  };
}

/**
 * Opens the system document picker, the native counterpart of clicking react's
 * hidden `<input type="file">`, and resolves to the chosen files (empty when the
 * person cancels).
 *
 * `accept` takes the same string as the HTML attribute. When it names only MIME
 * types (`application/pdf`, `image/*`) the picker filters by them. An extension
 * entry (`.pdf`) cannot filter the iOS picker, so with any extension present the
 * picker shows every file and a picked file that matches none of the entries is
 * dropped from the result. Files are copied to the cache so the returned URIs
 * stay readable after the picker closes.
 */
export async function pickFiles({ accept, multiple }: { accept?: string; multiple?: boolean }): Promise<FileDropFile[]> {
  const { types, extensions } = parseAccept(accept);
  const result = await getDocumentAsync({
    type: types.length > 0 && extensions.length === 0 ? types : "*/*",
    multiple: multiple ?? false,
    copyToCacheDirectory: true,
  });
  if (result.canceled) return [];
  const accepted = (name: string, mime: string | undefined) =>
    extensions.length === 0 ||
    extensions.some((extension) => name.toLowerCase().endsWith(extension)) ||
    types.some((type) => mime !== undefined && (type.endsWith("/*") ? mime.startsWith(type.slice(0, -1)) : mime === type));
  return result.assets
    .filter((asset) => accepted(asset.name, asset.mimeType))
    .map((asset) => ({ name: asset.name, size: asset.size, type: asset.mimeType, uri: asset.uri }));
}
