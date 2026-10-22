import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `resizable` 갤러리 섹션입니다.
///
/// React `resizable.tsx`에는 cva 변형이 없습니다. 변형 칸에는 가로·세로 분할을,
/// 상태 칸에는 그립 손잡이 유무와 패널 세 개짜리 분할을 놓습니다. 핸들을 끌면
/// 이웃한 두 패널의 비율이 바뀌고, 패널의 최소 크기 아래로는 내려가지 않습니다.
class HoronResizableGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronResizableGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Resizable',
      variants: <Widget>[
        _ResizableCell(
          label: 'Horizontal',
          child: SizedBox(
            height: 180,
            child: HoronResizablePanelGroup(
              children: <Widget>[
                HoronResizablePanel(
                  minSize: 0.2,
                  child: _Pane(label: '사이드', index: 0),
                ),
                const HoronResizableHandle(withHandle: true),
                HoronResizablePanel(child: _Pane(label: '본문', index: 1)),
              ],
            ),
          ),
        ),
        _ResizableCell(
          label: 'Vertical',
          child: SizedBox(
            height: 220,
            child: HoronResizablePanelGroup.vertical(
              children: <Widget>[
                HoronResizablePanel(
                  minSize: 0.2,
                  child: _Pane(label: '위', index: 0),
                ),
                const HoronResizableHandle(withHandle: true),
                HoronResizablePanel(child: _Pane(label: '아래', index: 1)),
              ],
            ),
          ),
        ),
      ],
      states: <Widget>[
        _ResizableCell(
          label: 'With grip',
          child: SizedBox(
            height: 140,
            child: HoronResizablePanelGroup(
              children: <Widget>[
                HoronResizablePanel(child: _Pane(label: 'A', index: 0)),
                const HoronResizableHandle(withHandle: true),
                HoronResizablePanel(child: _Pane(label: 'B', index: 1)),
              ],
            ),
          ),
        ),
        _ResizableCell(
          label: 'Bare handle',
          child: SizedBox(
            height: 140,
            child: HoronResizablePanelGroup(
              children: <Widget>[
                HoronResizablePanel(child: _Pane(label: 'A', index: 0)),
                const HoronResizableHandle(),
                HoronResizablePanel(child: _Pane(label: 'B', index: 1)),
              ],
            ),
          ),
        ),
        _ResizableCell(
          label: 'Three panels',
          child: SizedBox(
            height: 140,
            child: HoronResizablePanelGroup(
              children: <Widget>[
                HoronResizablePanel(
                  minSize: 0.15,
                  child: _Pane(label: 'A', index: 0),
                ),
                const HoronResizableHandle(),
                HoronResizablePanel(
                  minSize: 0.3,
                  child: _Pane(label: 'B', index: 1),
                ),
                const HoronResizableHandle(),
                HoronResizablePanel(
                  minSize: 0.15,
                  child: _Pane(label: 'C', index: 2),
                ),
              ],
            ),
          ),
        ),
      ],
      notes:
          'React `resizable.tsx`의 구분선은 1px 선이고, `after:-inset-x-1`로 양쪽 4px을 더해 '
          '9px을 잡습니다. 그립 손잡이는 `size-2.5` 아이콘을 담은 `rounded-sm` 상자입니다. '
          '각 패널의 minSize가 드래그 하한이고, 하한에서 멈추면 이웃 몫이 그만큼 늘어납니다.',
    );
  }
}

/// 패널 안을 채우는 옅은 면입니다.
class _Pane extends StatelessWidget {
  const _Pane({required this.label, required this.index});

  final String label;
  final int index;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    // 두 패널을 구분해 보이게 번갈아 칠합니다. 라이트에서 카드 색과 같은 흰색을 쓰면
    // 갤러리 배경과 붙어 버리므로, 한쪽은 표면 색, 다른 쪽은 전경을 6% 섞은 색입니다.
    final Color fill = index.isEven
        ? scheme.surfaceContainer
        : Color.alphaBlend(
            scheme.primary.withValues(alpha: 0.06),
            scheme.surface,
          );
    return DecoratedBox(
      decoration: BoxDecoration(color: fill),
      child: Padding(
        padding: const EdgeInsets.all(HoronSpace.s3),
        child: Text(label),
      ),
    );
  }
}

/// 분할 영역 하나를 이름과 함께 보여 주는 칸입니다.
class _ResizableCell extends StatelessWidget {
  const _ResizableCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 320,
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
