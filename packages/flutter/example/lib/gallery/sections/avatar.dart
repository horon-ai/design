import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// 갤러리 안에서만 쓰는 24×24 PNG입니다. 실제 이미지가 있는 아바타를 그리려고 인라인으로
/// 넣습니다(갤러리는 자산을 읽지 않습니다).
final MemoryImage _sampleAvatarImage = MemoryImage(
  base64Decode(
    'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA90lEQVR42rXMCUoCARiG4e+oURRFURRFYiW2idUwMtmkaZOJZouI2CZiiYjtImJEFN3l7RT/c4BHoRGH8KjL6liCyLhHdCLJxqTP1tQhsek08ZkMu7PHOHMB7nyOxEIeb7FAcqmIv1wiFbrgKHxFdqVMsFYhF6mSj9YorF9ztnmLLPPz7XtkmV/G6sgyL8cbyDKv7DSRZV7de0SWec1pIcv8xm0jy/wu0UGWed3rIsu8sf+ELPPmwQuyzB/8N2SZt1IfyDJvp3vIMu9k+sgy72YHyDJ/DobIMn89+USW+fvpF7LMe/lvZJn3Cz/IMh8Uf5FlPiz98Q/mFG0bxxCgxwAAAABJRU5ErkJggg==',
  ),
);

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
        HoronAvatar(
          name: 'Minyeol Kim',
          image: HoronAvatarImage(image: _sampleAvatarImage),
        ),
        HoronAvatar(
          name: 'Minyeol Kim',
          size: HoronAvatarSize.lg,
          image: HoronAvatarImage(image: _sampleAvatarImage),
          badge: const HoronAvatarBadge(),
        ),
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
