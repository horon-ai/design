import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `drawer` 갤러리 섹션입니다.
class HoronDrawerGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDrawerGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Drawer',
      variants: <Widget>[
        for (final HoronDrawerSide side in HoronDrawerSide.values)
          HoronDrawer(
            trigger: _Trigger(label: '드로어 ${side.name}'),
            title: '드로어 ${side.name}',
            description: '옆으로 끌어 닫을 수 있습니다.',
            side: side,
            children: const <Widget>[
              HoronMenuItem(label: '받은 편지함'),
              HoronMenuItem(label: '보낸 편지함'),
              HoronMenuItem(label: '휴지통'),
            ],
          ),
      ],
      states: <Widget>[
        HoronDrawer(
          trigger: const _Trigger(label: '끌기 없음'),
          title: '끌기 비활성',
          dragToDismiss: false,
          children: const <Widget>[ListTile(title: Text('끌어도 닫히지 않습니다'))],
        ),
      ],
      notes:
          'React `drawer.tsx`를 옮긴 것입니다. 폭은 화면의 3/4에 최대 320이고, '
          '가장자리 쪽으로 끌면 닫힙니다.',
    );
  }
}

class _Trigger extends StatelessWidget {
  const _Trigger({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextTheme text = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: HoronSpace.s3,
        vertical: HoronSpace.s2,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(HoronRadiusRole.control),
        border: Border.all(color: scheme.outline),
      ),
      child: Text(
        label,
        style: text.bodyMedium?.copyWith(color: scheme.onSurface),
      ),
    );
  }
}
