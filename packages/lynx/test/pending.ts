/**
 * Slugs that exist in `@horon-ai/react` but have no Lynx component yet.
 *
 * This is the Flutter package's ledger pattern: the parity gate compares the
 * React component directory against the Lynx one and requires the difference to
 * be exactly this list. `scripts/integrate.ts` rewrites the list from the two
 * directories, so the gate turns green as the port fills in instead of staying
 * red for the whole migration, and the ledger cannot drift from the sources.
 *
 * Every React slug now has a Lynx component.
 */
export const pendingComponents: readonly string[] = [

];
