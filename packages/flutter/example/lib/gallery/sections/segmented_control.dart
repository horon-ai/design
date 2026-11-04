import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `segmented_control` 갤러리 섹션입니다.
///
/// 네 크기와 비활성 상태를 solid와 glass 두 표면에 같은 목록으로 놓고, inset·subtle
/// 트랙을 따로 보여 줍니다.
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
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: theme.space.s6,
        children: <Widget>[
          Text('Segmented control', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _controls(theme, HoronSegmentedControlSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _controls(theme, HoronSegmentedControlSurface.glass),
          ),
          SurfaceGroup(
            label: 'Inset / Subtle',
            child: Wrap(
              spacing: theme.space.s4,
              runSpacing: theme.space.s4,
              crossAxisAlignment: WrapCrossAlignment.start,
              children: <Widget>[
                _Cell(
                  label: 'inset 트랙 (잉크 5%)',
                  child: HoronSegmentedControl(
                    items: _items,
                    surface: HoronSegmentedControlSurface.inset,
                    value: 'day',
                  ),
                ),
                _Cell(
                  label: 'insetFaint 트랙 (잉크 4%)',
                  child: HoronSegmentedControl(
                    items: _items,
                    surface: HoronSegmentedControlSurface.insetFaint,
                    value: 'week',
                  ),
                ),
                _Cell(
                  label: 'subtle 트랙 (흰 알약)',
                  child: HoronSegmentedControl(
                    items: _items,
                    surface: HoronSegmentedControlSurface.subtle,
                    value: 'day',
                  ),
                ),
              ],
            ),
          ),
          Text(
            'Figma 62:379·110:765·88:723과 Paper 페이지 탭입니다. 선택 표시는 하나의 '
            '알약이고, 채움(fill)이면 알약이 옆 세그먼트로 미끄러지며, 글자 폭에 맞춘 '
            '트랙에서는 세그먼트 안에서 교차 페이드합니다. glass 트랙의 알약은 두꺼운 '
            '유리와 1px 림, 0 1 3 8% 그림자를 쓰고, 나머지 표면에서는 10% 잉크(또는 '
            '흰색)입니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 세그먼트 컨트롤 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _controls(HoronThemeData theme, HoronSegmentedControlSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Cell(
          label: 'sm (세그먼트 30, 여백 12)',
          child: HoronSegmentedControl(
            items: _items,
            size: HoronSegmentedControlSize.sm,
            surface: surface,
            value: 'day',
          ),
        ),
        _Cell(
          label: 'md (트랙 36, 채움)',
          child: HoronSegmentedControl(
            items: _items,
            surface: surface,
            value: 'day',
          ),
        ),
        _Cell(
          label: 'lg (트랙 44, 세그먼트 36)',
          child: HoronSegmentedControl(
            items: _items,
            size: HoronSegmentedControlSize.lg,
            surface: surface,
            value: 'week',
          ),
        ),
        _Cell(
          label: 'tab (여백 4, 간격 4)',
          child: HoronSegmentedControl(
            items: _items,
            size: HoronSegmentedControlSize.tab,
            surface: surface,
            value: 'day',
          ),
        ),
        _Cell(
          label: '비활성 세그먼트 (40%)',
          child: HoronSegmentedControl(
            items: _items,
            surface: surface,
            value: 'day',
          ),
        ),
      ],
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
