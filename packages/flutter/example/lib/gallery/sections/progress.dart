import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/progress.dart';

import '../section_scaffold.dart';

/// `progress` 갤러리 섹션입니다.
class HoronProgressGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronProgressGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Progress',
      variants: <Widget>[
        for (final double value in <double>[0, 0.25, 0.5, 0.75, 1])
          SizedBox(
            width: 240,
            child: HoronProgress(
              value: value,
              label: '${(value * 100).round()}%',
              showValue: true,
            ),
          ),
      ],
      states: <Widget>[
        const SizedBox(width: 240, child: HoronProgress(label: '불러오는 중')),
        const SizedBox(
          width: 240,
          child: HoronProgress(value: 0.4, label: '업로드'),
        ),
        const SizedBox(
          width: 240,
          child: HoronProgress(value: 0.62, valueLabel: '31 / 50'),
        ),
        const SizedBox(width: 240, child: HoronProgress(value: 1, label: '완료')),
        SizedBox(
          width: 240,
          child: HoronProgress(
            value: 0.3,
            label: '큰 트랙',
            child: const HoronProgressTrack(),
          ),
        ),
      ],
      notes:
          'React `progress.tsx`의 다섯 조각입니다. 값이 null이면 미결정 인디케이터가 트랙을 '
          '가로지르고, 0~1 비율이면 그만큼 채웁니다. 트랙은 8px 알약이고 색은 `muted`와 '
          '`primary`입니다.',
    );
  }
}
