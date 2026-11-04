import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `skeleton`의 갤러리 섹션입니다.
///
/// 카드 세 모양을 solid와 glass 두 표면에 같은 목록으로 보여 주고, 블록·알약
/// 자리표시자를 함께 놓습니다.
class HoronSkeletonGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronSkeletonGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(
            label: 'Solid',
            child: _cards(theme, HoronSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _cards(theme, HoronSurface.glass),
          ),
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
        ],
      ),
    );
  }

  /// 한 표면의 카드 표본 목록입니다. 표면만 바뀌고 모양은 같습니다.
  Widget _cards(HoronThemeData theme, HoronSurface surface) {
    return Wrap(
      spacing: theme.space.s6,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        HoronSkeletonCard.row(surface: surface),
        HoronSkeletonCard.card(surface: surface),
        HoronSkeletonCard.text(surface: surface),
      ],
    );
  }
}
