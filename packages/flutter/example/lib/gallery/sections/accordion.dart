import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유합니다. 이 파일은 자기 컴포넌트만 하위 경로로 읽어,
// 배럴에 export가 추가된 뒤에도 `unnecessary_import`가 생기지 않게 합니다.

import '../section_scaffold.dart';

/// `accordion` 갤러리 섹션입니다.
///
/// React `accordion.tsx`에는 cva 변형이 없습니다. 변형 칸에 단일·다중 열림을,
/// 상태 칸에 처음부터 열린 항목·비활성 항목·셰브론 회전을 놓습니다.
class HoronAccordionGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronAccordionGallerySection({super.key});

  /// 항목 셋을 가진 아코디언 하나입니다.
  Widget _cell(
    BuildContext context, {
    required String label,
    bool multiple = false,
    Set<String> initialValue = const <String>{},
    bool disableSecond = false,
  }) {
    return SizedBox(
      width: 340,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s2),
          HoronAccordion(
            multiple: multiple,
            initialValue: initialValue,
            children: <Widget>[
              const HoronAccordionItem(
                value: 'shipping',
                trigger: '배송',
                child: Text('영업일 기준 이틀 안에 도착합니다.'),
              ),
              HoronAccordionItem(
                value: 'returns',
                trigger: '반품',
                disabled: disableSecond,
                child: const Text('받은 날부터 30일 안에 반납할 수 있습니다.'),
              ),
              const HoronAccordionItem(
                value: 'payment',
                trigger: '결제',
                child: Text('카드, 계좌이체, 간편결제를 받습니다.'),
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
      title: 'Accordion',
      variants: <Widget>[
        _cell(context, label: 'single · all closed'),
        _cell(
          context,
          label: 'single · first open',
          initialValue: <String>{'shipping'},
        ),
        _cell(
          context,
          label: 'multiple · two open',
          multiple: true,
          initialValue: <String>{'shipping', 'returns'},
        ),
      ],
      states: <Widget>[
        _cell(
          context,
          label: 'open (chevron rotated)',
          initialValue: <String>{'payment'},
        ),
        _cell(context, label: 'disabled item', disableSecond: true),
        _cell(
          context,
          label: 'multiple · disabled item open',
          multiple: true,
          initialValue: <String>{'returns'},
          disableSecond: true,
        ),
      ],
      notes:
          'React `accordion.tsx`의 항목은 `border-b border-border`로 구분되고, 셰브론은 '
          '`transition-transform duration-200`으로 180도 돕니다. 비활성 항목은 '
          '`disabled:opacity-50`이며 눌러도 열리지 않습니다.',
    );
  }
}
