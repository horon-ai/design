import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.
import 'package:horon_ui/src/components/tabs.dart';

import '../section_scaffold.dart';

/// `tabs` 갤러리 섹션입니다.
///
/// React `tabs.tsx`의 목록 변형 두 개(`default`·`line`)를 수평·수직 방향으로
/// 늘어놓고, 상태 칸에 선택 위치·비활성·아이콘 탭을 놓습니다.
class HoronTabsGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTabsGallerySection({super.key});

  /// 이름표를 붙인 탭 묶음 하나입니다.
  Widget _cell(
    BuildContext context, {
    required String label,
    HoronTabsVariant variant = HoronTabsVariant.defaultValue,
    bool vertical = false,
    String initialValue = 'account',
    bool disableSecond = false,
    bool withIcons = false,
  }) {
    return SizedBox(
      width: vertical ? 320 : 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s2),
          HoronTabs(
            initialValue: initialValue,
            vertical: vertical,
            children: <Widget>[
              HoronTabsList(
                variant: variant,
                children: <Widget>[
                  HoronTabsTrigger(
                    value: 'account',
                    label: '계정',
                    icon: withIcons ? const Icon(Icons.person_outline) : null,
                  ),
                  HoronTabsTrigger(
                    value: 'password',
                    label: '비밀번호',
                    disabled: disableSecond,
                  ),
                  const HoronTabsTrigger(value: 'notifications', label: '알림'),
                ],
              ),
              const HoronTabsContent(value: 'account', child: Text('계정 설정')),
              const HoronTabsContent(value: 'password', child: Text('비밀번호 설정')),
              const HoronTabsContent(
                value: 'notifications',
                child: Text('알림 설정'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Tabs',
      variants: <Widget>[
        _cell(context, label: 'default · horizontal'),
        _cell(
          context,
          label: 'line · horizontal',
          variant: HoronTabsVariant.line,
        ),
        _cell(context, label: 'default · vertical', vertical: true),
        _cell(
          context,
          label: 'line · vertical',
          variant: HoronTabsVariant.line,
          vertical: true,
        ),
      ],
      states: <Widget>[
        _cell(context, label: 'active first'),
        _cell(context, label: 'active last', initialValue: 'notifications'),
        _cell(
          context,
          label: 'line · active last',
          variant: HoronTabsVariant.line,
          initialValue: 'notifications',
        ),
        _cell(context, label: 'disabled trigger', disableSecond: true),
        _cell(context, label: 'with icon', withIcons: true),
      ],
      notes:
          'React `tabs.tsx`의 목록 변형 2개(default `bg-muted`, line `bg-transparent`)와 '
          '수평·수직 방향입니다. line 목록의 선택된 탭 바깥에 2px 인디케이터'
          '(`after:h-0.5`, 수직은 `after:w-0.5`)가 그려지고, 선택되지 않은 탭은 '
          '`text-foreground/60`으로 흐립니다.',
    );
  }
}
