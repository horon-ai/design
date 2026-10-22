import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/separator.dart';

import '../section_scaffold.dart';

/// `separator` 갤러리 섹션입니다.
class HoronSeparatorGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSeparatorGallerySection({super.key});

  static Widget _labelledRow(String left, String right) {
    return SizedBox(
      height: 48,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(left),
          const SizedBox(width: HoronSpace.s3),
          const HoronSeparator.vertical(),
          const SizedBox(width: HoronSpace.s3),
          Text(right),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Separator',
      variants: <Widget>[
        const SizedBox(width: 240, child: HoronSeparator()),
        const SizedBox(width: 240, child: HoronSeparator(label: 'or')),
        const SizedBox(width: 240, child: HoronSeparator(label: '계속하려면 로그인')),
        _labelledRow('Left', 'Right'),
      ],
      states: <Widget>[
        const SizedBox(width: 240, child: HoronSeparator()),
        const SizedBox(
          height: 80,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              SizedBox(width: 48),
              HoronSeparator.vertical(),
              SizedBox(width: 48),
            ],
          ),
        ),
        const SizedBox(
          width: 240,
          child: HoronSeparator(label: 'Signed in as 민열'),
        ),
      ],
      notes:
          'React `separator.tsx`는 수평(`h-px w-full`)과 수직(`w-px self-stretch`) 두 방향입니다. '
          '수직은 부모가 높이를 정해야 하고, 라벨 변형은 이 패키지가 더한 확장입니다.',
    );
  }
}
