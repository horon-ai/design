import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/button.dart';
import 'package:horon_ui/src/components/drawer.dart';
import 'package:horon_ui/src/components/sheet.dart';

import '../section_scaffold.dart';

/// `sheet` 갤러리 섹션입니다.
///
/// 네 side를 모두 보여 주고, 드로어는 좌우 두 쪽을 보여 줍니다.
class HoronSheetGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSheetGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Sheet & Drawer',
      variants: <Widget>[
        for (final HoronSheetSide side in HoronSheetSide.values)
          HoronSheet(
            trigger: _Trigger(label: '시트 ${side.name}'),
            title: '시트 ${side.name}',
            description: '이 가장자리에 붙습니다.',
            side: side,
            footer: HoronSheetFooter(
              children: <Widget>[
                HoronButton(
                  label: '닫기',
                  variant: HoronButtonVariant.outline,
                  onPressed: () {},
                ),
                HoronButton(label: '저장', onPressed: () {}),
              ],
            ),
          ),
      ],
      states: <Widget>[
        for (final HoronDrawerSide side in HoronDrawerSide.values)
          HoronDrawer(
            trigger: _Trigger(label: '드로어 ${side.name}'),
            title: '드로어 ${side.name}',
            description: '옆으로 끌어 닫을 수 있습니다.',
            side: side,
            children: const <Widget>[
              ListTile(title: Text('항목 하나')),
              ListTile(title: Text('항목 둘')),
            ],
          ),
      ],
      notes:
          'React `sheet.tsx`와 `drawer.tsx`를 옮긴 것입니다. 시트는 네 가장자리에 '
          '붙고, 드로어는 좌우에서 밀려 들어오며 끌어서 닫을 수 있습니다.',
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
