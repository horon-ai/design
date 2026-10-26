import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `kbd` 갤러리 섹션입니다.
class HoronKbdGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronKbdGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Kbd',
      variants: <Widget>[
        const HoronKbd(label: 'K'),
        const HoronKbd(label: 'Esc'),
        const HoronKbd(label: 'Enter'),
        const HoronKbd(label: 'Shift'),
        const HoronKbd(label: '⌘'),
        const HoronKbd(label: '⌥'),
      ],
      states: <Widget>[
        const HoronKbdGroup(
          children: <Widget>[
            HoronKbd(label: '⌘'),
            HoronKbd(label: 'K'),
          ],
        ),
        const HoronKbdGroup(
          children: <Widget>[
            HoronKbd(label: 'Ctrl'),
            HoronKbd(label: 'Shift'),
            HoronKbd(label: 'P'),
          ],
        ),
        const HoronKbd(label: 'With icon', icon: Icon(Icons.keyboard)),
        const HoronKbd(label: 'A long key name'),
      ],
      notes:
          'React `kbd.tsx`의 키캡입니다. `h-5 min-w-5 rounded-sm border-border bg-muted '
          'text-[11px] font-mono`를 옮겼고, 바탕과 글자를 모두 테마 슬롯에서 읽으므로 '
          '다크에서 밝은 바탕/어두운 글자가 어두운 바탕/밝은 글자로 뒤집힙니다.',
    );
  }
}
