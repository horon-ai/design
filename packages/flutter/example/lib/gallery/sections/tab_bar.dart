import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports
import 'package:horon_ui/src/components/tab_bar.dart';

/// Tab Bar 갤러리 섹션입니다.
///
/// 유리 표면(`surface="glass"`)과 평평한 표면(`surface="flat"`)을 나란히 놓습니다.
/// 탭을 누르면 10% 잉크 표시자가 그 자리로 옮겨 갑니다.
class HoronTabBarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTabBarGallerySection({super.key});

  static const List<HoronTabBarItem> _items = <HoronTabBarItem>[
    HoronTabBarItem(value: 'home', label: '홈', icon: Icon(Icons.home_outlined)),
    HoronTabBarItem(
      value: 'agents',
      label: '에이전트',
      icon: Icon(Icons.smart_toy_outlined),
    ),
    HoronTabBarItem(
      value: 'chat',
      label: '대화',
      icon: Icon(Icons.chat_bubble_outline),
    ),
    HoronTabBarItem(
      value: 'files',
      label: '파일',
      icon: Icon(Icons.folder_outlined),
    ),
    HoronTabBarItem(
      value: 'settings',
      label: '설정',
      icon: Icon(Icons.settings_outlined),
    ),
  ];

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
            label: 'surface="glass"',
            child: const HoronTabBar(items: _items),
          ),
          _Sample(
            label: 'surface="flat"',
            child: const HoronTabBar(items: _items, glass: false),
          ),
          _Sample(
            label: '세 탭',
            child: const HoronTabBar(
              items: <HoronTabBarItem>[
                HoronTabBarItem(
                  value: 'chat',
                  label: '대화',
                  icon: Icon(Icons.chat_bubble_outline),
                ),
                HoronTabBarItem(
                  value: 'files',
                  label: '파일',
                  icon: Icon(Icons.folder_outlined),
                ),
                HoronTabBarItem(
                  value: 'settings',
                  label: '설정',
                  icon: Icon(Icons.settings_outlined),
                ),
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
