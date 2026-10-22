import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `scroll_area` 갤러리 섹션입니다.
///
/// React `scroll-area.tsx`에는 cva 변형이 없습니다. 변형 칸에는 세로·가로 스크롤을,
/// 상태 칸에는 넘침과 넘치지 않음을 놓습니다. 손잡이는 스크롤하는 동안에만 보입니다.
class HoronScrollAreaGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronScrollAreaGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Scroll Area',
      variants: <Widget>[
        _ScrollCell(
          label: 'Vertical',
          child: SizedBox(
            height: 200,
            child: HoronScrollArea(
              padding: const EdgeInsets.all(HoronSpace.s2),
              child: Column(children: _rows(context, 20)),
            ),
          ),
        ),
        _ScrollCell(
          label: 'Horizontal',
          child: SizedBox(
            height: 120,
            child: HoronScrollArea.horizontal(
              padding: const EdgeInsets.all(HoronSpace.s2),
              child: Row(
                children: <Widget>[
                  for (int index = 0; index < 12; index++)
                    Padding(
                      padding: const EdgeInsets.only(right: HoronSpace.s2),
                      child: SizedBox(
                        width: 120,
                        child: HoronCard(
                          size: HoronCardSize.sm,
                          children: <Widget>[
                            HoronCardContent(child: Text('카드 $index')),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ],
      states: <Widget>[
        _ScrollCell(
          label: 'Overflowing',
          child: SizedBox(
            height: 160,
            child: HoronScrollArea(child: Column(children: _rows(context, 16))),
          ),
        ),
        _ScrollCell(
          label: 'Fits (no thumb)',
          child: SizedBox(
            height: 160,
            child: HoronScrollArea(child: Column(children: _rows(context, 2))),
          ),
        ),
      ],
      notes:
          'React `scroll-area.tsx`의 루트는 `relative overflow-hidden`, 손잡이는 두께 10(`w-2.5`)과 '
          '`rounded-full bg-foreground/20`입니다. 손잡이는 스크롤할 것이 있을 때만 그려집니다.',
    );
  }

  /// 스크롤할 행 목록입니다.
  List<Widget> _rows(BuildContext context, int count) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return <Widget>[
      for (int index = 0; index < count; index++)
        Container(
          height: 36,
          margin: const EdgeInsets.only(bottom: HoronSpace.s1),
          alignment: AlignmentDirectional.centerStart,
          padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s3),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerLow,
            borderRadius: BorderRadius.circular(HoronRadiusRole.control),
            border: Border.all(color: scheme.outline),
          ),
          child: Text('행 $index'),
        ),
    ];
  }
}

/// 스크롤 영역 하나를 이름과 함께 보여 주는 칸입니다.
class _ScrollCell extends StatelessWidget {
  const _ScrollCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          child,
        ],
      ),
    );
  }
}
