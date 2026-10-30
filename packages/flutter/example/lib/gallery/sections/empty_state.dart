import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `empty_state`의 갤러리 섹션입니다.
///
/// 일러스트·제목·설명·동작이 모두 있는 경우와 제목만 있는 경우를 보여 줍니다.
class HoronEmptyStateGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronEmptyStateGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        children: <Widget>[
          DecoratedBox(
            decoration: BoxDecoration(
              color: theme.colors.bgSubtle,
              borderRadius: BorderRadius.circular(theme.radius.md),
            ),
            child: HoronEmptyState(
              illustration: Icon(
                Icons.inbox_outlined,
                size: 96,
                color: theme.colors.textDisabled,
              ),
              title: '아직 대화가 없습니다',
              description: '새 대화를 시작하면 이 목록에 나타납니다.',
              action: HoronButton(label: '새 대화', onPressed: () {}),
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              color: theme.colors.bgSubtle,
              borderRadius: BorderRadius.circular(theme.radius.md),
            ),
            child: const HoronEmptyState(title: '검색 결과가 없습니다'),
          ),
        ],
      ),
    );
  }
}
