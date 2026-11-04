import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `select` 갤러리 섹션입니다.
///
/// 필드 트리거와 칩 트리거, 선택·오류·비활성 상태를 solid와 glass 두 표면에 같은
/// 목록으로 보여 줍니다.
class HoronSelectGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronSelectGallerySection({super.key});

  static const List<HoronSelectItem> _items = <HoronSelectItem>[
    HoronSelectItem(value: 'ko', label: '한국어'),
    HoronSelectItem(value: 'en', label: 'English'),
    HoronSelectItem(value: 'ja', label: '日本語', disabled: true),
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
          Text('Select', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _selects(theme, HoronInputSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _selects(theme, HoronInputSurface.glass),
          ),
          Text(
            'Figma `Select`(58:162) 트리거와 `Select list`(88:495) 목록입니다. 목록은 '
            '두꺼운 유리(반경 20, 안쪽 여백 6)에 40px 행, 선택 행은 `overlay-ink-6`과 '
            '18px 체크입니다. 트리거의 캐럿은 16px이고 열리면 180° 돕니다. React의 '
            '`variant="chip"`은 `export type` 유니온이 아니라서 Flutter에서는 `chip` '
            '불리언으로 받습니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 셀렉트 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _selects(HoronThemeData theme, HoronInputSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _Cell(
          label: '필드',
          child: HoronSelect(
            items: _items,
            surface: surface,
            placeholder: '언어',
          ),
        ),
        _Cell(
          label: '필드 · 선택됨',
          child: HoronSelect(items: _items, surface: surface, value: 'ko'),
        ),
        _Cell(
          label: '칩 (32px 알약)',
          child: HoronSelect(
            items: _items,
            chip: true,
            surface: surface,
            placeholder: '언어',
          ),
        ),
        _Cell(
          label: 'Invalid',
          child: HoronSelect(
            items: _items,
            surface: surface,
            invalid: true,
            placeholder: '언어',
          ),
        ),
        _Cell(
          label: 'Disabled',
          child: HoronSelect(
            items: _items,
            surface: surface,
            disabled: true,
            placeholder: '언어',
          ),
        ),
        _Cell(
          label: '캐럿 없음',
          child: HoronSelect(
            items: _items,
            surface: surface,
            showIndicator: false,
            placeholder: '언어',
          ),
        ),
      ],
    );
  }
}

/// 셀렉트 하나를 캡션과 함께 보여 주는 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 240,
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
