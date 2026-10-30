import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 통합 스크립트가 배럴에 이 컴포넌트를 넣으면 이 줄은 지워집니다.
// ignore: implementation_imports
import 'package:horon_ui/src/components/filter_bar.dart';

/// Filter Bar 갤러리 섹션입니다.
///
/// 개수가 붙은 필터와 글자만 있는 필터를 나란히 놓습니다. 옵션을 누르면 10% 잉크
/// 표시자가 그 자리로 옮겨 갑니다.
class HoronFilterBarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronFilterBarGallerySection({super.key});

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
            label: '개수 포함',
            child: HoronFilterBar(
              items: const <HoronFilterBarItem>[
                HoronFilterBarItem(value: 'all', label: '전체', count: 12),
                HoronFilterBarItem(value: 'running', label: '실행 중', count: 3),
                HoronFilterBarItem(value: 'idle', label: '대기'),
                HoronFilterBarItem(
                  value: 'failed',
                  label: '실패',
                  count: 1,
                  disabled: true,
                ),
              ],
            ),
          ),
          _Sample(
            label: '글자만',
            child: HoronFilterBar(
              items: const <HoronFilterBarItem>[
                HoronFilterBarItem(value: 'day', label: '오늘'),
                HoronFilterBarItem(value: 'week', label: '이번 주'),
                HoronFilterBarItem(value: 'month', label: '이번 달'),
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
