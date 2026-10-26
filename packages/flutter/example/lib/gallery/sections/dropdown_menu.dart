import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `dropdown_menu` 갤러리 섹션입니다.
///
/// 항목·그룹 라벨·구분선·체크 항목·라디오 항목·서브메뉴를 한 패널에 담습니다.
class HoronDropdownMenuGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronDropdownMenuGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Dropdown Menu',
      variants: <Widget>[
        HoronDropdownMenu(
          semanticLabel: '보기 메뉴',
          trigger: const HoronDropdownMenuTrigger(label: '보기'),
          children: <Widget>[
            const HoronDropdownMenuLabel(label: '확대'),
            HoronDropdownMenuItem(
              label: '확대',
              onSelected: () {},
              trailing: const HoronMenuShortcut(label: '⌘+'),
            ),
            HoronDropdownMenuItem(
              label: '축소',
              onSelected: () {},
              trailing: const HoronMenuShortcut(label: '⌘-'),
            ),
            const HoronDropdownMenuSeparator(),
            HoronDropdownMenuSubmenu(
              label: '정렬 기준',
              children: <Widget>[
                HoronDropdownMenuItem(label: '이름', onSelected: () {}),
                HoronDropdownMenuItem(label: '날짜', onSelected: () {}),
              ],
            ),
            const HoronDropdownMenuItem(label: '사용 불가', enabled: false),
          ],
        ),
        HoronDropdownMenu(
          semanticLabel: '체크 메뉴',
          trigger: const HoronDropdownMenuTrigger(label: '표시'),
          children: <Widget>[
            HoronDropdownMenuCheckboxItem(
              label: '눈금',
              checked: true,
              onChanged: (bool value) {},
            ),
            HoronDropdownMenuCheckboxItem(
              label: '눈금 이름',
              checked: false,
              onChanged: (bool value) {},
            ),
            const HoronDropdownMenuSeparator(),
            HoronDropdownMenuCheckboxItem(
              label: '전체 화면',
              checked: false,
              onChanged: (bool value) {},
            ),
          ],
        ),
        HoronDropdownMenu(
          semanticLabel: '밀도 메뉴',
          trigger: const HoronDropdownMenuTrigger(label: '밀도'),
          children: <Widget>[
            HoronDropdownMenuRadioGroup<String>(
              value: 'compact',
              onChanged: (String value) {},
              children: <Widget>[
                const HoronDropdownMenuRadioItem<String>(
                  value: 'compact',
                  label: '좁게',
                ),
                const HoronDropdownMenuRadioItem<String>(
                  value: 'roomy',
                  label: '넓게',
                ),
                const HoronDropdownMenuRadioItem<String>(
                  value: 'auto',
                  label: '자동',
                ),
              ],
            ),
          ],
        ),
      ],
      states: <Widget>[
        HoronDropdownMenu(
          semanticLabel: '그룹 메뉴',
          trigger: const HoronDropdownMenuTrigger(label: '그룹'),
          children: <Widget>[
            HoronDropdownMenuGroup(
              label: '파일',
              children: <Widget>[
                HoronDropdownMenuItem(label: '새로 만들기', onSelected: () {}),
                HoronDropdownMenuItem(label: '열기', onSelected: () {}),
              ],
            ),
            const HoronDropdownMenuSeparator(),
            HoronDropdownMenuGroup(
              label: '편집',
              children: <Widget>[
                HoronDropdownMenuItem(label: '되돌리기', onSelected: () {}),
                HoronDropdownMenuItem(label: '다시 실행', onSelected: () {}),
              ],
            ),
          ],
        ),
      ],
      notes:
          'React `dropdown-menu.tsx`를 옮겼습니다. 체크 항목은 메뉴를 닫지 않고, 라디오 '
          '항목은 고르면 닫힙니다. 서브메뉴는 두 단계까지만 열리고, 오른쪽에 자리가 '
          '없으면 왼쪽으로 뒤집힙니다.',
    );
  }
}
