import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴은 통합 스크립트가 채웁니다. 그 전에는 하위 경로로 가져옵니다.
// 통합 뒤 `scripts/sweep-imports.mjs`가 이 줄을 지우고 배럴만 남깁니다.
import 'package:horon_ui/src/components/navigation_menu.dart';

import '../section_scaffold.dart';

/// `navigation_menu` 갤러리 섹션입니다.
///
/// 공유 오버레이 위치 유틸(todo 18)이 만든 플라이아웃을 보여 줍니다.
class HoronNavigationMenuGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronNavigationMenuGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Navigation Menu',
      variants: <Widget>[
        HoronNavigationMenu(
          semanticLabel: '제품',
          trigger: const _Trigger(label: '제품'),
          children: <Widget>[
            HoronNavigationMenuLink(
              label: '개요',
              description: '한눈에 보기',
              onSelected: () {},
            ),
            HoronNavigationMenuLink(
              label: '가격',
              description: '요금제 비교',
              onSelected: () {},
            ),
            HoronNavigationMenuLink(label: '문서', onSelected: () {}),
          ],
        ),
        HoronNavigationMenu(
          semanticLabel: '회사',
          trigger: const _Trigger(label: '회사'),
          children: <Widget>[
            HoronNavigationMenuLink(label: '소개', onSelected: () {}),
            HoronNavigationMenuLink(label: '채용', onSelected: () {}),
            HoronNavigationMenuLink(label: '비활성', enabled: false),
          ],
        ),
      ],
      states: <Widget>[
        HoronNavigationMenuList(
          children: <Widget>[
            HoronNavigationMenuItem(
              child: HoronNavigationMenu(
                semanticLabel: '제품',
                trigger: const _Trigger(label: '제품'),
                children: <Widget>[
                  HoronNavigationMenuLink(label: '개요', onSelected: () {}),
                ],
              ),
            ),
            HoronNavigationMenuItem(
              child: HoronNavigationMenu(
                semanticLabel: '회사',
                trigger: const _Trigger(label: '회사'),
                children: <Widget>[
                  HoronNavigationMenuLink(label: '소개', onSelected: () {}),
                ],
              ),
            ),
          ],
        ),
      ],
      notes:
          'React `navigation-menu.tsx`의 플라이아웃입니다. 배치는 todo 18의 공유 위치 '
          '유틸이 맡습니다. 데스크톱에서는 호버와 클릭으로, 터치에서는 탭으로 열립니다.',
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
