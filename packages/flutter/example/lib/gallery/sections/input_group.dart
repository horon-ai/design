import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `input_group` 갤러리 섹션입니다.
///
/// 앞 칸·뒤 칸·양쪽 칸과 오류·비활성 상태를 나란히 보여 줍니다.
class HoronInputGroupGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronInputGroupGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Input group',
      variants: <Widget>[
        const _Cell(
          label: '앞 칸',
          child: HoronInputGroup(prefix: Text('+82'), hintText: '1010 1234'),
        ),
        const _Cell(
          label: '뒤 칸 (14px 아이콘)',
          child: HoronInputGroup(
            suffix: Icon(Icons.attach_money),
            hintText: '0.00',
          ),
        ),
        const _Cell(
          label: '양쪽 칸',
          child: HoronInputGroup(
            prefix: Text('+82'),
            suffix: Icon(Icons.attach_money),
            hintText: '1010 1234',
          ),
        ),
      ],
      states: <Widget>[
        const _Cell(
          label: '오류 (구분선도 위험 색)',
          child: HoronInputGroup(
            prefix: Text('+82'),
            invalid: true,
            hintText: '1010 1234',
          ),
        ),
        const _Cell(
          label: 'Disabled',
          child: HoronInputGroup(
            prefix: Text('+82'),
            disabled: true,
            hintText: '1010 1234',
          ),
        ),
      ],
      notes:
          'Figma `Input group`(60:429)입니다. 40px 유리 상자를 앞 칸·입력·뒤 칸으로 나누고 '
          '사이에 1px 구분선을 둡니다. 칸은 `overlay-ink-4` 바탕에 `label-md`, 14px 아이콘을 '
          '씁니다. 구분선은 hover에서 `border-strong`, 오류에서 `border-danger`가 됩니다.',
    );
  }
}

/// 그룹 하나를 캡션과 함께 보여 주는 칸입니다.
class _Cell extends StatelessWidget {
  const _Cell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 260,
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
