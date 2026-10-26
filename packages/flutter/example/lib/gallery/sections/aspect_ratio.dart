import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `aspect_ratio` 갤러리 섹션입니다.
class HoronAspectRatioGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronAspectRatioGallerySection({super.key});

  Widget _box(BuildContext context, double ratio, String label) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 160,
      child: HoronAspectRatio(
        ratio: ratio,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(HoronRadius.sm),
            border: Border.all(color: scheme.outline),
          ),
          child: Center(child: Text(label)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'AspectRatio',
      variants: <Widget>[
        _box(context, 16 / 9, '16:9'),
        _box(context, 4 / 3, '4:3'),
        _box(context, 1, '1:1'),
        _box(context, 3 / 4, '3:4'),
        _box(context, 21 / 9, '21:9'),
      ],
      states: <Widget>[
        SizedBox(
          width: 240,
          child: HoronAspectRatio(
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.secondaryContainer,
                borderRadius: BorderRadius.circular(HoronRadius.md),
              ),
              child: const Center(child: Text('Default 16/9')),
            ),
          ),
        ),
        SizedBox(
          width: 240,
          child: HoronAspectRatio(
            ratio: 1,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(HoronRadius.md),
              ),
              child: const Center(child: Text('Square')),
            ),
          ),
        ),
      ],
      notes:
          'React `aspect-ratio.tsx`의 `ratio` prop을 옮겼습니다. 기본값은 16/9이고, '
          '`overflow-hidden`에 해당하는 `ClipRect`가 넘치는 내용을 자릅니다.',
    );
  }
}
