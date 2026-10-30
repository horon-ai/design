import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `spinner`의 갤러리 섹션입니다.
///
/// 네 이름 붙은 크기와 픽셀 크기 하나를 나란히 보여 줍니다.
class HoronSpinnerGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronSpinnerGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    const List<(HoronSpinnerSize, String)> cases = <(HoronSpinnerSize, String)>[
      (HoronSpinnerSize.xs, 'xs · 14'),
      (HoronSpinnerSize.sm, 'sm · 16'),
      (HoronSpinnerSize.md, 'md · 24'),
      (HoronSpinnerSize.lg, 'lg · 32'),
    ];

    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          for (final (HoronSpinnerSize size, String label) in cases)
            Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                HoronSpinner(size: size),
                SizedBox(height: theme.space.s1),
                Text(
                  label,
                  style: theme.text.caption.copyWith(
                    color: theme.colors.textSecondary,
                  ),
                ),
              ],
            ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              const HoronSpinner(pixelSize: 15),
              SizedBox(height: theme.space.s1),
              Text(
                '픽셀 15',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
