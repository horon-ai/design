import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `select` 갤러리 섹션입니다.
///
/// 두 표면의 필드 트리거와 칩 트리거, 오류·비활성 상태를 나란히 보여 줍니다.
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
    return GallerySectionScaffold(
      title: 'Select',
      variants: <Widget>[
        const _Cell(
          label: '필드 · glass (body-md)',
          child: HoronSelect(items: _items, placeholder: '언어'),
        ),
        const _Cell(
          label: '필드 · solid (body-lg)',
          child: HoronSelect(
            items: _items,
            surface: HoronInputSurface.solid,
            placeholder: '언어',
          ),
        ),
        const _Cell(
          label: '필드 · 선택됨',
          child: HoronSelect(items: _items, value: 'ko'),
        ),
        const _Cell(
          label: '칩 (32px 알약)',
          child: HoronSelect(items: _items, chip: true, placeholder: '언어'),
        ),
      ],
      states: <Widget>[
        const _Cell(
          label: 'Invalid',
          child: HoronSelect(items: _items, invalid: true, placeholder: '언어'),
        ),
        const _Cell(
          label: 'Disabled',
          child: HoronSelect(items: _items, disabled: true, placeholder: '언어'),
        ),
        const _Cell(
          label: '캐럿 없음',
          child: HoronSelect(
            items: _items,
            showIndicator: false,
            placeholder: '언어',
          ),
        ),
      ],
      notes:
          'Figma `Select`(58:162) 트리거와 `Select list`(88:495) 목록입니다. 목록은 두꺼운 '
          '유리(반경 20, 안쪽 여백 6)에 40px 행, 선택 행은 `overlay-ink-6`과 18px 체크입니다. '
          '트리거의 캐럿은 16px이고 열리면 180° 돕니다. React의 `variant="chip"`은 '
          '`export type` 유니온이 아니라서 Flutter에서는 `chip` 불리언으로 받습니다.',
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
