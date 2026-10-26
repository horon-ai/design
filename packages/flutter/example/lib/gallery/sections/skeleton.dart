import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `skeleton` 갤러리 섹션입니다.
class HoronSkeletonGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSkeletonGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Skeleton',
      variants: <Widget>[
        const SizedBox(
          width: 240,
          child: HoronSkeleton(width: 240, height: 12),
        ),
        const SizedBox(
          width: 240,
          child: HoronSkeleton(width: 180, height: 12),
        ),
        const SizedBox(
          width: 240,
          child: HoronSkeleton(width: 240, height: 24),
        ),
        const SizedBox(
          width: 48,
          height: 48,
          child: HoronSkeleton(
            width: 48,
            height: 48,
            borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full)),
          ),
        ),
        const SizedBox(
          width: 48,
          height: 48,
          child: HoronSkeleton(width: 48, height: 48),
        ),
      ],
      states: <Widget>[
        const SizedBox(
          width: 240,
          child: HoronSkeleton(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                HoronSkeletonBar(width: 200, height: 12),
                SizedBox(height: 8),
                HoronSkeletonBar(width: 240, height: 12),
                SizedBox(height: 8),
                HoronSkeletonBar(width: 160, height: 12),
              ],
            ),
          ),
        ),
        const SizedBox(
          width: 240,
          height: 72,
          child: HoronSkeletonReveal(
            loading: true,
            skeleton: HoronSkeleton(width: 240, height: 72),
            content: Text('내용'),
          ),
        ),
        const SizedBox(
          width: 240,
          height: 72,
          child: HoronSkeletonReveal(
            loading: false,
            skeleton: HoronSkeleton(width: 240, height: 72),
            content: Text('드러난 내용'),
          ),
        ),
        const SizedBox(
          width: 240,
          child: HoronSkeleton(width: 240, height: 12, shimmer: false),
        ),
      ],
      notes:
          '동작 정본은 `mobile/lib/src/widgets/skeleton.dart`입니다. 2000ms 주기, 바닥 불투명도 '
          '0.1, 하이라이트 0.5, 400ms 드러내기 크로스페이드(플레이스홀더는 흐려지고 내용은 '
          '선명해짐)를 그대로 옮겼습니다. Buzz `Radii.sm` 대신 `HoronRadius.sm`을 씁니다. '
          '`disableAnimations`에서는 멈춥니다.',
    );
  }
}
