import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `context_menu` 갤러리 섹션입니다.
///
/// 길게 누르거나 오른쪽 버튼으로 누르면 그 지점에 메뉴가 열립니다. 길게 누르기는
/// 중간 세기 햅틱을 먼저 울립니다.
class HoronContextMenuGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronContextMenuGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Context Menu',
      variants: <Widget>[
        _DropZone(
          label: '길게 눌러 보세요',
          menu: HoronContextMenu(
            semanticLabel: '파일 메뉴',
            trigger: const SizedBox.expand(),
            children: <Widget>[
              HoronContextMenuItem(label: '열기', onSelected: () {}),
              HoronContextMenuItem(label: '이름 바꾸기', onSelected: () {}),
              const HoronContextMenuSeparator(),
              HoronContextMenuItem(label: '삭제', onSelected: () {}),
            ],
          ),
        ),
        _DropZone(
          label: '항목을 눌러 보세요',
          menu: HoronContextMenu(
            semanticLabel: '텍스트 메뉴',
            trigger: const SizedBox.expand(),
            children: <Widget>[
              const HoronContextMenuLabel(label: '편집'),
              HoronContextMenuItem(label: '복사', onSelected: () {}),
              HoronContextMenuItem(label: '붙여넣기', onSelected: () {}),
            ],
          ),
        ),
      ],
      states: <Widget>[
        _DropZone(
          label: '비활성',
          menu: HoronContextMenu(
            semanticLabel: '비활성 메뉴',
            enabled: false,
            trigger: const SizedBox.expand(),
            children: <Widget>[
              HoronContextMenuItem(label: '열기', onSelected: () {}),
            ],
          ),
        ),
      ],
      notes:
          'React `context-menu.tsx`를 옮겼습니다. 메뉴는 트리거의 모서리가 아니라 누른 '
          '지점에 붙고, 길게 누르기는 `HapticFeedback.mediumImpact`를 먼저 울립니다. '
          '보조 클릭은 포인터 입력이라 햅틱을 울리지 않습니다.',
    );
  }
}

/// 길게 누르기·보조 클릭을 받는 점선 상자입니다.
class _DropZone extends StatelessWidget {
  const _DropZone({required this.label, required this.menu});

  final String label;
  final HoronContextMenu menu;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return SizedBox(
      width: 220,
      height: 120,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: scheme.surfaceContainer,
          borderRadius: BorderRadius.circular(HoronRadiusRole.card),
          border: Border.all(color: scheme.outline),
        ),
        child: Stack(
          children: <Widget>[
            Center(
              child: Text(
                label,
                style: TextStyle(
                  color: scheme.onSurfaceVariant,
                  decoration: TextDecoration.none,
                ),
              ),
            ),
            Positioned.fill(child: menu),
          ],
        ),
      ),
    );
  }
}
