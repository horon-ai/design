import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `badge` 갤러리 섹션입니다.
class HoronBadgeGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronBadgeGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Badge',
      variants: <Widget>[
        for (final HoronBadgeVariant variant in HoronBadgeVariant.values)
          HoronBadge(label: variant.name, variant: variant),
      ],
      states: <Widget>[
        const HoronBadge(label: 'New'),
        const HoronBadge(label: 'With icon', icon: Icon(Icons.star)),
        const HoronBadge(
          label: 'Trailing',
          trailingIcon: Icon(Icons.chevron_right),
        ),
        const HoronBadge(
          label: 'Invalid',
          variant: HoronBadgeVariant.outline,
          invalid: true,
        ),
        HoronBadge(
          label: 'Link',
          variant: HoronBadgeVariant.link,
          onTap: () {},
        ),
        HoronBadge(label: 'Pressable', onTap: () {}),
        const HoronBadge(label: 'A longer badge label stays on one line'),
      ],
      notes:
          'React `badge.tsx`의 변형 6개입니다. `rounded-full`이라 반경은 pill 역할(9999)이고, '
          '아이콘이 앞에 있으면 왼쪽 패딩이, 뒤에 있으면 오른쪽 패딩이 `px-1.5`로 줄어듭니다.',
    );
  }
}
