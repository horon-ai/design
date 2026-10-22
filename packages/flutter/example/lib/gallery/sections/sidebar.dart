import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `sidebar` 갤러리 섹션입니다.
///
/// React `sidebar.tsx`에는 cva 변형이 없습니다. 변형 칸에 펼침(256)과 접힘(56),
/// 그리고 실제로 폭이 바뀌는 토글을 놓고, 상태 칸에 활성·비활성 항목과 본문
/// 자리(`SidebarInset`)를 놓습니다.
class HoronSidebarGallerySection extends StatefulWidget {
  /// 기본 생성자입니다.
  const HoronSidebarGallerySection({super.key});

  @override
  State<HoronSidebarGallerySection> createState() =>
      _HoronSidebarGallerySectionState();
}

class _HoronSidebarGallerySectionState
    extends State<HoronSidebarGallerySection> {
  String _active = 'inbox';

  /// 메뉴 항목 셋을 가진 사이드바 하나입니다.
  ///
  /// [interactive]가 참이면 토글 단추가 스스로 폭을 바꾸고, 거짓이면 [open]이
  /// 고정됩니다.
  Widget _sidebar({bool open = true, bool interactive = false}) {
    return HoronSidebar(
      open: interactive ? null : open,
      defaultOpen: open,
      children: <Widget>[
        HoronSidebarHeader(
          children: <Widget>[
            HoronSidebarTrigger(semanticLabel: 'Toggle sidebar'),
            const Text('Horon'),
          ],
        ),
        HoronSidebarContent(
          children: <Widget>[
            HoronSidebarGroup(
              children: <Widget>[
                for (final String item in <String>['inbox', 'sent', 'drafts'])
                  HoronSidebarMenuItem(
                    child: HoronSidebarMenuButton(
                      label: switch (item) {
                        'inbox' => '받은 편지함',
                        'sent' => '보낸 편지함',
                        _ => '임시 보관함',
                      },
                      icon: Icon(switch (item) {
                        'inbox' => Icons.inbox,
                        'sent' => Icons.send,
                        _ => Icons.drafts,
                      }),
                      active: _active == item,
                      onPressed: () => setState(() => _active = item),
                    ),
                  ),
              ],
            ),
          ],
        ),
        const HoronSidebarFooter(
          children: <Widget>[
            HoronSidebarMenuButton(label: '설정', icon: Icon(Icons.settings)),
          ],
        ),
      ],
    );
  }

  /// 높이를 정한 틀 안에 사이드바와 본문 자리를 나란히 놓습니다.
  ///
  /// 사이드바는 `h-full`이라 부모가 높이를 정해야 하고, [HoronSidebarInset]은
  /// `flex-1`이라 `Row` 안에서만 설 수 있습니다.
  Widget _frame(String label, Widget sidebar) {
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s2),
          SizedBox(
            height: 260,
            child: Row(
              children: <Widget>[
                sidebar,
                const HoronSidebarInset(child: SizedBox.shrink()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 비활성 항목만 있는 사이드바입니다.
  Widget _disabledSidebar() {
    return const HoronSidebar(
      children: <Widget>[
        HoronSidebarHeader(children: <Widget>[Text('Horon')]),
        HoronSidebarContent(
          children: <Widget>[
            HoronSidebarGroup(
              children: <Widget>[
                HoronSidebarMenuItem(
                  child: HoronSidebarMenuButton(
                    label: '받은 편지함',
                    icon: Icon(Icons.inbox),
                    disabled: true,
                  ),
                ),
                HoronSidebarMenuItem(
                  child: HoronSidebarMenuButton(
                    label: '보낸 편지함',
                    icon: Icon(Icons.send),
                    disabled: true,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Sidebar',
      variants: <Widget>[
        _frame('expanded · 256', _sidebar()),
        _frame('collapsed · 56', _sidebar(open: false)),
        _frame('interactive toggle', _sidebar(interactive: true)),
      ],
      states: <Widget>[
        _frame('active item', _sidebar()),
        _frame('disabled items', _disabledSidebar()),
        SizedBox(
          width: 300,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(
                'collapsed with inset',
                style: Theme.of(context).textTheme.labelSmall,
              ),
              const SizedBox(height: HoronSpace.s2),
              SizedBox(
                height: 200,
                child: Row(
                  children: <Widget>[
                    _sidebar(open: false),
                    HoronSidebarInset(
                      child: Padding(
                        padding: const EdgeInsets.all(HoronSpace.s4),
                        child: Text(
                          'SidebarInset',
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
      notes:
          'React `sidebar.tsx`는 펼침 `w-64`(256)에서 접힘 `w-14`(56)으로 '
          '`transition-[width] duration-200 ease-out`으로 줄어듭니다. 접히면 메뉴 '
          '라벨이 사라지고 아이콘만 남으며(`[&>span]:hidden`), 표면·테두리·강조는 '
          '`sidebar`·`sidebar-border`·`sidebar-primary` 슬롯에서 읽습니다.',
    );
  }
}
