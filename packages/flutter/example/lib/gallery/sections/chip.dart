import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/chip.dart';

import '../section_scaffold.dart';

/// `chip` 갤러리 섹션입니다.
class HoronChipGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronChipGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Chip',
      variants: <Widget>[
        for (final HoronChipVariant variant in HoronChipVariant.values)
          HoronChip(label: variant.name, variant: variant),
      ],
      states: <Widget>[
        HoronChip(label: 'Removable', onRemove: () {}),
        HoronChip(
          label: 'Accent removable',
          variant: HoronChipVariant.accent,
          onRemove: () {},
        ),
        HoronChip(
          label: 'Outline removable',
          variant: HoronChipVariant.outline,
          onRemove: () {},
        ),
        HoronChip(
          label: 'With icon',
          icon: const Icon(Icons.tag),
          onRemove: () {},
        ),
        const HoronChip(label: 'Read only'),
        HoronChip(
          label: 'Long label that stays on one line',
          variant: HoronChipVariant.secondary,
          onRemove: () {},
        ),
      ],
      notes:
          'React `chip.tsx`의 변형 7개입니다. `rounded-full`이라 반경은 pill 역할(9999)이고, '
          '제거 버튼의 접근성 이름은 `strings.remove`에서 옵니다.',
    );
  }
}
