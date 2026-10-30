import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `skeleton`의 갤러리 섹션입니다.
///
/// 블록·알약 자리표시자와 카드 세 모양을 함께 보여 줍니다.
class HoronSkeletonGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronSkeletonGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.start,
        children: <Widget>[
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '블록 / 알약',
                style: theme.text.caption.copyWith(
                  color: theme.colors.textSecondary,
                ),
              ),
              SizedBox(height: theme.space.s2),
              const HoronSkeleton(width: 200, height: 10),
              SizedBox(height: theme.space.s2),
              const HoronSkeleton(width: 120, height: 8),
              SizedBox(height: theme.space.s2),
              const HoronSkeleton(width: 36, height: 36, pill: true),
            ],
          ),
          const HoronSkeletonCard.row(),
          const HoronSkeletonCard.card(),
          const HoronSkeletonCard.text(),
        ],
      ),
    );
  }
}
