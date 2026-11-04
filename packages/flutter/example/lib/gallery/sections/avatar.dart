import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// `avatar`의 갤러리 섹션입니다.
///
/// 네 크기, 세 모양, sky 색조, 상태 점과 상태 점 테두리 색을 한 번에 보여 줍니다.
class HoronAvatarGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronAvatarGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    Widget labelled(String label, Widget child) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          child,
          SizedBox(height: theme.space.s1),
          Text(
            label,
            style: theme.text.caption.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      );
    }

    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Wrap(
        spacing: theme.space.s6,
        runSpacing: theme.space.s4,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          labelled(
            'sm · 24',
            const HoronAvatar.initials('MJ', size: HoronAvatarSize.sm),
          ),
          labelled('md · 32', const HoronAvatar.initials('MJ')),
          labelled(
            'lg · 40',
            const HoronAvatar.initials('MJ', size: HoronAvatarSize.lg),
          ),
          labelled(
            'xl · 56',
            const HoronAvatar.initials('MJ', size: HoronAvatarSize.xl),
          ),
          labelled('bot', const HoronAvatar.bot(size: HoronAvatarSize.lg)),
          labelled('sky', const HoronAvatar.initials('MJ', sky: true)),
          labelled(
            '이미지 + 대체',
            const HoronAvatar.image(
              imageUrl: 'https://invalid.invalid/avatar.png',
              initials: 'AB',
              size: HoronAvatarSize.lg,
            ),
          ),
          labelled(
            'live',
            const HoronAvatar.initials(
              'MJ',
              size: HoronAvatarSize.lg,
              live: true,
            ),
          ),
          labelled(
            'live + 색조 테두리',
            HoronAvatar.initials(
              'MJ',
              size: HoronAvatarSize.lg,
              live: true,
              // 유리 패널이나 색조 바탕 위에서는 뒤 표면 색을 넘깁니다.
              liveRingColor: theme.colors.bgSubtle,
            ),
          ),
        ],
      ),
    );
  }
}
