import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `input` 갤러리 섹션입니다.
///
/// 두 크기와 세 표면을 나란히 놓고, 아이콘·오류·비활성 상태를 덧붙입니다.
class HoronInputGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Input',
      variants: <Widget>[
        const _InputCell(
          label: 'MD · glass',
          child: HoronInput(hintText: '이메일'),
        ),
        const _InputCell(
          label: 'LG · glass',
          child: HoronInput(size: HoronInputSize.lg, hintText: '이메일'),
        ),
        const _InputCell(
          label: 'MD · solid',
          child: HoronInput(surface: HoronInputSurface.solid, hintText: '이메일'),
        ),
        const _InputCell(
          label: 'MD · solidOnPage',
          child: HoronInput(
            surface: HoronInputSurface.solidOnPage,
            hintText: '이메일',
          ),
        ),
      ],
      states: <Widget>[
        const _InputCell(
          label: '선행 아이콘 (16px)',
          child: HoronInput(icon: Icon(Icons.search), hintText: '검색'),
        ),
        const _InputCell(
          label: 'Invalid',
          child: HoronInput(invalid: true, hintText: '이메일'),
        ),
        const _InputCell(
          label: 'Disabled',
          child: HoronInput(enabled: false, hintText: '이메일'),
        ),
      ],
      notes:
          'Figma `Input`(58:126)입니다. 상자는 40(MD)·48(LG)이고 반경은 `radius.md`(12), '
          '좌우 여백은 14입니다. Glass 표면은 유리 레이어 위에 테두리를 얹고, Solid와 '
          'SolidOnPage는 불투명 채움을 씁니다. 선행 아이콘은 `text-secondary`로 MD 16px·LG 20px입니다.',
    );
  }
}

/// 입력 하나를 캡션과 함께 보여 주는 칸입니다.
class _InputCell extends StatelessWidget {
  const _InputCell({required this.label, required this.child});

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
