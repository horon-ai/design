import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `progress`의 갤러리 섹션입니다.
///
/// 0%, 25%, 60%, 100% 네 값과 값 없는 불확정 막대를 세로로 쌓아 트랙과 채움을
/// 한눈에 보여 줍니다. 불확정 막대는 1/3 폭 채움이 1.4초 주기로 지나갑니다.
class HoronProgressGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronProgressGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    const List<(double, String)> cases = <(double, String)>[
      (0, '0%'),
      (0.25, '25%'),
      (0.6, '60%'),
      (1, '100%'),
    ];

    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          for (final (double value, String label) in cases) ...<Widget>[
            Text(
              label,
              style: theme.text.caption.copyWith(
                color: theme.colors.textSecondary,
              ),
            ),
            SizedBox(height: theme.space.s1),
            HoronProgress(value: value, semanticsLabel: label),
            SizedBox(height: theme.space.s3),
          ],
          Text(
            '불확정',
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
          SizedBox(height: theme.space.s1),
          // 값을 생략하면 React의 `data-indeterminate`처럼 1/3 폭 채움이 흐릅니다.
          const HoronProgress(semanticsLabel: '불확정'),
        ],
      ),
    );
  }
}
