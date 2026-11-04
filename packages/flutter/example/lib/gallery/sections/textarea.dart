import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `textarea` 갤러리 섹션입니다.
///
/// 상자, 오류, 비활성, 글자 수 제한 상태를 solid와 glass 두 표면에 같은 목록으로
/// 보여 줍니다.
class HoronTextareaGallerySection extends StatelessWidget {
  /// 기본 생성자입니다.
  const HoronTextareaGallerySection({super.key});

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
          Text('Textarea', style: theme.text.titleLg),
          SurfaceGroup(
            label: 'Solid',
            child: _textareas(theme, HoronInputSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _textareas(theme, HoronInputSurface.glass),
          ),
          Text(
            'Figma `Textarea`(58:137)입니다. 상자는 `min-h-28`(112)에서 시작해 입력이 '
            '늘면 함께 자라고, 좌우 여백은 12/14/20, 위아래는 8/12/14입니다. 글자는 '
            '`body-md`, 안내 문구는 `text-placeholder`, 오류 테두리는 `border-danger`입니다. '
            'Glass 표면은 `.veil-field` 한 겹입니다.',
            style: theme.text.bodySm.copyWith(
              color: theme.colors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 텍스트영역 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _textareas(HoronThemeData theme, HoronInputSurface surface) {
    return Wrap(
      spacing: theme.space.s4,
      runSpacing: theme.space.s4,
      crossAxisAlignment: WrapCrossAlignment.start,
      children: <Widget>[
        _TextareaCell(
          label: '기본',
          child: HoronTextarea(surface: surface, hintText: '메모를 남겨 주세요'),
        ),
        _TextareaCell(
          label: 'Invalid',
          child: HoronTextarea(
            surface: surface,
            invalid: true,
            hintText: '메모를 남겨 주세요',
          ),
        ),
        _TextareaCell(
          label: 'Disabled',
          child: HoronTextarea(
            surface: surface,
            enabled: false,
            hintText: '메모를 남겨 주세요',
          ),
        ),
        _TextareaCell(
          label: '최대 120자',
          child: HoronTextarea(
            surface: surface,
            maxLength: 120,
            hintText: '메모를 남겨 주세요',
          ),
        ),
      ],
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
