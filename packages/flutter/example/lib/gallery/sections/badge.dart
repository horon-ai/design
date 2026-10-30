import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `badge`의 갤러리 섹션입니다.
///
/// 네 톤과 상태 점이 붙은 배지를 한 줄로 보여 줍니다.
class HoronBadgeGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronBadgeGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s3,
        runSpacing: theme.space.s2,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          const HoronBadge(label: 'Neutral'),
          const HoronBadge(label: 'Brand', tone: HoronBadgeTone.brand),
          const HoronBadge(label: 'Danger', tone: HoronBadgeTone.danger),
          const HoronBadge(label: 'Solid', tone: HoronBadgeTone.solid),
          const HoronBadge(
            label: 'Live',
            tone: HoronBadgeTone.brand,
            dot: true,
          ),
          const HoronBadge(label: '주의', tone: HoronBadgeTone.danger, dot: true),
        ],
      ),
    );
  }
}
