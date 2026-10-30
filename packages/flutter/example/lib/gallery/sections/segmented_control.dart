import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `segmented_control` 갤러리 섹션입니다.
///
/// 네 크기를 나란히 놓고, 네 표면과 비활성 상태를 따로 보여 줍니다.
class HoronSegmentedControlGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSegmentedControlGallerySection({super.key});

  static const List<HoronSegmentedItem> _items = <HoronSegmentedItem>[
    HoronSegmentedItem(value: 'day', label: '일간'),
    HoronSegmentedItem(value: 'week', label: '주간'),
    HoronSegmentedItem(value: 'month', label: '월간', disabled: true),
  ];

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Segmented control',
      variants: <Widget>[
        const _Cell(
          label: 'sm (세그먼트 30, 여백 12)',
          child: HoronSegmentedControl(
            items: _items,
            size: HoronSegmentedControlSize.sm,
            value: 'day',
          ),
        ),
        const _Cell(
          label: 'md (트랙 36, 채움)',
          child: HoronSegmentedControl(items: _items, value: 'day'),
        ),
        const _Cell(
          label: 'lg (트랙 44, 세그먼트 36)',
          child: HoronSegmentedControl(
            items: _items,
            size: HoronSegmentedControlSize.lg,
            value: 'week',
          ),
        ),
        const _Cell(
          label: 'tab (여백 4, 간격 4)',
          child: HoronSegmentedControl(
            items: _items,
            size: HoronSegmentedControlSize.tab,
            value: 'day',
          ),
        ),
      ],
      states: <Widget>[
        const _Cell(
          label: 'glass 트랙',
          child: HoronSegmentedControl(items: _items, value: 'day'),
        ),
        const _Cell(
          label: 'inset 트랙 (잉크 5%)',
          child: HoronSegmentedControl(
            items: _items,
            surface: HoronSegmentedControlSurface.inset,
            value: 'day',
          ),
        ),
        const _Cell(
          label: 'insetFaint 트랙 (잉크 4%)',
          child: HoronSegmentedControl(
            items: _items,
            surface: HoronSegmentedControlSurface.insetFaint,
            value: 'week',
          ),
        ),
        const _Cell(
          label: 'subtle 트랙 (흰 알약)',
          child: HoronSegmentedControl(
            items: _items,
            surface: HoronSegmentedControlSurface.subtle,
            value: 'day',
          ),
        ),
        const _Cell(
          label: '비활성 세그먼트 (40%)',
          child: HoronSegmentedControl(items: _items, value: 'day'),
        ),
      ],
      notes:
          'Figma 62:379·110:765·88:723과 Paper 페이지 탭입니다. 선택 표시는 하나의 알약이고, '
          '채움(fill)이면 알약이 옆 세그먼트로 미끄러지며, 글자 폭에 맞춘 트랙에서는 '
          '세그먼트 안에서 교차 페이드합니다. glass 트랙의 알약은 두꺼운 유리와 1px 림, '
          '0 1 3 8% 그림자를 쓰고, 나머지 표면에서는 10% 잉크(또는 흰색)입니다.',
    );
  }
}

/// 세그먼트 컨트롤 하나를 캡션과 함께 보여 주는 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            label,
            style: horon.text.caption.copyWith(
              color: horon.colors.textSecondary,
            ),
          ),
          SizedBox(height: horon.space.s1_5),
          child,
        ],
      ),
    );
  }
}
