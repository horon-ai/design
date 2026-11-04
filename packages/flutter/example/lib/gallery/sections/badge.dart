import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `badge`의 갤러리 섹션입니다.
///
/// 톤마다 세 크기를 상태 점과 함께 한 줄로 보여 줍니다.
class HoronBadgeGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBadgeGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s4,
        children: <Widget>[
          for (final HoronBadgeTone tone in HoronBadgeTone.values)
            Row(
              mainAxisSize: MainAxisSize.min,
              spacing: theme.space.s4,
              children: <Widget>[
                SizedBox(
                  width: 72,
                  child: Text(
                    tone.name,
                    style: theme.text.caption.copyWith(
                      color: theme.colors.textSecondary,
                    ),
                  ),
                ),
                for (final HoronBadgeSize size in HoronBadgeSize.values)
                  Wrap(
                    spacing: theme.space.s2,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: <Widget>[
                      HoronBadge(
                        label: size.name,
                        tone: tone,
                        size: size,
                        dot: true,
                      ),
                    ],
                  ),
              ],
            ),
        ],
      ),
    );
  }
}
