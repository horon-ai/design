# Third-party notices

The Horon design packages include the works below. Each keeps its own license;
the PolyForm Strict license in `LICENSE` covers only the Horon code.

## Phosphor Icons

`packages/lynx/src/icons/phosphor.g.ts` is generated from `@phosphor-icons/core`,
and the React components draw `@phosphor-icons/react`. Both are MIT.

```
MIT License

Copyright (c) 2023 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Pretendard

`packages/react/src/styles/globals.css` imports the Pretendard variable font
CSS, and the Flutter example bundles the font file. SIL Open Font License 1.1,
Copyright (c) 2021, Kil Hyung-jin, with Reserved Font Name Pretendard. The full
license text is in `packages/flutter/example/assets/fonts/Pretendard-LICENSE.txt`
and at <https://openfontlicense.org>.

## Geist Mono

Code typeface, loaded from `@fontsource-variable/geist-mono`, and bundled in the
Flutter example. SIL Open Font License 1.1, Copyright 2024 The Geist Project
Authors. The full license text is in
`packages/flutter/example/assets/fonts/Geist-LICENSE.txt`.

## Tabler Icons

Flutter example icons, `packages/flutter/example/assets/fonts/TablerIcons.ttf`.
MIT, Copyright (c) 2020-2026 Paweł Kuna. The full license text is in
`packages/flutter/example/assets/fonts/TablerIcons-LICENSE.txt`.

## Sidebar photo

`packages/react/src/assets/sidebar-photo.jpg` (also copied into
`packages/lynx/src/assets/`) is the sidebar photograph of the Paper "Horon"
design, extracted from that screen with the interface elements removed and
shipped as the `bg-sidebar-photo` ground. The repository carries no record of
its original author or license: the file's EXIF holds no artist or copyright
field, no commit message names a source, and no image bank (Unsplash, Pexels,
Pixabay) is cited anywhere. Its origin stays unconfirmed, and it may be
third-party stock photography. If it is, the PolyForm Strict license in
`LICENSE` does not apply to that file; the question stays open until the source
and its terms are confirmed.

## Runtime dependencies

Everything else the packages import arrives as npm dependencies rather than
vendored source, and each carries its own license in its published package:
`@base-ui/react` (MIT), `@tanstack/react-table` (MIT), `tailwind-merge` (MIT),
`shiki` (MIT), `@lynx-js/react` (Apache-2.0), and the React, Astro and Lynx
toolchain. No copyleft-licensed code is vendored into this repository.
