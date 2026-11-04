import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports

/// Tabs 갤러리 섹션입니다.
///
/// 아이콘·개수가 붙은 탭과 글자만 있는 탭을 solid와 glass 두 표면에 같은 목록으로
/// 놓습니다. 탭을 누르면 선택 표시자가 옮겨 가고 아래 패널이 바뀌며, 새 패널은
/// 4px 아래에서 제자리로 올라옵니다(React `animate-swap-move`).
/// 마지막 줄은 `variant="underline"` 문서형 탭입니다. 쟁반 없이 폭을 채우고 아래
/// 1px 테두리 위를 2px 밑줄이 따라갑니다. 크기 단계(sm·md·lg)도 함께 보여 줍니다.
class HoronTabsGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTabsGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(label: 'Solid', child: _tabs(theme, HoronSurface.solid)),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _tabs(theme, HoronSurface.glass),
          ),
          _Sample(label: 'Underline (문서형)', child: _underlineTabs()),
          _Sample(label: '크기 단계', child: _sizes(theme)),
        ],
      ),
    );
  }

  /// 한 표면의 탭 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _tabs(HoronThemeData theme, HoronSurface surface) {
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s6,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Sample(
          label: '기본',
          child: HoronTabs(
            children: <Widget>[
              HoronTabsList(
                surface: surface,
                children: const <Widget>[
                  HoronTabsTab(value: 'overview', label: '개요'),
                  HoronTabsTab(value: 'members', label: '멤버'),
                ],
              ),
              const HoronTabsPanel(value: 'overview', child: Text('개요 패널')),
              const HoronTabsPanel(value: 'members', child: Text('멤버 패널')),
            ],
          ),
        ),
        _Sample(
          label: '아이콘과 개수',
          child: HoronTabs(
            children: <Widget>[
              HoronTabsList(
                surface: surface,
                children: <Widget>[
                  const HoronTabsTab(
                    value: 'overview',
                    label: '개요',
                    icon: Icon(Icons.dashboard_outlined),
                    count: 4,
                  ),
                  const HoronTabsTab(
                    value: 'members',
                    label: '멤버',
                    icon: Icon(Icons.group_outlined),
                  ),
                  const HoronTabsTab(
                    value: 'logs',
                    label: '로그',
                    icon: Icon(Icons.receipt_long_outlined),
                    count: 12,
                  ),
                ],
              ),
              const HoronTabsPanel(value: 'overview', child: Text('개요 패널')),
              const HoronTabsPanel(value: 'members', child: Text('멤버 패널')),
              const HoronTabsPanel(value: 'logs', child: Text('로그 패널')),
            ],
          ),
        ),
        _Sample(
          label: '글자만',
          child: HoronTabs(
            children: <Widget>[
              HoronTabsList(
                surface: surface,
                children: const <Widget>[
                  HoronTabsTab(value: 'all', label: '전체'),
                  HoronTabsTab(value: 'active', label: '활성'),
                  HoronTabsTab(value: 'archived', label: '보관됨', enabled: false),
                ],
              ),
              const HoronTabsPanel(value: 'all', child: Text('전체 패널')),
              const HoronTabsPanel(value: 'active', child: Text('활성 패널')),
              const HoronTabsPanel(value: 'archived', child: Text('보관 패널')),
            ],
          ),
        ),
      ],
    );
  }
}

/// `variant="underline"` 문서형 탭입니다. 표면 파라미터는 쓰지 않습니다.
Widget _underlineTabs() => HoronTabs(
  children: <Widget>[
    HoronTabsList(
      variant: HoronTabsListVariant.underline,
      children: const <Widget>[
        HoronTabsTab(value: 'overview', label: '개요'),
        HoronTabsTab(value: 'members', label: '멤버', count: 4),
        HoronTabsTab(value: 'logs', label: '로그'),
      ],
    ),
    const HoronTabsPanel(value: 'overview', child: Text('개요 패널')),
    const HoronTabsPanel(value: 'members', child: Text('멤버 패널')),
    const HoronTabsPanel(value: 'logs', child: Text('로그 패널')),
  ],
);

/// sm·md·lg 세 단계의 알약 탭입니다. 높이 26/30/36, 좌우 10/16/16입니다.
Widget _sizes(HoronThemeData theme) => Wrap(
  spacing: theme.space.s6,
  runSpacing: theme.space.s6,
  crossAxisAlignment: WrapCrossAlignment.start,
  children: <Widget>[
    for (final (HoronTabsSize size, String name) in <(HoronTabsSize, String)>[
      (HoronTabsSize.sm, 'sm'),
      (HoronTabsSize.md, 'md'),
      (HoronTabsSize.lg, 'lg'),
    ])
      _Sample(
        label: name,
        child: HoronTabs(
          size: size,
          children: <Widget>[
            HoronTabsList(
              children: const <Widget>[
                HoronTabsTab(value: 'one', label: '개요', count: 2),
                HoronTabsTab(value: 'two', label: '멤버'),
              ],
            ),
            const HoronTabsPanel(value: 'one', child: Text('개요 패널')),
            const HoronTabsPanel(value: 'two', child: Text('멤버 패널')),
          ],
        ),
      ),
  ],
);

/// 변형 하나와 그 이름입니다.
class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: theme.space.s2,
      children: <Widget>[
        Text(
          label,
          style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        ),
        child,
      ],
    );
  }
}
