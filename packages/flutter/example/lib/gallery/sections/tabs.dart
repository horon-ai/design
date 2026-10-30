import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports

/// Tabs 갤러리 섹션입니다.
///
/// 아이콘·개수가 붙은 탭과 글자만 있는 탭을 나란히 놓습니다. 탭을 누르면 선택 표시자가
/// 옮겨 가고 아래 패널이 바뀝니다.
class HoronTabsGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTabsGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          _Sample(
            label: '아이콘과 개수',
            child: HoronTabs(
              children: <Widget>[
                HoronTabsList(
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
                  children: <Widget>[
                    const HoronTabsTab(value: 'all', label: '전체'),
                    const HoronTabsTab(value: 'active', label: '활성'),
                    const HoronTabsTab(
                      value: 'archived',
                      label: '보관됨',
                      enabled: false,
                    ),
                  ],
                ),
                const HoronTabsPanel(value: 'all', child: Text('전체 패널')),
                const HoronTabsPanel(value: 'active', child: Text('활성 패널')),
                const HoronTabsPanel(value: 'archived', child: Text('보관 패널')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

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
