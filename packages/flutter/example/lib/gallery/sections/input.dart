import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/input.dart';

import '../section_scaffold.dart';

/// `input` 갤러리 섹션입니다.
///
/// React `input.tsx`에는 cva 변형이 없으므로 나열할 변형은 슬롯 구성뿐이고,
/// 상태는 default·invalid·disabled·read-only 넷입니다.
class HoronInputGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Input',
      variants: <Widget>[
        const _InputCell(
          label: 'Plain',
          child: HoronInput(hintText: 'name@horon.ai'),
        ),
        const _InputCell(
          label: 'Prefix',
          child: HoronInput(
            hintText: 'Amount',
            prefix: Icon(Icons.attach_money, size: 16),
          ),
        ),
        const _InputCell(
          label: 'Suffix',
          child: HoronInput(
            hintText: 'Search',
            suffix: Icon(Icons.search, size: 16),
          ),
        ),
        const _InputCell(
          label: 'Both slots',
          child: HoronInput(
            hintText: 'Amount',
            prefix: Text('₩'),
            suffix: Text('KRW'),
          ),
        ),
      ],
      states: <Widget>[
        const _InputCell(
          label: 'Default',
          child: HoronInput(hintText: 'Default'),
        ),
        const _InputCell(
          label: 'Invalid',
          child: HoronInput(hintText: 'Invalid', invalid: true),
        ),
        const _InputCell(
          label: 'Disabled',
          child: HoronInput(hintText: 'Disabled', disabled: true),
        ),
        const _InputCell(
          label: 'Read only',
          child: HoronInput(hintText: 'Read only', readOnly: true),
        ),
      ],
      notes:
          '높이 37(`h-[37px]`), 반경은 input 역할 8, 포커스 링은 ring 토큰 50%입니다. '
          '오류는 destructive 테두리와 옅은 링, 비활성은 input 토큰 50% 채움과 불투명도 50%입니다.',
    );
  }
}

/// 한 변형을 이름과 함께 보여 주는 칸입니다.
class _InputCell extends StatelessWidget {
  const _InputCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 240,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: HoronSpace.s1),
          child,
        ],
      ),
    );
  }
}
