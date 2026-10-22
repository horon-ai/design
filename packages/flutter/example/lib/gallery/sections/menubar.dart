import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `menubar` 갤러리 섹션입니다.
///
/// 수평 메뉴 바는 태블릿·데스크톱 폭에서만 보입니다. 갤러리 상자는 폭이 좁을 수
/// 있으므로, 섹션에서는 [HoronMenubar.alwaysVisible]로 폭 판정을 끄고 모양을
/// 보여 줍니다. 폭 판정 자체는 `menubar_test.dart`가 단언합니다.
class HoronMenubarGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronMenubarGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Menubar',
      variants: <Widget>[
        HoronMenubar(
          alwaysVisible: true,
          semanticLabel: '편집기 메뉴',
          children: <Widget>[
            HoronMenubarMenu(
              trigger: const HoronMenubarTrigger(label: '파일'),
              children: <Widget>[
                HoronMenubarItem(
                  label: '새로 만들기',
                  onSelected: () {},
                  trailing: const HoronMenuShortcut(label: 'Cmd+N'),
                ),
                HoronMenubarItem(
                  label: '열기',
                  onSelected: () {},
                  trailing: const HoronMenuShortcut(label: 'Cmd+O'),
                ),
                const HoronMenubarSeparator(),
                HoronMenubarItem(label: '닫기', onSelected: () {}),
              ],
            ),
            HoronMenubarMenu(
              trigger: const HoronMenubarTrigger(label: '편집'),
              children: <Widget>[
                HoronMenubarItem(label: '되돌리기', onSelected: () {}),
                HoronMenubarItem(label: '다시 실행', onSelected: () {}),
              ],
            ),
            HoronMenubarMenu(
              trigger: const HoronMenubarTrigger(label: '보기'),
              children: <Widget>[
                const HoronMenubarLabel(label: '패널'),
                HoronMenubarItem(label: '사이드바', onSelected: () {}),
                HoronMenubarItem(label: '터미널', onSelected: () {}),
              ],
            ),
          ],
        ),
      ],
      states: <Widget>[
        HoronMenubar(
          alwaysVisible: true,
          semanticLabel: '비활성 포함',
          children: <Widget>[
            HoronMenubarMenu(
              trigger: const HoronMenubarTrigger(label: '파일'),
              children: <Widget>[
                HoronMenubarItem(label: '사용 가능', onSelected: () {}),
                const HoronMenubarItem(label: '사용 불가', enabled: false),
              ],
            ),
          ],
        ),
      ],
      notes:
          'React `menubar.tsx`를 옮겼습니다. `h-9`·`gap-1`·`p-1`·`rounded-md`·'
          '`border-border`·`bg-card`이고, 트리거는 `h-7`·`rounded-sm`·`px-3`입니다. '
          '계획대로 태블릿 폭(768) 미만에서는 아무것도 그리지 않습니다.',
    );
  }
}
