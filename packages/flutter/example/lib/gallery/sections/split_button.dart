import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/split_button.dart';

/// `split_button` 갤러리 섹션입니다.
///
/// 기본, 아이콘 있음, 메뉴 열림, 비활성 네 상태를 나란히 보여 줍니다.
class HoronSplitButtonGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSplitButtonGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s6,
        crossAxisAlignment: WrapCrossAlignment.end,
        children: <Widget>[
          _Sample(
            label: '기본',
            child: HoronSplitButton(
              label: 'Run',
              onPressed: () {},
              onMenuPressed: () {},
            ),
          ),
          _Sample(
            label: '아이콘 있음',
            child: HoronSplitButton(
              label: 'Deploy',
              icon: const Icon(Icons.play_arrow),
              onPressed: () {},
              onMenuPressed: () {},
            ),
          ),
          _Sample(
            label: '메뉴 열림',
            child: HoronSplitButton(
              label: 'Deploy',
              menuOpen: true,
              onPressed: () {},
              onMenuPressed: () {},
            ),
          ),
          _Sample(
            label: '비활성',
            child: HoronSplitButton(
              label: 'Deploy',
              disabled: true,
              onPressed: () {},
              onMenuPressed: () {},
            ),
          ),
        ],
      ),
    );
  }
}

class _Sample extends StatelessWidget {
  const _Sample({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Text(
          label,
          style: theme.text.labelSm.copyWith(color: theme.colors.textSecondary),
        ),
        SizedBox(height: theme.space.s2),
        child,
      ],
    );
  }
}
