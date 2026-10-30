import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../section_scaffold.dart';

/// `textarea` 갤러리 섹션입니다.
///
/// 기본 유리 상자와 오류·비활성 상태를 나란히 보여 줍니다.
class HoronTextareaGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTextareaGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return GallerySectionScaffold(
      title: 'Textarea',
      variants: <Widget>[
        const _TextareaCell(
          label: '기본 (112px 유리 상자)',
          child: HoronTextarea(hintText: '메모를 남겨 주세요'),
        ),
        const _TextareaCell(
          label: 'Invalid',
          child: HoronTextarea(invalid: true, hintText: '메모를 남겨 주세요'),
        ),
      ],
      states: <Widget>[
        const _TextareaCell(
          label: 'Disabled',
          child: HoronTextarea(enabled: false, hintText: '메모를 남겨 주세요'),
        ),
        const _TextareaCell(
          label: '최대 120자',
          child: HoronTextarea(maxLength: 120, hintText: '메모를 남겨 주세요'),
        ),
      ],
      notes:
          'Figma `Textarea`(58:137)입니다. 상자는 `min-h-28`(112)에서 시작해 입력이 늘면 '
          '함께 자라고, 여백은 좌우 14·위아래 12입니다. 글자는 `body-md`, 안내 문구는 '
          '`text-placeholder`, 오류 테두리는 `border-danger`입니다.',
    );
  }
}

/// 여러 줄 입력 하나를 캡션과 함께 보여 주는 칸입니다.
class _TextareaCell extends StatelessWidget {
  const _TextareaCell({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return SizedBox(
      width: 280,
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
