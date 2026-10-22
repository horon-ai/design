import 'package:flutter/material.dart';
import 'package:horon_ui/src/components/avatar.dart';

import '../section_scaffold.dart';

/// `avatar` 갤러리 섹션입니다.
class HoronAvatarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronAvatarGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Avatar',
      variants: <Widget>[
        for (final HoronAvatarSize size in HoronAvatarSize.values)
          HoronAvatar(size: size, name: '민열 김'),
      ],
      states: <Widget>[
        const HoronAvatar(name: 'Minyeol Kim'),
        const HoronAvatar(name: 'Minyeol Kim', badge: HoronAvatarBadge()),
        const HoronAvatar(
          name: 'Minyeol Kim',
          size: HoronAvatarSize.lg,
          badge: HoronAvatarBadge(),
        ),
        const HoronAvatar(
          name: 'Minyeol Kim',
          size: HoronAvatarSize.sm,
          badge: HoronAvatarBadge(),
        ),
        const HoronAvatar(
          fallback: HoronAvatarFallback(child: Icon(Icons.person)),
        ),
        HoronAvatarGroup(
          children: <Widget>[
            const HoronAvatar(name: 'A B'),
            const HoronAvatar(name: 'C D'),
            const HoronAvatar(name: 'E F'),
            HoronAvatarGroupCount(count: 3),
          ],
        ),
        HoronAvatarGroup(
          size: HoronAvatarSize.lg,
          children: <Widget>[
            const HoronAvatar(size: HoronAvatarSize.lg, name: 'A B'),
            const HoronAvatar(size: HoronAvatarSize.lg, name: 'C D'),
            HoronAvatarGroupCount(count: 5),
          ],
        ),
        HoronAvatarGroup(
          size: HoronAvatarSize.sm,
          children: <Widget>[
            const HoronAvatar(size: HoronAvatarSize.sm, name: 'A B'),
            const HoronAvatar(size: HoronAvatarSize.sm, name: 'C D'),
            HoronAvatarGroupCount(count: 9),
          ],
        ),
      ],
      notes:
          'React `avatar.tsx`의 여섯 조각입니다. 크기는 sm 24, default 32, lg 40이고 이미지 위에 '
          '1px `border` 링이 얹힙니다. 이미지가 없거나 실패하면 이름의 이니셜이 그려집니다. '
          '묶음은 이웃한 아바타를 8px 겹치고 `AvatarGroupCount`가 남은 수를 보여 줍니다.',
    );
  }
}
