import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `marker` 갤러리 섹션입니다.
class HoronMarkerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMarkerGallerySection({super.key});

  static IconData _iconFor(HoronMarkerVariant variant) => switch (variant) {
    HoronMarkerVariant.defaultValue => Icons.circle_outlined,
    HoronMarkerVariant.muted => Icons.remove_circle_outline,
    HoronMarkerVariant.success => Icons.check_circle_outline,
    HoronMarkerVariant.warning => Icons.warning_amber_outlined,
    HoronMarkerVariant.destructive => Icons.error_outline,
    HoronMarkerVariant.info => Icons.info_outline,
  };

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Marker',
      variants: <Widget>[
        for (final HoronMarkerVariant variant in HoronMarkerVariant.values)
          HoronMarker(
            label: variant.name,
            variant: variant,
            icon: Icon(_iconFor(variant)),
          ),
      ],
      states: <Widget>[
        const HoronMarker(label: 'Label only'),
        const HoronMarker(label: 'With icon', icon: Icon(Icons.bolt)),
        const HoronMarker(
          label: 'Success',
          variant: HoronMarkerVariant.success,
          icon: Icon(Icons.check_circle_outline),
        ),
        const HoronMarker(
          label: 'Warning',
          variant: HoronMarkerVariant.warning,
          icon: Icon(Icons.warning_amber_outlined),
        ),
        const HoronMarker(
          label: 'Destructive',
          variant: HoronMarkerVariant.destructive,
          icon: Icon(Icons.error_outline),
        ),
        const SizedBox(
          width: 180,
          child: HoronMarker(
            label: 'A long label truncates instead of wrapping',
          ),
        ),
      ],
      notes:
          'React `marker.tsx`의 의미 색 6개입니다. 아이콘은 `MarkerIcon` 자리로 들어가고 '
          '`aria-hidden`이라 화면 낭독기에 나가지 않으며, 글자는 `truncate`라 한 줄로 잘립니다.',
    );
  }
}
