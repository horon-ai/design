import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

import '../surface_group.dart';

/// `date_field`의 갤러리 섹션입니다.
///
/// 빈 필드, 값이 있는 필드, 잘못된 값, 비활성 필드를 solid와 glass 두 표면에
/// 같은 목록으로 보여 줍니다.
class HoronDateFieldGallerySection extends StatelessWidget {
  /// 섹션을 만듭니다.
  const HoronDateFieldGallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Padding(
      padding: EdgeInsets.all(theme.space.s4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: theme.space.s6,
        children: <Widget>[
          SurfaceGroup(
            label: 'Solid',
            child: _fields(theme, HoronSurface.solid),
          ),
          SurfaceGroup(
            label: 'Glass',
            glass: true,
            child: _fields(theme, HoronSurface.glass),
          ),
        ],
      ),
    );
  }

  /// 한 표면의 필드 표본 목록입니다. 표면만 바뀌고 내용은 같습니다.
  Widget _fields(HoronThemeData theme, HoronSurface surface) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        _Label('빈 필드'),
        SizedBox(height: theme.space.s2),
        HoronDateField(placeholder: '날짜 선택', surface: surface),
        SizedBox(height: theme.space.s4),
        _Label('값이 있는 필드'),
        SizedBox(height: theme.space.s2),
        HoronDateField(
          value: DateTime(2026, 10, 29),
          formatDate: (DateTime date) =>
              '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}',
          surface: surface,
          onValueChange: (_) {},
        ),
        SizedBox(height: theme.space.s4),
        _Label('잘못된 값'),
        SizedBox(height: theme.space.s2),
        HoronDateField(placeholder: '날짜 선택', surface: surface, invalid: true),
        SizedBox(height: theme.space.s4),
        _Label('비활성'),
        SizedBox(height: theme.space.s2),
        HoronDateField(placeholder: '날짜 선택', surface: surface, disabled: true),
      ],
    );
  }
}

/// 표본 이름입니다.
class _Label extends StatelessWidget {
  const _Label(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    return Text(
      text,
      style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
    );
  }
}
