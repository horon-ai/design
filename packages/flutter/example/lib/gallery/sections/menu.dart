import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `menu` 갤러리 섹션입니다.
///
/// 고정 폭 200 유리 패널, 라벨·구분선·단축키·비활성 항목·그룹을 보여 줍니다.
class HoronMenuGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMenuGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Menu',
      variants: <Widget>[
        HoronMenu(
          semanticLabel: '계정 메뉴',
          children: <Widget>[
            const HoronMenuLabel(label: '계정'),
            HoronMenuItem(label: '프로필', onSelected: () {}),
            HoronMenuItem(
              label: '설정',
              onSelected: () {},
              trailing: const HoronMenuShortcut(label: 'Cmd ,'),
            ),
            const HoronMenuSeparator(),
            HoronMenuItem(
              label: '로그아웃',
              onSelected: () {},
              trailing: const HoronMenuShortcut(label: 'Shift+Cmd+Q'),
            ),
          ],
        ),
        HoronMenu(
          semanticLabel: '그룹 메뉴',
          children: <Widget>[
            HoronMenuGroup(
              label: '정렬',
              children: <Widget>[
                HoronMenuItem(label: '이름순', onSelected: () {}),
                HoronMenuItem(label: '날짜순', onSelected: () {}),
              ],
            ),
            const HoronMenuSeparator(),
            HoronMenuGroup(
              label: '보기',
              children: <Widget>[
                HoronMenuItem(label: '목록', onSelected: () {}),
                HoronMenuItem(label: '격자', onSelected: () {}),
              ],
            ),
          ],
        ),
      ],
      states: <Widget>[
        HoronMenu(
          semanticLabel: '비활성 포함',
          children: <Widget>[
            HoronMenuItem(label: '사용 가능', onSelected: () {}),
            const HoronMenuItem(label: '사용 불가', enabled: false),
            const HoronMenuSeparator(),
            HoronMenuItem(
              label: '단축키만',
              onSelected: () {},
              trailing: const HoronMenuShortcut(label: 'Cmd+K'),
            ),
          ],
        ),
      ],
      notes:
          'React `menu.tsx`를 옮겼습니다. `.glass-strong` 표면에 `w-[200px]` 고정 폭, '
          '`gap-px`, `p-1`을 씁니다. 항목은 `text-xs`·`px-2.5`·`py-[7px]`·'
          '`rounded-[5px]`이고, hover·focus에서 `bg-foreground/5`를 칠합니다.',
    );
  }
}
