<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

## Test hygiene (prune-tests)

`bun test` runs every `*.test.ts` / `*.test.mjs` from the repository root: `apps/site/test` (docs copy, nav, i18n, highlighter, extractor), `packages/{react,lynx,expo,tokens}/test`, and `test/` (license and notices, plus the shared `export-scan.ts` and `props-parity.ts` the Lynx and Expo parity gates read). Gates sit next to what they guard, and most are file scans (`Bun.Glob`) plus a few TypeScript programs (`docs.test.ts`, `props-parity.ts`, `es2019.test.ts`). Component render tests run outside `bun test`: Lynx `*.rstest.tsx` through `bun run --cwd packages/lynx test`, Expo `*.jest.tsx` through `bun run --cwd packages/expo test` (jest-expo).

A test stays only if it is anchored to intended behavior: it fails when that behavior regresses, and it changes when the behavior changes. Do not write tests for code that was removed staying removed, for what the framework, the browser or the type system already guarantees, for a mock echoing what it was given, for an expected value derived from the same logic as the code, or for private state, internal call order and which helper ran. Do not snapshot prose, comments or a constant's literal value; assert what a caller of the module sees instead.

One behavior, one test. When another test already guards it, delete the copy rather than keeping a second phrasing. Production code never exists only for tests: no `_resetForTests` hooks, no export whose only reader is a test file, and no fixture left behind by a deleted test.

When a change makes a test obsolete, prune it in the same change; before finishing any change that touches tests, run the `prune-tests` skill (`/skill:prune-tests`) and verify with `bun run lint`, `bun run typecheck` and `bun test`.
