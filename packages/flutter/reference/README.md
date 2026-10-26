# reference/react-components

The 75 `@horon-ai/react` component sources as they were before the web layer was
rebuilt from the Horon Figma file on 2026-10-26 (design `dev` at `8fe92d9`).

The Flutter widgets mirror these, not the rebuilt web components. The parity,
gallery and variant gates (`test/gates/`) read this folder so they keep checking
Flutter against the set it was built from. The files are text for those gates
only; nothing imports or builds them.

When the Flutter layer is rebuilt to match the new web components, point
`reactComponentsPath` in `test/gates/gate_sources.dart` back at
`../react/src/components` and delete this folder.
