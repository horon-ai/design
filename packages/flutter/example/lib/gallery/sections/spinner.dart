import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/spinner.dart';

import '../section_scaffold.dart';

/// `spinner` 갤러리 섹션입니다.
class HoronSpinnerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSpinnerGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return GallerySectionScaffold(
      title: 'Spinner',
      variants: <Widget>[
        const HoronSpinner(),
        const HoronSpinner(size: 24),
        const HoronSpinner(size: 32),
        HoronSpinner(color: scheme.onSurfaceVariant),
        HoronSpinner(color: scheme.primary),
      ],
      states: <Widget>[
        Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const HoronSpinner(),
            const SizedBox(width: 8),
            Text('불러오는 중', style: TextStyle(color: scheme.onSurface)),
          ],
        ),
        const Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronSpinner(semanticsLabel: '불러오는 중'),
            SizedBox(width: 8),
            Text('접근성 이름 있음'),
          ],
        ),
      ],
      notes:
          'React `spinner.tsx`의 18px·2px 링입니다. 위쪽 4분의 1만 투명하고 1초에 한 바퀴 '
          '돕니다. `disableAnimations`에서는 회전을 멈춥니다.',
    );
  }
}
