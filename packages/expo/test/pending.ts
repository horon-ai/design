/**
 * Slugs that exist in `@horon-ai/react` but have no Expo component yet.
 *
 * The parity gate compares the React component directory against the Expo one
 * and requires the difference to be exactly this list. `scripts/integrate.ts`
 * rewrites it from the two directories, so the ledger cannot drift.
 *
 * Every React slug now has an Expo component.
 */
export const pendingComponents: readonly string[] = [

];
